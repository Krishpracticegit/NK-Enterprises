import express from 'express';
import { createReview, getReviewsForProduct } from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });

// Routes for /api/products/:productId/reviews
router.route('/')
  .get(getReviewsForProduct)
  .post(protect, createReview);

export default router;
