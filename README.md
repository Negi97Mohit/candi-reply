# Fujm Candi Reply

Fujm Candi Reply is a React-based web application that simplifies the process of evaluating job applications. It enables recruiters to upload candidate resumes, compare them with job descriptions, and generate detailed justifications for decisions such as rejection or acceptance.

## Features

- **Resume Parsing**: Supports `.txt`, `.pdf`, and `.docx` file formats.
- **Job-Resume Comparison**: Calculates a match percentage between the job description and the candidate's resume.
- **Email Justification**: Automatically generates a detailed justification for candidate decisions based on input data.
- **Clear UI**: Intuitive interface for recruiters to manage job descriptions, resumes, and reasons for rejection or acceptance.
- **Backend Integration**: Communicates with a backend server to process data and generate outputs.

## Tech Stack

### Frontend
- React
- Mammoth.js (for parsing `.docx` files)
- PDF.js (for parsing `.pdf` files)

### Backend
- Node.js with Express
- [Groq SDK](https://groq.dev) for AI-powered text processing and justifications

### Other
- CORS for cross-origin requests
- dotenv for environment variables

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm (v6 or later)

### Installation

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/yourusername/fujm-candi-reply.git
    cd fujm-candi-reply
    ```

2. **Install Dependencies**:
    - For the frontend:
        ```bash
        cd frontend
        npm install
        ```
    - For the backend:
        ```bash
        cd backend
        npm install
        ```

3. **Set Up Environment Variables**:
    - Create a `.env` file in the `backend` directory:
        ```
        GROQ_API_KEY=your_groq_api_key
        ```
    - Replace `your_groq_api_key` with your Groq API key.

4. **Start the Development Servers**:
    - Start the backend server:
        ```bash
        cd backend
        npm start
        ```
    - Start the React frontend:
        ```bash
        cd frontend
        npm start
        ```

    The application should now be accessible at `http://localhost:3000`.

## Usage

1. **Enter Job Description**: Paste the job qualifications in the provided text area.
2. **Upload Resume**: Upload a candidate's resume in `.txt`, `.pdf`, or `.docx` format.
3. **Select Rejection Reason**: Choose a reason for rejection (if applicable).
4. **Generate Justification**: Click "Justify Reason" to generate a detailed explanation.
5. **Review Results**: View the match percentage and justification in the UI.

## Project Structure

```plaintext
fujm-candi-reply/
├── frontend/        # React frontend
│   ├── src/
│   └── public/
├── backend/         # Node.js backend
│   ├── routes/
│   └── utils/
└── README.md
```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for review.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
