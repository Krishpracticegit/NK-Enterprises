import Razorpay from 'razorpay';
import crypto from 'crypto';

// Helper function to get initialized Razorpay instance
const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_samplekey123',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'sample_razorpay_secret'
  });
};

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Private
export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ message: 'Please provide a valid order amount' });
    }

    const razorpay = getRazorpayInstance();

    // Convert amount in Rupees to paise (1 INR = 100 paise)
    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: 'INR',
      receipt: `receipt_nk_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_samplekey123'
    });
  } catch (error) {
    console.error(`[Razorpay Order Creation Error]: ${error.message}`);
    return res.status(500).json({ message: `Razorpay order creation failed: ${error.message}` });
  }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payment/verify
// @access  Private
export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        verified: false,
        message: 'Missing required Razorpay parameters (razorpay_order_id, razorpay_payment_id, razorpay_signature)'
      });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || 'sample_razorpay_secret';
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    const isVerified = expectedSignature === razorpay_signature;

    if (isVerified) {
      return res.status(200).json({
        verified: true,
        razorpay_order_id,
        razorpay_payment_id,
        message: 'Payment signature verified successfully'
      });
    } else {
      return res.status(400).json({
        verified: false,
        message: 'Payment verification failed: Invalid signature'
      });
    }
  } catch (error) {
    console.error(`[Razorpay Verification Error]: ${error.message}`);
    return res.status(500).json({ verified: false, message: error.message });
  }
};
