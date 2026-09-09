import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @desc    Get Admin Dashboard Aggregated Stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();

    // Calculate total revenue from paid orders
    const revenueAggregation = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
    ]);

    const totalRevenue = revenueAggregation[0]?.totalRevenue || 0;
    const totalProducts = await Product.countDocuments();
    const lowStockProducts = await Product.countDocuments({ stock: { $lte: 5 } });

    return res.status(200).json({
      totalOrders,
      totalRevenue,
      totalProducts,
      lowStockProducts
    });
  } catch (error) {
    next(error);
  }
};
