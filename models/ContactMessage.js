import mongoose from "mongoose";

const ContactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: [true, "Please provide your email"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },

    subject: {
      type: String,
      default: "",
      trim: true,
      maxlength: 150,
    },

    message: {
      type: String,
      required: [true, "Please provide a message"],
      trim: true,
      maxlength: 500,
    },

    status: {
      type: String,
      enum: ["new", "read", "replied", "archived"],
      default: "new",
    },

    isSpam: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ContactMessage ||
  mongoose.model("ContactMessage", ContactMessageSchema);