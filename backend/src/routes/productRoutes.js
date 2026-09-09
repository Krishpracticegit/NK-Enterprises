import express from 'express';
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import reviewRoutes from './reviewRoutes.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';

const router = express.Router();

// Re-route into review router for product reviews
router.use('/:productId/reviews', reviewRoutes);

// Public routes
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);

// Admin-only protected routes
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

export default router;
