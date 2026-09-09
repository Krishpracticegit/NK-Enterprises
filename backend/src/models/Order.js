import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  image: {
    type: String
  }
});

const shippingAddressSchema = new mongoose.Schema({
  line1: { type: String, required: [true, 'Address line 1 is required'], trim: true },
  line2: { type: String, trim: true },
  city: { type: String, required: [true, 'City is required'], trim: true },
  state: { type: String, required: [true, 'State is required'], trim: true },
  pincode: { type: String, required: [true, 'Pincode is required'], trim: true },
  phone: { type: String, required: [true, 'Phone number is required'], trim: true }
});

const paymentResultSchema = new mongoose.Schema({
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  status: { type: String }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Order must belong to a user']
  },
  items: [orderItemSchema],
  shippingAddress: {
    type: shippingAddressSchema,
    required: true
  },
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: {
      values: ['Razorpay', 'COD', 'Card', 'UPI'],
      message: '{VALUE} is not a supported payment method'
    }
  },
  paymentResult: paymentResultSchema,
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  orderStatus: {
    type: String,
    required: true,
    enum: {
      values: ['placed', 'packed', 'shipped', 'delivered', 'cancelled'],
      message: '{VALUE} is not a valid order status'
    },
    default: 'placed'
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false
  },
  paidAt: {
    type: Date
  },
  deliveredAt: {
    type: Date
  }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
