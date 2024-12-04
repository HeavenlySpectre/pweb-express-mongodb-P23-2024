import { Router } from 'express';
import { borrowBook, returnBook } from '../controllers/mechanism.controller';

const router: Router = Router();

router.post('/borrow/:id', borrowBook);
router.post('/return/:id', returnBook);

export default router;
