const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const loginValidator = {
  email: {
    required: true,
    type: "string",
    max: 255,
    pattern: emailRegex,
    message: "Enter a valid email address.",
  },
  password: {
    required: true,
    type: "string",
    min: 6,
    max: 128,
  },
};
