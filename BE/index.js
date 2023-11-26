const express = require('express');
const multer = require('multer');
const fs = require('fs');
const PDFParser = require('pdf-parse');
const mammoth = require('mammoth');

const app = express();
const port = 5000;

// Multer configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());

// Endpoint for file upload and conversion
app.post('/upload', upload.single('pdfFile'), async (req, res) => {
  try {
    const pdfBuffer = req.file.buffer;
    const data = await PDFParser(pdfBuffer);
    mammoth.extractRawText({ array: data.text })
      .then((result) => {
        const wordContent = result.value;
        const tempFilePath = 'converted.docx';
        fs.writeFileSync(tempFilePath, wordContent);
        res.download(tempFilePath, 'converted.docx', () => {
          fs.unlinkSync(tempFilePath);
        });
      })
      .catch((error) => {
        console.error('Error converting to Word:', error);
        res.status(500).json({ error: 'Error converting to Word' });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
