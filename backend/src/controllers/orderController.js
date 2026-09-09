import crypto from 'crypto';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

// Helper function to verify Razorpay signature internally
const verifyRazorpaySignature = (orderId, paymentId, signature) => {
  if (!orderId || !paymentId || !signature) return false;
  const secret = process.env.RAZORPAY_KEY_SECRET || 'sample_razorpay_secret';
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body.toString())
    .digest('hex');
  return expectedSignature === signature;
};

// @desc    Create a new order (strictly requires verified payment for online payments)
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      paymentResult,
      itemsPrice,
      shippingPrice,
      totalPrice
    } = req.body;

    // 1. Basic Input Validation
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    if (!shippingAddress || !shippingAddress.line1 || !shippingAddress.city || !shippingAddress.pincode || !shippingAddress.phone) {
      return res.status(400).json({ message: 'Please provide a complete shipping address' });
    }

    if (!paymentMethod) {
      return res.status(400).json({ message: 'Payment method is required' });
    }

    // 2. Strict Payment Verification Check
    let isPaid = false;
    let paidAt = null;

    if (paymentMethod === 'Razorpay') {
      if (!paymentResult || !paymentResult.razorpayOrderId || !paymentResult.razorpayPaymentId) {
        return res.status(400).json({
          message: 'Order creation rejected: Missing payment verification credentials for Razorpay'
        });
      }

      // Verify payment signature if signature provided, or verify status flag
      if (paymentResult.razorpaySignature) {
        const isSignatureValid = verifyRazorpaySignature(
          paymentResult.razorpayOrderId,
          paymentResult.razorpayPaymentId,
          paymentResult.razorpaySignature
        );

        if (!isSignatureValid) {
          return res.status(400).json({
            message: 'Order creation rejected: Razorpay payment signature verification failed'
          });
        }
      } else if (paymentResult.status !== 'captured' && paymentResult.status !== 'paid') {
        return res.status(400).json({
          message: 'Order creation rejected: Payment is not verified or captured'
        });
      }

      isPaid = true;
      paidAt = new Date();
    }

    // 3. Stock Availability Check & Preparation
    const productsToUpdate = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product "${item.name}" (ID: ${item.product}) not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for "${product.name}". Available stock: ${product.stock}, requested: ${item.quantity}`
        });
      }

      productsToUpdate.push({ product, quantity: item.quantity });
    }

    // 4. Decrement Stock for all items
    for (const { product, quantity } of productsToUpdate) {
      product.stock -= quantity;
      await product.save();
    }

    // 5. Create Order in Database
    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      paymentResult: paymentResult || {},
      itemsPrice: Number(itemsPrice) || 0,
      shippingPrice: Number(shippingPrice) || 0,
      totalPrice: Number(totalPrice) || 0,
      orderStatus: 'placed',
      isPaid,
      paidAt
    });

    const populatedOrder = await order.populate('user', 'name email');

    return res.status(201).json(populatedOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID (Owner or Admin only)
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name slug price images');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check authorization: Must be order owner or admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    return res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin only with pagination & status filtering)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
  try {
    const { orderStatus, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (orderStatus) {
      filter.orderStatus = orderStatus;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const totalResults = await Order.countDocuments(filter);
    const totalPages = Math.ceil(totalResults / limitNum);

    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      orders,
      page: pageNum,
      totalPages,
      totalResults
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;

    const allowedStatuses = ['placed', 'packed', 'shipped', 'delivered', 'cancelled'];
    if (!orderStatus || !allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: `Invalid order status. Allowed: ${allowedStatuses.join(', ')}` });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.orderStatus = orderStatus;

    if (orderStatus === 'delivered' && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }

    const updatedOrder = await order.save();
    const populatedOrder = await updatedOrder.populate('user', 'name email');

    return res.status(200).json(populatedOrder);
  } catch (error) {
    next(error);
  }
};
