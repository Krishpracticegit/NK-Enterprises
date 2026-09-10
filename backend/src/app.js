import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import storeInfoRoutes from './routes/storeInfoRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

// Initialize Express app
const app = express();

// Production-ready CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:3000'
    ].filter(Boolean);

    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    if (process.env.NODE_ENV !== 'production' || allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error(`CORS policy violation: Access denied for origin ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/store-info', storeInfoRoutes);
app.use('/api/coupons', couponRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to NK ENTERPRISES Baby Products API');
});

// Error handling middleware (wired as last middleware)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
