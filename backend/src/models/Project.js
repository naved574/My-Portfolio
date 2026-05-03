import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 120,
    },
    description: {
      type: String,
      trim: true,
      required: true,
      maxlength: 1000,
    },
    stack: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      trim: true,
      required: true,
    },
    live: {
      type: String,
      trim: true,
      default: "",
    },
    code: {
      type: String,
      trim: true,
      default: "",
    },
    accent: {
      type: String,
      trim: true,
      default: "#111827",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

projectSchema.index({ isPublished: 1, sortOrder: 1, createdAt: -1 });

projectSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

export const Project = mongoose.model("Project", projectSchema);
