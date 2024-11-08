import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Book from '../models/book.model';
import Borrow from '../models/borrow.model';
import { AuthRequest } from '../middleware/auth.middleware';

// Borrow a book
export const borrowBook = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId; // dari auth middleware

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        status: 'failed',
        message: 'Invalid book ID format',
        data: {}
      });
      return;
    }

    // Check if user has already borrowed this book and not returned it
    const existingBorrow = await Borrow.findOne({
      userId,
      bookId: id,
      isReturned: false
    });

    if (existingBorrow) {
      res.status(400).json({
        status: 'failed',
        message: 'You have already borrowed this book and not returned it yet',
        data: {}
      });
      return;
    }

    // Find book and check quantity
    const book = await Book.findById(id);

    if (!book) {
      res.status(404).json({
        status: 'failed',
        message: 'Book not found',
        data: {}
      });
      return;
    }

    // Check if book is available
    if (book.qty <= 0) {
      res.status(400).json({
        status: 'failed',
        message: 'Book is not available for borrowing',
        data: {
          currentQty: book.qty
        }
      });
      return;
    }

    // Create borrow record
    await Borrow.create({
      userId,
      bookId: id,
      borrowedAt: new Date()
    });

    // Update book quantity
    book.qty -= 1;
    await book.save();

    res.json({
      status: 'success',
      message: 'Successfully borrow book',
      data: {
        currentQty: book.qty
      }
    });
  } catch (error) {
    console.error('Borrow book error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to borrow book',
      data: {}
    });
  }
};

// Return a book
export const returnBook = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        status: 'failed',
        message: 'Invalid book ID format',
        data: {}
      });
      return;
    }

    // Check if user has borrowed this book and not returned it
    const borrowRecord = await Borrow.findOne({
      userId,
      bookId: id,
      isReturned: false
    });

    if (!borrowRecord) {
      res.status(400).json({
        status: 'failed',
        message: 'You have not borrowed this book or have already returned it',
        data: {}
      });
      return;
    }

    // Find book
    const book = await Book.findById(id);

    if (!book) {
      res.status(404).json({
        status: 'failed',
        message: 'Book not found',
        data: {}
      });
      return;
    }

    // Update borrow record
    borrowRecord.isReturned = true;
    borrowRecord.returnedAt = new Date();
    await borrowRecord.save();

    // Update book quantity
    book.qty += 1;
    await book.save();

    res.json({
      status: 'success',
      message: 'Successfully return book',
      data: {
        currentQty: book.qty
      }
    });
  } catch (error) {
    console.error('Return book error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to return book',
      data: {}
    });
  }
};
