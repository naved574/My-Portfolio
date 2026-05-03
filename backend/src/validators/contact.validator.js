const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const contactValidator = {
  name: {
    required: true,
    type: "string",
    min: 1,
    max: 100,
  },
  email: {
    required: true,
    type: "string",
    max: 255,
    pattern: emailRegex,
    message: "Enter a valid email address.",
  },
  message: {
    required: true,
    type: "string",
    min: 10,
    max: 1000,
  },
};
