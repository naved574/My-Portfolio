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

export const signupValidator = {
  fullName: {
    required: true,
    type: "string",
    min: 2,
    max: 120,
  },
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
  confirmPassword: {
    required: true,
    type: "string",
    min: 6,
    max: 128,
  },
};
