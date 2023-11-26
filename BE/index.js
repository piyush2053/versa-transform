const express = require('express');
const multer = require('multer');
const pdf2docx = require('pdf2docx');

const app = express();
const port = 5000;

// Multer configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());

// Endpoint for file upload and conversion
app.post('/upload', upload.single('pdfFile'), (req, res) => {
  try {
    const pdfBuffer = req.file.buffer;

    // Convert PDF buffer to Word buffer using pdf2docx library
    const wordBuffer = pdf2docx(pdfBuffer);

    // Send the Word file as a response
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename=converted.docx');
    res.send(wordBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
