import express, { Router, Request, Response } from 'express';

const healthRouter: Router = express.Router();

healthRouter.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    message: 'May the success be with you!',
    date: new Date().toDateString()
  });
});

export default healthRouter;
