// image_processing_api.js

const express = require('express');
const multer = require('multer');
const Jimp = require('jimp');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Upload image
app.post('/upload', upload.single('image'), (req, res) => {
    const { file } = req;
    res.status(200).json({ message: 'Image uploaded successfully', filename: file.filename });
});

// Apply filter to image
app.get('/filter/:filename', async (req, res) => {
    const { filename } = req.params;
    try {
        const image = await Jimp.read(`uploads/${filename}`);
        image.invert().write(`uploads/inverted_${filename}`);
        res.status(200).json({ message: 'Filter applied successfully', filteredFilename: `inverted_${filename}` });
    } catch (error) {
        res.status(500).json({ message: 'Error applying filter to image' });
    }
});

// Download image
app.get('/download/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = `uploads/${filename}`;
    res.download(filePath, (err) => {
        if (err) {
            res.status(404).json({ message: 'File not found' });
        }
    });
});

// Listen on port
const port = 3000;
app.listen(port, () => {
    console.log(`Image processing API running on http://localhost:${port}`);
});
