import express, { Application, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path'; // Tambahkan ini
import bookRouter from './routes/book.route';
import healthRouter from './routes/health.route';
import authRouter from './routes/auth.route';
import mechanismRouter from './routes/mechanism.route';
const cors = require('cors');

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '4000');
const MONGODB_URI: string = process.env.MONGODB_URI || '';

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // frontend URL
  credentials: true
}));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); // Tambahkan ini

// Basic root endpoint
app.get("/", (_: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is up and running 💫',
    data: {
      serverTime: new Date().toISOString()
    }
  });
});

// Routes
app.use('/health', healthRouter);
app.use('/auth', authRouter);
app.use('/book', bookRouter);
app.use('/mechanism', mechanismRouter);

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    data: {}
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    data: {}
  });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!require('fs').existsSync(uploadsDir)) {
      require('fs').mkdirSync(uploadsDir, { recursive: true });
    }

    await mongoose.connect(MONGODB_URI);
    console.log('📦 Connected to MongoDB');
    
    app.listen(PORT, () => {
      console.log(`⚡️[server]: Server is running on Port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server failed to start:', error);
    process.exit(1);
  }
};

startServer();

export default app;
