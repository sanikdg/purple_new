import { Request, Response, NextFunction } from 'express'

interface CustomError extends Error {
  status?: number
  code?: string
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = err.status || 500
  const message = err.message || 'Internal Server Error'

  console.error(`[${new Date().toISOString()}] Error:`, {
    status,
    message,
    path: req.path,
    method: req.method
  })

  res.status(status).json({
    error: {
      status,
      message,
      timestamp: new Date().toISOString()
    }
  })
}
