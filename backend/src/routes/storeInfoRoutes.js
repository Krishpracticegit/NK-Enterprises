import express from 'express';
import { getStoreInfo, updateStoreInfo } from '../controllers/storeInfoController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';

const router = express.Router();

router.get('/', getStoreInfo);
router.put('/', protect, adminOnly, updateStoreInfo);

export default router;
