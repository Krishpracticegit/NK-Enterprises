import express from 'express';

const router = express.Router();

// @route   GET /api/health
// @desc    Health check endpoint
// @access  Public
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'NK Enterprises API is running smoothly',
    timestamp: new Date().toISOString()
  });
});

export default router;
