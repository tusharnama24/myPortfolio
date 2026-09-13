import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide project title'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide project description'],
    },
    shortDescription: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    gallery: [
      {
        type: String,
      },
    ],
    technologies: [
      {
        type: String,
      },
    ],
    githubUrl: {
      type: String,
      default: '',
    },
    liveUrl: {
      type: String,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      enum: ['Web', 'Mobile', 'Desktop', 'AI/ML', 'Other'],
      default: 'Web',
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
