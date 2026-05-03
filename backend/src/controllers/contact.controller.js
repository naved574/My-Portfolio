import { ContactMessage } from "../models/ContactMessage.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError, sendSuccess } from "../utils/response.js";

export const createContactMessage = asyncHandler(async (req, res) => {
  const contactMessage = await ContactMessage.create(req.body);

  return sendSuccess(
    res,
    {
      message: "Message received successfully.",
      contactMessage,
    },
    201
  );
});

export const getContactMessages = asyncHandler(async (req, res) => {
  const contactMessages = await ContactMessage.find().sort({ createdAt: -1 });

  return sendSuccess(res, { contactMessages });
});

export const markContactMessageRead = asyncHandler(async (req, res) => {
  const contactMessage = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true, runValidators: true }
  );

  if (!contactMessage) {
    throw new ApiError(404, "Contact message not found.");
  }

  return sendSuccess(res, { contactMessage });
});

export const deleteContactMessage = asyncHandler(async (req, res) => {
  const contactMessage = await ContactMessage.findByIdAndDelete(req.params.id);

  if (!contactMessage) {
    throw new ApiError(404, "Contact message not found.");
  }

  return sendSuccess(res, { message: "Contact message deleted successfully." });
});
