import React, { useState } from 'react';
import axios from 'axios';

const PDF_TO_WORD = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setSelectedFile(file);
  };

  const handleFileUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('pdfFile', selectedFile);

      const response = await axios.post('http://localhost:5000/upload', formData, {
        responseType: 'blob', // Receive response as a blob
      });

      // Create a blob and download the converted Word file
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'converted.docx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <div
        style={{
          border: '2px dashed #ccc',
          padding: '20px',
          textAlign: 'center',
          cursor: 'pointer',
        }}
        onDrop={handleFileDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <p>Drag and drop a PDF file here</p>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="fileInput"
        />
        <label htmlFor="fileInput" style={{ cursor: 'pointer' }}>
          or click to select a file
        </label>
        {selectedFile && (
          <p style={{ marginTop: '10px' }}>Selected file: {selectedFile.name}</p>
        )}
      </div>
      <button onClick={handleFileUpload}>Convert and Download as Word</button>
      <div>
        <h2>PDF TO WORD</h2>
        <p>You can convert a PDF file to Word format using this tool.</p>
      </div>
    </div>
  );
};

export default PDF_TO_WORD;
