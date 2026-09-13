import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not available");
}

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "editor"],
    default: "admin",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const User =
  mongoose.models.User || mongoose.model("User", UserSchema);

const rl = readline.createInterface({
  input,
  output,
});

try {
  console.log("Connecting to MongoDB...");

  await mongoose.connect(MONGODB_URI);

  console.log("MongoDB connected.\n");

  const email = await rl.question("Enter admin email: ");
  const name = await rl.question("Enter admin name: ");
  const password = await rl.question("Enter admin password: ");

  if (!email || !name || !password) {
    throw new Error("Email, name and password are required.");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  const existingUser = await User.findOne({
    email: email.toLowerCase(),
  });

  if (existingUser) {
    console.log("\nA user with this email already exists.");
    process.exit(0);
  }

  const hashedPassword = await bcryptjs.hash(password, 10);

  const user = await User.create({
    email: email.toLowerCase(),
    password: hashedPassword,
    name,
    role: "admin",
    isActive: true,
  });

  console.log("\nAdmin user created successfully!");
  console.log("Email:", user.email);
  console.log("Role:", user.role);
  console.log("Active:", user.isActive);
} catch (error) {
  console.error("\nError:", error.message);
} finally {
  rl.close();
  await mongoose.disconnect();
}