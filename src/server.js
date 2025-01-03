const express = require('express');
const Groq = require("groq-sdk");
const dotenv = require("dotenv");
const cors = require('cors');

dotenv.config(); // Load environment variables from the .env file

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const app = express();
const port = 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Define the /api/justifyReason route
app.post('/api/justifyReason', async (req, res) => {
  const { resumeText, jobDescription, reason } = req.body;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `The candidate's resume is as follows:
                    ${resumeText}

                    The job description is as follows:
                    ${jobDescription}

                    The reason for rejection is "${reason}". Provide a detailed justification for this reason.`,
        },
      ],
      model: "llama-3.1-70b-versatile",
    });

    const justification = chatCompletion.choices[0]?.message?.content || "";
    res.json({ justification });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});