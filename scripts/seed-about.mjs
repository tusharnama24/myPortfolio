import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not available");
}


// About Schema
const AboutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },

  location: {
    type: String,
    required: true,
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
    github: String,
    linkedin: String,
    twitter: String,
    facebook: String,
    stackOverflow: String,
    leetcode: String,
    devUsername: String,
  },
});


const About =
  mongoose.models.About ||
  mongoose.model("About", AboutSchema);


// Existing personal data
const personalData = {
  name: "TUSHAR NAMA",

  profile: "/profile.jpg",

  designation: "Data Analyst",

  description:
    "My name is TUSHAR NAMA. I am a professional and enthusiastic Data Analyst and App Developer. I have a strong self-learning attitude and a passion for solving real-world problems through data and technology. I enjoy exploring new tools and techniques in data analysis, visualization, and mobile app development. I specialize in uncovering insights from data using tools like Python, Pandas, Power BI, Excel, and SQL, and I build user-friendly mobile applications using Flutter and JavaScript frameworks. My core strength lies in combining analytical thinking with modern development skills to build efficient and scalable solutions. I am available for any kind of job opportunity that suits my skills and interests.",

  email: "tusharnama844@gmail.com",

  phone: "+91 6378518145",

  address: "398, Sanganer, Jaipur, Rajasthan, 302029",

  github: "https://github.com/tusharnama24",

  facebook: "https://www.facebook.com/",

  linkedIn:
    "https://www.linkedin.com/in/tushar-nama-184606249/",

  twitter: "https://twitter.com/",

  stackOverflow: "https://stackoverflow.com/",

  leetcode: "",

  devUsername: "tusharnama24",

  resume:
    "https://drive.google.com/file/d/15Cr2PUq4S1JOnqPNS7nhrxPQC8rQp9nX/view?usp=sharing",
};


try {
  console.log("Connecting to MongoDB...");

  await mongoose.connect(MONGODB_URI);

  console.log("MongoDB connected successfully.");


  // Check if About already exists
  const existingAbout = await About.findOne();

  if (existingAbout) {
    console.log("About information already exists.");
    console.log("Skipping migration.");
  } else {
    await About.create({
      name: personalData.name,

      title: personalData.designation,

      description: personalData.description,

      email: personalData.email,

      phone: personalData.phone,

      location: personalData.address,

      profileImage: personalData.profile,

      resumeUrl: personalData.resume,

      socialLinks: {
        github: personalData.github,

        linkedin: personalData.linkedIn,

        twitter: personalData.twitter,

        facebook: personalData.facebook,

        stackOverflow: personalData.stackOverflow,

        leetcode: personalData.leetcode,

        devUsername: personalData.devUsername,
      },
    });

    console.log("About information created successfully.");
  }

  console.log("\nAbout migration completed successfully.");
} catch (error) {
  console.error("Migration error:", error);
} finally {
  await mongoose.disconnect();

  console.log("MongoDB connection closed.");
}