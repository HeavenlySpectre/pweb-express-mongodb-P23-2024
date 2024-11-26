import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Book from '../models/book.model';

// Get all books with pagination and filtering
export const getAllBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search as string;
    const category = req.query.category as string;

    let query: any = {};

    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }

    // Add category filter
    if (category) {
      query.category = category;
    }

    const [books, total] = await Promise.all([
      Book.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Book.countDocuments(query)
    ]);

    res.json({
      status: 'success',
      message: 'Successfully retrieved books',
      data: {
        books,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      }
    });
  } catch (error) {
    console.error('Get all books error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve books',
      data: {}
    });
  }
};

// Get book by ID
export const getBookById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        status: 'failed',
        message: 'Invalid book ID format',
        data: {}
      });
      return;
    }

    const book = await Book.findById(id);

    if (!book) {
      res.status(404).json({
        status: 'failed',
        message: 'Book not found',
        data: {}
      });
      return;
    }

    res.json({
      status: 'success',
      message: 'Successfully retrieved book',
      data: book
    });
  } catch (error) {
    console.error('Get book by ID error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve book',
      data: {}
    });
  }
};

// Add new book
export const addBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      author,
      publishedDate,
      publisher,
      description,
      coverImage,
      category,
      initialQty
    } = req.body;

    // Basic validation
    if (!title || !author || !publisher || !initialQty) {
      res.status(400).json({
        status: 'failed',
        message: 'Missing required fields',
        data: {}
      });
      return;
    }

    const newBook = await Book.create({
      title,
      author,
      publishedDate,
      publisher,
      description,
      coverImage,
      category,
      initialQty,
      qty: initialQty, // Initially, qty equals initialQty
      rating: {
        average: 0,
        count: 0
      }
    });

    res.status(201).json({
      status: 'success',
      message: 'Successfully added book',
      data: newBook
    });
  } catch (error) {
    console.error('Add book error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to add book',
      data: {}
    });
  }
};

// Update book
export const updateBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        status: 'failed',
        message: 'Invalid book ID format',
        data: {}
      });
      return;
    }

    const book = await Book.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!book) {
      res.status(404).json({
        status: 'failed',
        message: 'Book not found',
        data: {}
      });
      return;
    }

    res.json({
      status: 'success',
      message: 'Successfully updated book',
      data: book
    });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update book',
      data: {}
    });
  }
};

// Delete book
export const deleteBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        status: 'failed',
        message: 'Invalid book ID format',
        data: {}
      });
      return;
    }

    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      res.status(404).json({
        status: 'failed',
        message: 'Book not found',
        data: {}
      });
      return;
    }

    res.json({
      status: 'success',
      message: 'Successfully deleted book',
      data: {}
    });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete book',
      data: {}
    });
  }
};

// Search books
export const searchBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.query;
    
    if (!query) {
      res.status(400).json({
        status: 'failed',
        message: 'Search query is required',
        data: {}
      });
      return;
    }

    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    });

    res.json({
      status: 'success',
      message: 'Search completed successfully',
      data: books
    });
  } catch (error) {
    console.error('Search books error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Search failed',
      data: {}
    });
  }
};

// Get books by category
export const getBooksByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.params;
    const books = await Book.find({ category });

    res.json({
      status: 'success',
      message: 'Successfully retrieved books by category',
      data: books
    });
  } catch (error) {
    console.error('Get books by category error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve books by category',
      data: {}
    });
  }
};
