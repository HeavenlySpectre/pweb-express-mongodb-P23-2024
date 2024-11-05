import { Request, Response } from 'express';

export const healthCheck = (_: Request, res: Response) => {
  try {
    res.status(200).json({
      status: 'success',
      message: 'Server is healthy',
      data: {
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        serverInfo: {
          node: process.version,
          platform: process.platform,
          memory: process.memoryUsage()
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      data: {}
    });
  }
};
