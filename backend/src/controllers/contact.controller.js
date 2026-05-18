import { ContactMessage } from "../models/ContactMessage.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError, sendSuccess } from "../utils/response.js";
import { enqueueContactMessage } from "../services/contactQueue.service.js";

export const createContactMessage = asyncHandler(async (req, res) => {
  const requestId = enqueueContactMessage(req.body);

  if (!requestId) {
    throw new ApiError(
      503,
      "Message queue is busy right now. Please retry in a few moments."
    );
  }

  return sendSuccess(
    res,
    {
      requestId,
      message: "Message queued successfully.",
    },
    202
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
