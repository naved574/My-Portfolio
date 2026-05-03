import { Project } from "../models/Project.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError, sendSuccess } from "../utils/response.js";

export const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ isPublished: true }).sort({
    sortOrder: 1,
    createdAt: -1,
  });

  return sendSuccess(res, { projects });
});

export const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findOne({
    _id: req.params.id,
    isPublished: true,
  });

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  return sendSuccess(res, { project });
});

export const createProject = asyncHandler(async (req, res) => {
  const project = await Project.create(req.body);

  return sendSuccess(res, { project }, 201);
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
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
