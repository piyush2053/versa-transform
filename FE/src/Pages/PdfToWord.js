import React, { useState } from 'react';
import axios from 'axios';
import { Button, Container, Typography, Paper, Input, FormControl, InputLabel, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';

const CenteredContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const DropArea = styled('div')({
  border: '2px dashed #ccc',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
  position: 'relative',
  minHeight: '100px',
});

const FileInput = styled(Input)({
  display: 'none',
});

const StyledLabel = styled(InputLabel)({
  cursor: 'pointer',
  color: '#1976D2',
  '&:hover': {
    textDecoration: 'underline',
  },
});

const Loader = styled(CircularProgress)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  marginTop: '-12px',
  marginLeft: '-12px',
});

const PDF_TO_WORD = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

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
      setLoading(true);

      const formData = new FormData();
      formData.append('pdfFile', selectedFile);

      const response = await axios.post('https://versa-transfrom-backend.onrender.com/upload', formData, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'converted.docx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CenteredContainer maxWidth="md">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          PDF TO WORD
        </Typography>
        <Typography variant="body1">
          You can convert a PDF file to Word format using this tool.
        </Typography>
        <br />
        <DropArea
          onDrop={handleFileDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <Typography variant="body1">Drag and drop a PDF file here</Typography>
          <label htmlFor="fileInput">
            <FileInput
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              id="fileInput"
              style={{ display: 'none' }}
            />
            <StyledLabel htmlFor="fileInput">or click to select a file</StyledLabel>
          </label>
          {selectedFile && (
            <Typography variant="body1" style={{ marginTop: '10px' }}>
              Selected file: {selectedFile.name}
            </Typography>
          )}
          {loading && <Loader size={24} color="primary" />}
        </DropArea>
        <Button
          variant="contained"
          color="primary"
          onClick={handleFileUpload}
          style={{ marginTop: '20px' }}
        >
          Convert and Download as Word
        </Button>
      </Paper>
    </CenteredContainer>
  );
};

export default PDF_TO_WORD;
