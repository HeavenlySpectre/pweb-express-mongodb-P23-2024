import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { 
  getAllBooks, 
  getBookById, 
  addBook, 
  updateBook,
  deleteBook,
  searchBooks,
  getBooksByCategory
} from '../controllers/book.controller';

const router: Router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb) => {
    cb(null, 'uploads/');
  },
  filename: (_req: Request, file: Express.Multer.File, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'book-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Routes
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

// Add upload.single('coverImage') middleware for file upload
router.post('/', upload.single('coverImage'), async (req: Request, res: Response) => {
  if (req.file) {
    // Add file path to request body
    req.body.coverImage = `/uploads/${req.file.filename}`;
  }
  await addBook(req, res);
});

router.put('/:id', upload.single('coverImage'), async (req: Request, res: Response) => {
  if (req.file) {
    req.body.coverImage = `/uploads/${req.file.filename}`;
  }
  await updateBook(req, res);
});

router.delete('/:id', async (req: Request, res: Response) => {
  await deleteBook(req, res);
});

export default router;
