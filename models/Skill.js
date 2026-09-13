import mongoose from 'mongoose';

const SkillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide skill name'],
      unique: true,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        'Frontend',
        'Backend',
        'Database',
        'Tools',
        'Design',
        'Mobile',
        'Other',
      ],
      default: 'Other',
    },

    icon: {
      type: String,
      default: '',
    },

    proficiency: {
      type: String,
      enum: [
        'Beginner',
        'Intermediate',
        'Advanced',
        'Expert',
      ],
      default: 'Intermediate',
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

export default mongoose.models.Skill ||
  mongoose.model('Skill', SkillSchema);