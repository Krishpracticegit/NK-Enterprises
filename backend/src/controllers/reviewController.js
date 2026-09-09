import Review from '../models/Review.js';
import Product from '../models/Product.js';

// @desc    Create a product review & recalculate rating average
// @route   POST /api/products/:productId/reviews
// @access  Private
export const createReview = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ message: 'Please provide a rating and comment' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already submitted a review
    const alreadyReviewed = await Review.findOne({ product: productId, user: req.user._id });
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      rating: Number(rating),
      comment: comment.trim()
    });

    // Recalculate Product.ratingsAverage and Product.numReviews
    const reviews = await Review.find({ product: productId });
    product.numReviews = reviews.length;
    product.ratingsAverage = Number(
      (reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length).toFixed(1)
    );

    await product.save();

    const populatedReview = await review.populate('user', 'name');
    return res.status(201).json(populatedReview);
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a product
// @route   GET /api/products/:productId/reviews
// @access  Public
export const getReviewsForProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    return res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};
