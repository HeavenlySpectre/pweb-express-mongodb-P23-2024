import express, { Router, Request, Response } from 'express';

const healthRouter: Router = express.Router();

healthRouter.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    message: 'Health check successful',
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      serverInfo: {
        nodejs: process.version,
        platform: process.platform
      }
    }
  });
});

export default healthRouter;
