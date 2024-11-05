import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      res.status(401).json({
        status: 'failed',
        message: 'Authentication token is required',
        data: {}
      });
      return;
    }

    jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key',
      (err: any, decoded: any) => {
        if (err) {
          res.status(403).json({
            status: 'failed',
            message: 'Invalid or expired token',
            data: {}
          });
          return;
        }

        req.userId = decoded.userId;
        next();
      }
    );
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Authentication failed',
      data: {}
    });
  }
};
