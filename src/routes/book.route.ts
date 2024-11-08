import { Router, Request, Response } from 'express';
import { 
  getAllBooks, 
  getBookById, 
  addBook, 
  modifyBook, 
  removeBook 
} from '../controllers/book.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router: Router = Router();

// Apply authentication middleware
router.use(authenticateToken);

// Get all books
router.get('/', async (req: Request, res: Response) => {
  await getAllBooks(req, res);
});

// Get book by ID
router.get('/:id', async (req: Request, res: Response) => {
  await getBookById(req, res);
});

// Add new book
router.post('/', async (req: Request, res: Response) => {
  await addBook(req, res);
});

// Modify book
router.patch('/:id', async (req: Request, res: Response) => {
  await modifyBook(req, res);
});

// Delete book
router.delete('/:id', async (req: Request, res: Response) => {
  await removeBook(req, res);
});

export default router;
