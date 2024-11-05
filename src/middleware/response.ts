import { Response } from 'express';
import { ApiResponse } from '../types/response';

export const successResponse = (res: Response, message: string, data: any): Response => {
  const response: ApiResponse = {
    status: 'success',
    message,
    data
  };
  return res.json(response);
};

export const errorResponse = (res: Response, message: string): Response => {
  const response: ApiResponse = {
    status: 'error',
    message,
    data: {}
  };
  return res.status(500).json(response);
};

export const failedResponse = (res: Response, message: string): Response => {
  const response: ApiResponse = {
    status: 'failed',
    message,
    data: {}
  };
  return res.status(400).json(response);
};
