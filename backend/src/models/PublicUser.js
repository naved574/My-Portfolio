import mongoose from "mongoose";

const publicUserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      required: true,
      maxlength: 120,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true,
      maxlength: 255,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: true }
);

publicUserSchema.methods.toSafeJSON = function toSafeJSON() {
  return {
    id: this._id,
    fullName: this.fullName,
    email: this.email,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const PublicUser = mongoose.model("PublicUser", publicUserSchema);
