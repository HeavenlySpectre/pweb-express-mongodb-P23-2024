import express, { Router, Request, Response, RequestHandler } from 'express';
import { login, register } from '../controllers/auth.controller';

const router: Router = express.Router();

// Wrap async handlers with RequestHandler type
const asyncHandler = (fn: (req: Request, res: Response) => Promise<any>): RequestHandler => {
    return (req: Request, res: Response, next) => {
        Promise.resolve(fn(req, res)).catch(next);
    };
};

// Apply the wrapper to our route handlers
router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));

export default router;
