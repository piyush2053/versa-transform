const express = require('express');
const multer = require('multer');
const fs = require('fs');
const PDFParser = require('pdf-parse');
const Docxtemplater = require('docxtemplater');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());

app.post('/upload', upload.single('pdfFile'), async (req, res) => {
  try {
    const pdfBuffer = req.file.buffer;

    // Use pdf-parse to extract text from the PDF
    const data = await PDFParser(pdfBuffer);

    // Create a template with the extracted text
    const template = `<html><body>{text}</body></html>`;
    
    // Prepare the data for the template
    const templateData = { text: data.text };

    // Use docxtemplater to fill the template
    const doc = new Docxtemplater();
    doc.loadZip(new Buffer(fs.readFileSync('template.docx')));
    doc.setData(templateData);
    doc.render();

    // Save the Word content to a temporary file
    const tempFilePath = 'converted.docx';
    const buffer = doc.getZip().generate({ type: 'nodebuffer' });
    fs.writeFileSync(tempFilePath, buffer);

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
