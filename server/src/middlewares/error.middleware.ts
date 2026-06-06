import type { Request, Response, NextFunction } from 'express'
import { ApiError } from '../utils/ApiError.js'

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors,
      data: err.data,
    })
  }

  console.error(err)

  return res.status(500).json({
    success: false,
    message: 'Something went wrong',
    errors: [],
    data: null,
  })
}
