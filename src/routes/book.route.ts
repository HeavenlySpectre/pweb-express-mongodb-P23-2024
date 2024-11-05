import { Router, Request, Response } from 'express';
import { getAllBooks, getBookById, addBook } from '../controllers/book.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router: Router = Router();

// Apply authentication middleware to all book routes
router.use(authenticateToken);

// Book routes
router.get('/', async (req: Request, res: Response) => {
  await getAllBooks(req, res);
});

router.get('/:id', async (req: Request, res: Response) => {
  await getBookById(req, res);
});

router.post('/', async (req: Request, res: Response) => {
  await addBook(req, res);
});

export default router;
