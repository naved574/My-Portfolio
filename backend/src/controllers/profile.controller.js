import { Profile } from "../models/Profile.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne().sort({ createdAt: 1 });

  return sendSuccess(res, { profile });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const existingProfile = await Profile.findOne().sort({ createdAt: 1 });

  if (existingProfile) {
    Object.assign(existingProfile, req.body);
    await existingProfile.save();
    return sendSuccess(res, { profile: existingProfile });
  }

  const profile = await Profile.create(req.body);

  return sendSuccess(res, { profile }, 201);
});
