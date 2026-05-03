export const createProjectValidator = {
  title: { required: true, type: "string", min: 1, max: 120 },
  description: { required: true, type: "string", min: 1, max: 1000 },
  stack: { type: "array", items: "string", maxItems: 30 },
  image: { required: true, type: "string", min: 1 },
  live: { type: "string" },
  code: { type: "string" },
  accent: { type: "string", pattern: /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, message: "Accent must be a hex color." },
  featured: { type: "boolean" },
  sortOrder: { type: "number" },
  isPublished: { type: "boolean" },
};

export const updateProjectValidator = Object.fromEntries(
  Object.entries(createProjectValidator).map(([key, value]) => [
    key,
    { ...value, required: false },
  ])
);
