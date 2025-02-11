const express = require('express');
const { uploadFile, getUploads, deleteUpload } = require('../controllers/upload.controller');
const upload = require('../middleware/upload.middleware');
const {authMiddleware} = require('../middleware/auth.middleware');
const router = express.Router();

// Upload a file
router.post('/upload', authMiddleware, upload.single('file'), uploadFile);

// Get all uploads
router.get('/', getUploads);

// Delete an upload by ID
router.delete('/:upload_id', authMiddleware, deleteUpload);

module.exports = router;
