import express from 'express';
import { getAdminStats } from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';

const router = express.Router();

// Admin-only stats route
router.get('/stats', protect, adminOnly, getAdminStats);

export default router;
