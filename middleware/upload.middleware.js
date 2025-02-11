const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define upload paths for different file types
const uploadPaths = {
    images: path.join(__dirname, '../uploads/images'),
    videos: path.join(__dirname, '../uploads/videos'),
    audios: path.join(__dirname, '../uploads/audios'),
    documents: path.join(__dirname, '../uploads/documents'),
};

// Create upload directories if they don't exist
Object.values(uploadPaths).forEach((dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Multer storage settings
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath = uploadPaths.documents; // Default to documents
        if (file.mimetype.startsWith('image/')) {
            uploadPath = uploadPaths.images;
        } else if (file.mimetype.startsWith('video/')) {
            uploadPath = uploadPaths.videos;
        } else if (file.mimetype.startsWith('audio/')) {
            uploadPath = uploadPaths.audios;
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

// File filter to allow specific file types
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'audio/mpeg', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images, videos, audio, and documents are allowed.'), false);
    }
};

// Set file size limit (10 MB)
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});

module.exports = upload;