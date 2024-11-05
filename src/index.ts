import express, { Application, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import healthRouter from './routes/health.route';
import authRouter from './routes/auth.route';
import bookRouter from './routes/book.route';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '4000');
const MONGODB_URI: string = process.env.MONGODB_URI || '';

// Middleware
app.use(express.json());

// Root endpoint
app.get('/', (_: Request, res: Response) => {
  res.json({
    status: 'success',
    message: 'Welcome to PWEB API 💫',
    data: {
      serverTime: new Date().toISOString(),
      endpoints: {
        auth: '/auth',
        books: '/book',
        health: '/health'
      }
    }
  });
});

// Routes
app.use('/health', healthRouter);
app.use('/auth', authRouter);
app.use('/book', bookRouter);

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
    await mongoose.connect(MONGODB_URI);
    console.log('📦 Connected to MongoDB');
    
    app.listen(PORT, () => {
      console.log(`⚡️[server]: Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server failed to start:', error);
    process.exit(1);
  }
};

startServer();

export default app;
