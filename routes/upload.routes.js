const express = require('express');
const { uploadFile, getUploads, deleteUpload, updateUpload, getUploadById } = require('../controllers/upload.controller');
const upload = require('../middleware/upload.middleware');
const {authMiddleware} = require('../middleware/auth.middleware');
const router = express.Router();

// Upload a file
router.post('/upload', authMiddleware, upload.single('file'), uploadFile);

// Get all uploads
router.get('/', getUploads);

router.get('/:upload_id', getUploadById);

// Delete an upload by ID
router.delete('/:upload_id', authMiddleware, deleteUpload);

router.put('/:upload_id',authMiddleware, updateUpload);

module.exports = router;
