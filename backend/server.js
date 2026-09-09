import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './src/config/db.js';
import healthRoutes from './src/routes/health.routes.js';
import authRoutes from './src/routes/authRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import categoryRoutes from './src/routes/categoryRoutes.js';
import uploadRoutes from './src/routes/uploadRoutes.js';
import paymentRoutes from './src/routes/paymentRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import storeInfoRoutes from './src/routes/storeInfoRoutes.js';
import couponRoutes from './src/routes/couponRoutes.js';
import { notFoundHandler, errorHandler } from './src/middleware/errorHandler.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

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

// Server listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Server] Running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`[Health Check] Endpoint available at http://localhost:${PORT}/api/health`);
});
