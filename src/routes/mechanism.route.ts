import { Router } from 'express';
import { borrowBook, returnBook } from '../controllers/mechanism.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router: Router = Router();

// Apply authentication middleware
router.use(authenticateToken);

// Mechanism routes
router.post('/borrow/:id', borrowBook)  ;
router.post('/return/:id', returnBook);

export default router;
