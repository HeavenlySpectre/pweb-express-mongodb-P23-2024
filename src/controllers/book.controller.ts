import { Request, Response } from 'express';
import Book, { IBook } from '../models/book.model';

export const getAllBooks = async (_req: Request, res: Response) => {
  try {
    const books = await Book.find();
    res.json({
      status: 'success',
      message: 'Books retrieved successfully',
      data: books
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error retrieving books',
      data: {}
    });
  }
};

export const getBookById = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({
        status: 'failed',
        message: 'Book not found',
        data: {}
      });
    }
    res.json({
      status: 'success',
      message: 'Book retrieved successfully',
      data: book
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error retrieving book',
      data: {}
    });
  }
};

export const addBook = async (req: Request, res: Response) => {
  try {
    const bookData: IBook = req.body;
    
    // Convert publishedDate string to Date object
    if (typeof bookData.publishedDate === 'string') {
      bookData.publishedDate = new Date(bookData.publishedDate);
    }

    const book = await Book.create(bookData);
    res.status(201).json({
      status: 'success',
      message: 'Book added successfully',
      data: book
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error adding book',
      data: {}
    });
  }
};
