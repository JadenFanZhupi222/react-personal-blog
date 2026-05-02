import mongoose, { Schema } from 'mongoose';
import type { RawExperiencesData } from '@/lib/about/types';

const ExperiencesSchema = new Schema<RawExperiencesData>(
  {
    language: { type: String, required: true, enum: ['en', 'zh'] },
    experiences: [
      {
        title: String,
        company: String,
        startDate: String,
        endDate: String,
        description: String,
        achievements: [String],
      },
    ],
  },
  { collection: 'experiences' }
);

export default (mongoose.models.Experiences as mongoose.Model<RawExperiencesData>) ||
  mongoose.model<RawExperiencesData>('Experiences', ExperiencesSchema);
