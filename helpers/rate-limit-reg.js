import rateLimit from 'express-rate-limit'
import  { HttpCode } from './constants.js'

export const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // Количество миллисекунд за один час
  max: 2,
  handler: (_req, res, _next) => {
    return res.status(HttpCode.BAD_REQUEST).json({
      status: "error",
      code: HttpCode.BAD_REQUEST,
      data: "Bad request",
      message: "Too many registrations. No more than two per hour from one IP",
    });
  },
})
