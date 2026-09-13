import mongoose from "mongoose";

const EducationSchema = new mongoose.Schema(
  {
    institution: {
      type: String,
      required: [true, "Please provide institution name"],
      trim: true,
    },

    degree: {
      type: String,
      required: [true, "Please provide degree"],
      trim: true,
    },

    field: {
      type: String,
      required: [true, "Please provide field of study"],
      trim: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
    },

    currentlyStudying: {
      type: Boolean,
      default: false,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    logo: {
      type: String,
      default: "",
      trim: true,
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

export default mongoose.models.Education ||
  mongoose.model("Education", EducationSchema);