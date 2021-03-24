const rateLimit = require("express-rate-limit");
const { HttpCode, Status } = require("./constants");

const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  handler: (_req, res, _next) => {
    return res.status(HttpCode.BAD_REQUEST).json({
      status: Status.ERROR,
      code: HttpCode.BAD_REQUEST,
      data: "Bad request",
      message: "Too many registrations. No more than two per hour from one IP",
    });
  },
});

module.exports = { createAccountLimiter };
