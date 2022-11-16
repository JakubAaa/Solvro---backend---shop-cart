import { AppError } from './error.module'
import { NextFunction, Request, Response } from 'express'

interface ErrorHandler {
  (
    error: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
  ): void;
}

const internalServerError = {
  code: 'internal/error',
  data: 'Internal server error. We are working on it!'
}

export const errorHandler: ErrorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = (error as AppError)?.status || 500

  const response = (status !== 500) ? {
    code: (error as AppError).code,
    data: (error as AppError).data
  } : internalServerError

  res.status(status).json(response)
}
