import { Request, Response } from 'express';
import Book from '../models/book.model';
import mongoose from 'mongoose'; // 

// Get all books
export const getAllBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const books = await Book.find();
    res.json({
      status: 'success',
      message: 'Successfully retrieved all books',
      data: books
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve books',
      data: {}
    });
  }
};

export const getBookById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Validasi ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        status: 'failed',
        message: 'Book ID Not Found',
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
    // Log error untuk debugging
    console.error('Get book by ID error:', error);

    if (error instanceof mongoose.Error.CastError) {
      res.status(400).json({
        status: 'failed',
        message: 'Invalid book ID format',
        data: {}
      });
      return;
    }

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
    const newBook = await Book.create(req.body);
    res.status(201).json({
      status: 'success',
      message: 'Successfully added book',
      data: newBook
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to add book',
      data: {}
    });
  }
};

// Modify book
export const modifyBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Validasi ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        status: 'failed',
        message: 'Invalid book ID format',
        data: {}
      });
      return;
    }

    const updateData = req.body;

    // Validasi update fields
    const allowedFields = ['author', 'publisher', 'qty'];
    const updateFields = Object.keys(updateData);
    const isValidOperation = updateFields.every(field => allowedFields.includes(field));

    if (!isValidOperation) {
      res.status(400).json({
        status: 'failed',
        message: 'Invalid update fields. Only author, publisher, and qty can be updated.',
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
      message: 'Successfully update book',
      data: book
    });
  } catch (error) {
    // Log error untuk debugging
    console.error('Modify book error:', error);

    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({
        status: 'failed',
        message: 'Validation error',
        data: {
          errors: Object.values(error.errors).map(err => err.message)
        }
      });
      return;
    }

    res.status(500).json({
      status: 'error',
      message: 'Failed to update book',
      data: {}
    });
  }
};

// Remove book
export const removeBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Validasi ObjectId
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
      message: 'Successfully remove book',
      data: {}
    });
  } catch (error) {
    // Log error untuk debugging
    console.error('Remove book error:', error);

    res.status(500).json({
      status: 'error',
      message: 'Failed to remove book',
      data: {}
    });
  }
};