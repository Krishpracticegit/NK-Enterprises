import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import app from './src/app.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Server listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Server] Running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`[Health Check] Endpoint available at http://localhost:${PORT}/api/health`);
});

