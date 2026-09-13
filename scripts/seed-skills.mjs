import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not available");
}

const SkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  category: {
    type: String,
    enum: [
      "Frontend",
      "Backend",
      "Database",
      "Tools",
      "Design",
      "Mobile",
      "Other",
    ],
    default: "Other",
  },

  icon: {
    type: String,
    default: "",
  },

  proficiency: {
    type: String,
    enum: [
      "Beginner",
      "Intermediate",
      "Advanced",
      "Expert",
    ],
    default: "Intermediate",
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

const Skill =
  mongoose.models.Skill ||
  mongoose.model("Skill", SkillSchema);


// Your existing skills
const skills = [
  {
    name: "C",
    category: "Other",
    proficiency: "Intermediate",
  },
  {
    name: "C++",
    category: "Other",
    proficiency: "Intermediate",
  },
  {
    name: "Python",
    category: "Backend",
    proficiency: "Intermediate",
  },
  {
    name: "HTML",
    category: "Frontend",
    proficiency: "Advanced",
  },
  {
    name: "CSS",
    category: "Frontend",
    proficiency: "Advanced",
  },
  {
    name: "Javascript",
    category: "Frontend",
    proficiency: "Advanced",
  },
  {
    name: "React",
    category: "Frontend",
    proficiency: "Advanced",
  },
  {
    name: "Next JS",
    category: "Frontend",
    proficiency: "Advanced",
  },
  {
    name: "Tailwind",
    category: "Frontend",
    proficiency: "Advanced",
  },
  {
    name: "MongoDB",
    category: "Database",
    proficiency: "Advanced",
  },
  {
    name: "MySQL",
    category: "Database",
    proficiency: "Intermediate",
  },
  {
    name: "Git",
    category: "Tools",
    proficiency: "Advanced",
  },
  {
    name: "Docker",
    category: "Tools",
    proficiency: "Intermediate",
  },
  {
    name: "Figma",
    category: "Design",
    proficiency: "Intermediate",
  },
  {
    name: "Canva",
    category: "Design",
    proficiency: "Advanced",
  },
  {
    name: "Photoshop",
    category: "Design",
    proficiency: "Intermediate",
  },
  {
    name: "Firebase",
    category: "Backend",
    proficiency: "Intermediate",
  },
  {
    name: "Flutter",
    category: "Mobile",
    proficiency: "Intermediate",
  },
  {
    name: "dart",
    category: "Mobile",
    proficiency: "Intermediate",
  },
  {
    name: "Microsoft Office",
    category: "Tools",
    proficiency: "Advanced",
  },
];


try {
  console.log("Connecting to MongoDB...");

  await mongoose.connect(MONGODB_URI);

  console.log("MongoDB connected successfully.");

  for (let index = 0; index < skills.length; index++) {
    const skill = skills[index];

    const existingSkill = await Skill.findOne({
      name: skill.name,
    });

    if (existingSkill) {
      console.log(`Already exists: ${skill.name}`);
      continue;
    }

    await Skill.create({
      ...skill,
      displayOrder: index + 1,
      icon: "",
      isActive: true,
    });

    console.log(`Created: ${skill.name}`);
  }

  console.log("\nSkills migration completed successfully.");
} catch (error) {
  console.error("Migration error:", error);
} finally {
  await mongoose.disconnect();
  console.log("MongoDB connection closed.");
}