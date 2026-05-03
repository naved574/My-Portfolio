export const sendSuccess = (res, data, statusCode = 200) =>
  res.status(statusCode).json({
    success: true,
    data,
  });

export const sendError = (res, message, statusCode = 500, errors) =>
  res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
  });

export class ApiError extends Error {
  constructor(statusCode, message, errors) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}
