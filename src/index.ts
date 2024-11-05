import express, { Application, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import authRouter from './routes/auth.route';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '4000');
const MONGODB_URI: string = process.env.MONGODB_URI || '';

// Middleware
app.use(express.json());

// Routes
app.use('/auth', authRouter);

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    data: {}
  });
});

// Connect to MongoDB
const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('📦 Connected to MongoDB successfully');
    
    app.listen(PORT, () => {
      console.log(`⚡️[server]: Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server failed to start:', error);
    process.exit(1);
  }
};

mongoose.connection.on('connected', () => {
  console.log('🌿 MongoDB connected');
});

startServer();

export default app;
