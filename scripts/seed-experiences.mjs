import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not available");
}


// Experience Schema
const ExperienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
  },

  position: {
    type: String,
    required: true,
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
  },

  technologies: [
    {
      type: String,
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
});

const Experience =
  mongoose.models.Experience ||
  mongoose.model("Experience", ExperienceSchema);


// Existing portfolio experience
const experiences = [
  {
    company: "URSS TechService PVT LTD",
    position: "Data Analyst",
    employmentType: "Full-time",
    location: "",
    startDate: new Date("2025-05-01"),
    endDate: null,
    currentlyWorking: true,
    description: "",
    technologies: [],
    companyLogo: "",
    displayOrder: 1,
    isActive: true,
  },

  {
    company: "Sim Gems Group",
    position: "UI / UX Designer",
    employmentType: "Full-time",
    location: "",
    startDate: new Date("2024-12-01"),
    endDate: new Date("2025-02-28"),
    currentlyWorking: false,
    description: "",
    technologies: [],
    companyLogo: "",
    displayOrder: 2,
    isActive: true,
  },
];


try {
  console.log("Connecting to MongoDB...");

  await mongoose.connect(MONGODB_URI);

  console.log("MongoDB connected successfully.");

  for (const experience of experiences) {
    const existingExperience = await Experience.findOne({
      company: experience.company,
      position: experience.position,
    });

    if (existingExperience) {
      console.log(
        `Already exists: ${experience.position} at ${experience.company}`
      );

      continue;
    }

    await Experience.create(experience);

    console.log(
      `Created: ${experience.position} at ${experience.company}`
    );
  }

  console.log("\nExperience migration completed successfully.");
} catch (error) {
  console.error("Migration error:", error);
} finally {
  await mongoose.disconnect();

  console.log("MongoDB connection closed.");
}