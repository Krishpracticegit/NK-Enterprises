import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import app from './src/app.js';

// Load environment variables
dotenv.config();

// Wait for the database to connect before proceeding
await connectDB();

// Server listener (Only run this locally)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`[Server] Running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`[Health Check] Endpoint available at http://localhost:${PORT}/api/health`);
  });
}

// Export the app for Vercel's serverless environment
export default app;