import express from 'express';
import { uploadImage } from '../controllers/uploadController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// @route   POST /api/upload
// @desc    Upload image to Cloudinary (Admin only)
// @access  Private/Admin
router.post('/', protect, adminOnly, upload.single('image'), uploadImage);

export default router;
