import { Project } from "../models/Project.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError, sendSuccess } from "../utils/response.js";

const toPositiveInt = (value, fallback) => {
  const num = Number.parseInt(value, 10);
  if (Number.isNaN(num) || num < 1) return fallback;
  return num;
};

const isValidUrl = (value) => {
  if (!value) return true;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const ensureSlug = async (title, requestedSlug, excludeId) => {
  const base = slugify(requestedSlug || title);
  if (!base) {
    throw new ApiError(400, "Unable to generate a slug from title.");
  }

  let slug = base;
  let suffix = 1;
  while (true) {
    const existing = await Project.findOne({
      slug,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    }).select("_id");
    if (!existing) return slug;
    suffix += 1;
    slug = `${base}-${suffix}`;
  }
};

const validateProjectUrls = (payload) => {
  const invalid = [];
  if (!isValidUrl(payload.image)) invalid.push("image");
  if (!isValidUrl(payload.live)) invalid.push("live");
  if (!isValidUrl(payload.code)) invalid.push("code");

  if (Array.isArray(payload.gallery)) {
    const badIndex = payload.gallery.findIndex((item) => !isValidUrl(item));
    if (badIndex !== -1) invalid.push(`gallery[${badIndex}]`);
  }

  if (invalid.length) {
    throw new ApiError(400, "Validation failed.", {
      url: `Invalid URL in: ${invalid.join(", ")}`,
    });
  }
};

export const getProjects = asyncHandler(async (req, res) => {
  const page = toPositiveInt(req.query.page, 1);
  const limit = Math.min(toPositiveInt(req.query.limit, 9), 24);
  const skip = (page - 1) * limit;

  const filter = {
    isPublished: true,
    ...(req.query.featured === "true" ? { featured: true } : {}),
  };
  const [projects, total] = await Promise.all([
    Project.find(filter)
      .sort({ featured: -1, sortOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Project.countDocuments(filter),
  ]);

  return sendSuccess(res, {
    projects,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  });
});

export const getProjectBySlug = asyncHandler(async (req, res) => {
  const project = await Project.findOne({
    slug: req.params.slug,
    isPublished: true,
  });

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  return sendSuccess(res, { project });
});

export const getAdminProjects = asyncHandler(async (req, res) => {
  const page = toPositiveInt(req.query.page, 1);
  const limit = Math.min(toPositiveInt(req.query.limit, 10), 50);
  const skip = (page - 1) * limit;
  const status = req.query.status;
  const filter =
    status === "published"
      ? { isPublished: true }
      : status === "draft"
      ? { isPublished: false }
      : {};

  const [projects, total] = await Promise.all([
    Project.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit),
    Project.countDocuments(filter),
  ]);

  return sendSuccess(res, {
    projects,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  });
});

export const createProject = asyncHandler(async (req, res) => {
  validateProjectUrls(req.body);
  const slug = await ensureSlug(req.body.title, req.body.slug);
  const project = await Project.create({ ...req.body, slug });

  return sendSuccess(res, { project }, 201);
});

export const updateProject = asyncHandler(async (req, res) => {
  validateProjectUrls(req.body);

  const payload = { ...req.body };
  if (payload.title || payload.slug) {
    payload.slug = await ensureSlug(payload.title, payload.slug, req.params.id);
  }

  const project = await Project.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  return sendSuccess(res, { project });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  return sendSuccess(res, { message: "Project deleted successfully." });
});
