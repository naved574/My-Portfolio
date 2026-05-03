import mongoose from "mongoose";
import { sendError } from "../utils/response.js";

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong.";
  let errors = err.errors;

  if (err instanceof mongoose.Error.CastError) {
    statusCode = 404;
    message = "Resource not found.";
  }

  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = "Validation failed.";
    errors = Object.fromEntries(
      Object.entries(err.errors).map(([field, error]) => [field, error.message])
    );
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate value already exists.";
    errors = err.keyValue;
  }

  return sendError(res, message, statusCode, errors);
};
