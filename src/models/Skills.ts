import mongoose, { Schema } from 'mongoose';
import type { RawSkillsData } from '@/lib/about/types';

const SkillsSchema = new Schema<RawSkillsData>(
  {
    language: { type: String, required: true, enum: ['en', 'zh'] },
    skills: {
      frontend: { type: [String], required: false },
      backend: { type: [String], required: false },
      devops: { type: [String], required: false },
      tools: { type: [String], required: false },
    },
  },
  { collection: 'skills' }
);

export default (mongoose.models.Skills as mongoose.Model<RawSkillsData>) ||
  mongoose.model<RawSkillsData>('Skills', SkillsSchema);
