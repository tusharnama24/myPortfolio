import mongoose from "mongoose";

const AboutSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    profileImage: {
      type: String,
      default: "/profile.jpg",
    },

    resumeUrl: {
      type: String,
      default: "",
    },

    socialLinks: {
      github: {
        type: String,
        default: "",
      },

      linkedin: {
        type: String,
        default: "",
      },

      twitter: {
        type: String,
        default: "",
      },

      facebook: {
        type: String,
        default: "",
      },

      stackOverflow: {
        type: String,
        default: "",
      },

      leetcode: {
        type: String,
        default: "",
      },

      devUsername: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.About ||
  mongoose.model("About", AboutSchema);