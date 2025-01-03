import React, { useState } from 'react';
import './App.css';
import logoImage from './assets/img/m1.png'; // Replace with the actual path to your logo image
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist/webpack';

// Set the worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

function App() {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [email, setEmail] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [file, setFile] = useState(null);
  const [matchPercentage, setMatchPercentage] = useState('');
  const [justification, setJustification] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const formatJustification = (text) => {
    // Remove ** from the text
    const cleanedText = text.replace(/\*\*/g, '');
  
    // Split the text into the introductory paragraph and the numbered points
    const introEndIndex = cleanedText.indexOf("1.");
    const introText = introEndIndex !== -1 ? cleanedText.slice(0, introEndIndex).trim() : cleanedText;
    const pointsText = introEndIndex !== -1 ? cleanedText.slice(introEndIndex) : "";
  
    // Split the numbered points into individual items
    const points = pointsText.split(/\d+\.\s+/).filter(point => point.trim() !== '');
  
    return (
      <>
        {introText && <p className="intro-text">{introText}</p>}
        {points.length > 0 && (
          <ul className="justification-list">
            {points.map((point, index) => {
              // Split the point into title and description (if applicable)
              const titleEndIndex = point.indexOf(":");
              const title = titleEndIndex !== -1 ? point.slice(0, titleEndIndex).trim() : "";
              const description = titleEndIndex !== -1 ? point.slice(titleEndIndex + 1).trim() : point.trim();
  
              return (
                <li key={index} className="justification-item">
                  <strong>{index + 1}. {title}</strong>
                  {description && <p>{description}</p>}
                </li>
              );
            })}
          </ul>
        )}
      </>
    );
  };
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const fileReader = new FileReader();

      fileReader.onload = async (event) => {
        const arrayBuffer = event.target.result;

        // Handle different file types
        if (selectedFile.type === 'text/plain') {
          // Handle .txt files
          setResumeText(event.target.result);
        } else if (selectedFile.type === 'application/pdf') {
          // Handle .pdf files
          const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
          let textContent = '';

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const text = await page.getTextContent();
            textContent += text.items.map((item) => item.str).join(' ');
          }

          setResumeText(textContent);
        } else if (selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          // Handle .docx files
          const result = await mammoth.extractRawText({ arrayBuffer });
          setResumeText(result.value);
        } else {
          alert('Unsupported file type. Please upload a .txt, .pdf, or .docx file.');
        }
      };

      // Read the file as ArrayBuffer
      fileReader.readAsArrayBuffer(selectedFile);
    }
  };

  const handleSend = async () => {
    // Logic to send the email or process the data
    console.log('Job Description:', jobDescription);
    console.log('Resume Text:', resumeText);
    console.log('Email:', email);
    console.log('Reason:', selectedReason);
    console.log('File:', file);

    // Send data to the backend
    try {
      const response = await fetch('http://localhost:3002/api/compareQualifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfile: { resumeText },
          jobQualifications: jobDescription.split('\n').map(line => ({ skill: line.trim() })),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMatchPercentage(data.matchPercentage);
      } else {
        console.error('Error from backend:', data.error);
      }
    } catch (error) {
      console.error('Error sending data to backend:', error);
    }
  };

  const handleJustifyReason = async () => {
    // Validate inputs
    if (!resumeText || !jobDescription || !selectedReason) {
      alert('Resume text, job description, and reason are required.');
      return;
    }

    // Send data to the backend to get justification
    try {
      const response = await fetch('http://localhost:3002/api/justifyReason', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText,
          jobDescription,
          reason: selectedReason,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setJustification(data.justification);
        setShowPopup(true); // Show the popup
      } else {
        console.error('Error from backend:', data.error);
      }
    } catch (error) {
      console.error('Error sending data to backend:', error);
    }
  };

  const handleClear = () => {
    setJobDescription('');
    setResumeText('');
    setEmail('');
    setSelectedReason('');
    setFile(null);
    setMatchPercentage('');
    setJustification('');
    setShowPopup(false);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo-container">
          <img src={logoImage} alt="Logo" className="logo-image" />
          <span className="logo-text">fujm Candi Reply</span>
        </div>
      </header>

      <div className="form-container">
        <div className="form-group">
          <label>Job Description:</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Enter job description"
          />
        </div>

        <div className="form-group">
          <label>Reason for Rejection:</label>
          <select value={selectedReason} onChange={(e) => setSelectedReason(e.target.value)}>
            <option value="">Select a reason</option>
            <option value="Not qualified">Not qualified</option>
            <option value="Overqualified">Overqualified</option>
            <option value="Position filled">Position filled</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Candidate Resume (Text):</label>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Enter candidate resume"
          />
        </div>

        <div className="form-group">
          <label>Upload Resume:</label>
          <input type="file" onChange={handleFileChange} />
        </div>

        <div className="form-group">
          <label>Candidate Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter candidate email"
          />
        </div>

        <div className="button-group">
          <button onClick={handleClear}>Clear All</button>
          <button onClick={handleSend}>Send</button>
          <button onClick={handleJustifyReason}>Justify Reason</button>
        </div>

        {matchPercentage && (
          <div className="result-section">
            <h3 className="result-heading">Match Percentage</h3>
            <p className="result-text">{matchPercentage}</p>
          </div>
        )}

        {showPopup && (
          <div className="popup">
            <div className="popup-content">
              <h3>Justification</h3>
              {formatJustification(justification)}
              <button onClick={closePopup}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;