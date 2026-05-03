import mongoose from "mongoose";

const socialSchema = new mongoose.Schema(
  {
    github: { type: String, trim: true, default: "" },
    linkedin: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true, maxlength: 100 },
    title: { type: String, trim: true, required: true, maxlength: 160 },
    bio: { type: String, trim: true, required: true, maxlength: 2000 },
    email: { type: String, trim: true, lowercase: true, required: true, maxlength: 255 },
    github: { type: String, trim: true, default: "" },
    linkedin: { type: String, trim: true, default: "" },
    resumeUrl: { type: String, trim: true, default: "" },
    skills: { type: [String], default: [] },
    experience: { type: [String], default: [] },
    social: { type: socialSchema, default: undefined },
  },
  { timestamps: true }
);

profileSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

export const Profile = mongoose.model("Profile", profileSchema);
