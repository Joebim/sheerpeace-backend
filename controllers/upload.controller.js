const { db } = require('../config/db');
const path = require('path');
const fs = require('fs');

// Upload File
exports.uploadFile = async (req, res) => {
    try {
        console.log('Request File:', req.file);
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { originalname, filename, mimetype } = req.file;
        console.log('File Details:', { originalname, filename, mimetype });

        let folder = 'documents';
        if (mimetype.startsWith('image/')) folder = 'images';
        else if (mimetype.startsWith('video/')) folder = 'videos';
        else if (mimetype.startsWith('audio/')) folder = 'audios';

        const fileUrl = `/uploads/${folder}/${filename}`;

        const [upload] = await db('uploads')
            .insert({
                name: originalname,
                file: fileUrl,
                type: mimetype.substring(0, 50),
            })
            .returning('*');

        console.log('Upload Result:', upload);
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

// Update an upload
exports.updateUpload = async (req, res) => {
    try {
        const { upload_id } = req.params;
        const { name } = req.body;

        // Ensure at least one field is provided for update
        if (!name || name.trim() === "") {
            return res.status(400).json({ message: 'Invalid update data: name is required' });
        }

        const [updatedUpload] = await db('uploads')
            .where({ id: upload_id })
            .update({ name })
            .returning('*');

        if (!updatedUpload) {
            return res.status(404).json({ message: 'Upload not found' });
        }

        res.json({ message: 'Upload updated successfully', upload: updatedUpload });
    } catch (error) {
        console.error('Update Upload Error:', error);
        res.status(500).json({ message: 'Server error while updating upload', error: error.message });
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
