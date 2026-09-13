import mongoose from "mongoose";

const ExperienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide company name"],
      trim: true,
    },

    position: {
      type: String,
      required: [true, "Please provide job position"],
      trim: true,
    },

    employmentType: {
      type: String,
      enum: [
        "Full-time",
        "Part-time",
        "Contract",
        "Freelance",
        "Internship",
      ],
      default: "Full-time",
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    startDate: {
      type: Date,
    },

    endDate: {
      type: Date,
    },

    currentlyWorking: {
      type: Boolean,
      default: false,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    technologies: [
      {
        type: String,
        trim: true,
      },
    ],

    companyLogo: {
      type: String,
      default: "",
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

export default mongoose.models.Experience ||
  mongoose.model("Experience", ExperienceSchema);