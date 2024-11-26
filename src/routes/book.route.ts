import { Router, Request, Response } from 'express';
import { 
  getAllBooks, 
  getBookById, 
  addBook, 
  updateBook,
  deleteBook,
  searchBooks,
  getBooksByCategory
} from '../controllers/book.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router: Router = Router();

// Public routes (no authentication needed)
router.get('/', async (req: Request, res: Response) => {
  await getAllBooks(req, res);
});

router.get('/search', async (req: Request, res: Response) => {
  await searchBooks(req, res);
});

router.get('/category/:category', async (req: Request, res: Response) => {
  await getBooksByCategory(req, res);
});

router.get('/:id', async (req: Request, res: Response) => {
  await getBookById(req, res);
});

// Protected routes (need authentication)
router.use(authenticateToken);

router.post('/', async (req: Request, res: Response) => {
  await addBook(req, res);
});

router.put('/:id', async (req: Request, res: Response) => {
  await updateBook(req, res);
});

router.delete('/:id', async (req: Request, res: Response) => {
  await deleteBook(req, res);
});

export default router;
