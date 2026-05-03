import { ApiError } from "../utils/response.js";

const checkType = (value, type) => {
  if (type === "array") return Array.isArray(value);
  return typeof value === type;
};

export const validate = (schema) => (req, res, next) => {
  const errors = {};

  for (const [field, rules] of Object.entries(schema)) {
    const value = req.body[field];
    const isMissing = value === undefined || value === null || value === "";

    if (rules.required && isMissing) {
      errors[field] = `${field} is required.`;
      continue;
    }

    if (isMissing) continue;

    if (rules.type && !checkType(value, rules.type)) {
      errors[field] = `${field} must be a ${rules.type}.`;
      continue;
    }

    if (rules.type === "string") {
      const trimmed = value.trim();
      req.body[field] = trimmed;

      if (rules.min && trimmed.length < rules.min) {
        errors[field] = `${field} must be at least ${rules.min} characters.`;
      }

      if (rules.max && trimmed.length > rules.max) {
        errors[field] = `${field} must be under ${rules.max} characters.`;
      }
    }

    if (rules.type === "array") {
      if (rules.maxItems && value.length > rules.maxItems) {
        errors[field] = `${field} must contain no more than ${rules.maxItems} items.`;
      }

      if (rules.items) {
        const invalidItem = value.some((item) => typeof item !== rules.items);
        if (invalidItem) {
          errors[field] = `Every ${field} item must be a ${rules.items}.`;
        } else {
          req.body[field] = value.map((item) => item.trim()).filter(Boolean);
        }
      }
    }

    if (rules.pattern && !rules.pattern.test(req.body[field])) {
      errors[field] = rules.message || `${field} is invalid.`;
    }
  }

  if (Object.keys(errors).length > 0) {
    return next(new ApiError(400, "Validation failed.", errors));
  }

  return next();
};
