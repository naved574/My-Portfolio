import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 120,
    },
    slug: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
      unique: true,
      maxlength: 160,
    },
    bio: {
      type: String,
      trim: true,
      default: "",
      maxlength: 240,
    },
    overview: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1200,
    },
    purpose: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1200,
    },
    work: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1200,
    },
    description: {
      type: String,
      trim: true,
      required: true,
      maxlength: 3000,
    },
    features: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 20,
        message: "Features must contain no more than 20 items.",
      },
    },
    challenges: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 20,
        message: "Challenges must contain no more than 20 items.",
      },
    },
    stack: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 30,
        message: "Stack must contain no more than 30 items.",
      },
    },
    image: {
      type: String,
      trim: true,
      required: true,
    },
    gallery: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 8,
        message: "Gallery must contain no more than 8 items.",
      },
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

projectSchema.index({ isPublished: 1, featured: -1, sortOrder: 1, createdAt: -1 });
projectSchema.index({ createdAt: -1 });

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
