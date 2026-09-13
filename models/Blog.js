import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide blog title"],
      trim: true,
    },

    slug: {
      type: String,
      required: [true, "Please provide blog slug"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    excerpt: {
      type: String,
      required: [true, "Please provide blog excerpt"],
      trim: true,
    },

    content: {
      type: String,
      required: [true, "Please provide blog content"],
    },

    featuredImage: {
      type: String,
      default: "",
      trim: true,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    published: {
      type: Boolean,
      default: false,
    },

    publishedAt: {
      type: Date,
    },

    viewCount: {
      type: Number,
      default: 0,
    },

    displayOrder: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Blog ||
  mongoose.model("Blog", BlogSchema);