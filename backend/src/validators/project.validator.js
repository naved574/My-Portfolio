export const createProjectValidator = {
  title: { required: true, type: "string", min: 1, max: 120 },
  slug: { type: "string", min: 1, max: 160, pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/, message: "Slug must be lowercase and hyphen-separated." },
  bio: { type: "string", max: 240 },
  overview: { type: "string", max: 1200 },
  purpose: { type: "string", max: 1200 },
  work: { type: "string", max: 1200 },
  description: { required: true, type: "string", min: 1, max: 3000 },
  features: { type: "array", items: "string", maxItems: 20 },
  challenges: { type: "array", items: "string", maxItems: 20 },
  stack: { type: "array", items: "string", maxItems: 30 },
  image: { required: true, type: "string", min: 1 },
  gallery: { type: "array", items: "string", maxItems: 8 },
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
