const express = require('express');
const multer = require('multer');
const fs = require('fs');
const PDFParser = require('pdf-parse');
const htmlDocx = require('html-docx-js');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());

app.post('/upload', upload.single('pdfFile'), async (req, res) => {
  try {
    // Check if the file is present in the request
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const pdfBuffer = req.file.buffer;

    // Log the size of the PDF buffer
    console.log('PDF Buffer Size:', pdfBuffer.length);

    // Use pdf-parse to extract text from the PDF
    const data = await PDFParser(pdfBuffer);

    // Log the extracted text
    console.log('Extracted Text:', data.text);

    // Create an HTML template with the extracted text
    const htmlContent = `<html><body>${data.text}</body></html>`;

    // Convert the HTML to a Word document using html-docx-js
    const { value } = await htmlDocx.asBlob([htmlContent], { orientation: 'portrait' });

    // Save the Word content to a temporary file
    const tempFilePath = 'converted.docx';
    fs.writeFileSync(tempFilePath, Buffer.from(value));

    // Send the Word file as a response
    res.download(tempFilePath, 'converted.docx', () => {
      // Delete the temporary file after sending
      fs.unlinkSync(tempFilePath);
    });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
