const { db } = require('../config/db');
const path = require('path');
const fs = require('fs');

// Upload File
exports.uploadFile = async (req, res) => {
    try {
        console.log('Request File:', req.file); // Log the uploaded file
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { originalname, filename, mimetype } = req.file;
        console.log('File Details:', { originalname, filename, mimetype }); // Log file details

        // Determine the file type folder
        let folder = 'documents'; // Default folder
        if (mimetype.startsWith('image/')) {
            folder = 'images';
        } else if (mimetype.startsWith('video/')) {
            folder = 'videos';
        } else if (mimetype.startsWith('audio/')) {
            folder = 'audios';
        }

        // Construct the file URL
        const fileUrl = `/uploads/${folder}/${filename}`;

        // Insert file details into the database
        const [upload] = await db('uploads')
            .insert({
                name: originalname,
                file: fileUrl, // Store the file URL
                type: mimetype.substring(0, 50), // Truncate mimetype if necessary
            })
            .returning('*');

        console.log('Upload Result:', upload); // Log the database insertion result
        res.status(201).json({ message: 'File uploaded successfully', upload });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ message: 'Server error while uploading file', error: error.message });
    }
};

// Get all uploads
exports.getUploads = async (req, res) => {
    try {
        const uploads = await db('uploads').select('*');
        res.json(uploads);
    } catch (error) {
        console.error('Fetch Uploads Error:', error);
        res.status(500).json({ message: 'Server error while fetching uploads', error: error.message });
    }
};

// Delete an upload
exports.deleteUpload = async (req, res) => {
    try {
        const { upload_id } = req.params;

        const [upload] = await db('uploads').where({ id: upload_id }).del().returning('*');

        if (!upload) {
            return res.status(404).json({ message: 'Upload not found' });
        }

        // Construct the file path and delete the file
        const filePath = path.join(__dirname, '..', upload.file);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        res.json({ message: 'Upload deleted successfully', upload });
    } catch (error) {
        console.error('Delete Upload Error:', error);
        res.status(500).json({ message: 'Server error while deleting upload', error: error.message });
    }
};