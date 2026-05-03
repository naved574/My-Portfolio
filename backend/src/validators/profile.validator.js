const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const updateProfileValidator = {
  name: { type: "string", min: 1, max: 100 },
  title: { type: "string", min: 1, max: 160 },
  bio: { type: "string", min: 1, max: 2000 },
  email: { type: "string", max: 255, pattern: emailRegex, message: "Enter a valid email address." },
  github: { type: "string" },
  linkedin: { type: "string" },
  resumeUrl: { type: "string" },
  skills: { type: "array", items: "string", maxItems: 100 },
  experience: { type: "array", items: "string", maxItems: 50 },
};
