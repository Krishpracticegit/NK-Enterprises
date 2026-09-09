import Coupon from '../models/Coupon.js';

// @desc    Validate coupon code
// @route   POST /api/coupons/validate
// @access  Public
export const validateCoupon = async (req, res, next) => {
  try {
    const { code, orderTotal } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Please enter a coupon code' });
    }

    const coupon = await Coupon.findOne({ code: code.trim().toUpperCase(), isActive: true });
    if (!coupon) {
      return res.status(404).json({ message: 'Invalid or inactive coupon code' });
    }

    if (new Date() > new Date(coupon.expiryDate)) {
      return res.status(400).json({ message: 'Coupon code has expired' });
    }

    if (orderTotal !== undefined && Number(orderTotal) < coupon.minOrderValue) {
      return res.status(400).json({
        message: `Minimum order value of $${coupon.minOrderValue} is required for this coupon`
      });
    }

    const discountAmount = Number(((Number(orderTotal || 0) * coupon.discountPercent) / 100).toFixed(2));

    return res.status(200).json({
      valid: true,
      code: coupon.code,
      discountPercent: coupon.discountPercent,
      discountAmount,
      message: `${coupon.discountPercent}% discount applied successfully!`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
export const getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return res.status(200).json(coupons);
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Create coupon
// @route   POST /api/coupons
// @access  Private/Admin
export const createCoupon = async (req, res, next) => {
  try {
    const { code, discountPercent, expiryDate, minOrderValue, isActive } = req.body;

    if (!code || !discountPercent || !expiryDate) {
      return res.status(400).json({ message: 'Please provide code, discount percent, and expiry date' });
    }

    const couponExists = await Coupon.findOne({ code: code.trim().toUpperCase() });
    if (couponExists) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    const coupon = await Coupon.create({
      code: code.trim().toUpperCase(),
      discountPercent: Number(discountPercent),
      expiryDate,
      minOrderValue: Number(minOrderValue) || 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true
    });

    return res.status(201).json(coupon);
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
export const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    await coupon.deleteOne();
    return res.status(200).json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    next(error);
  }
};
