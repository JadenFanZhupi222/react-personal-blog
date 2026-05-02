import mongoose from 'mongoose';
import type { Project } from '@/lib/project/types';

const ProjectSchema = new mongoose.Schema<Project>(
  {
    title: String,
    description: String,
    tags: [String],
    slug: String,
    highlights: [String],
    language: { type: String, enum: ['en', 'zh'], required: true },
    url: String,
    order: Number,
  },
  { collection: 'projects' }
);

export default (mongoose.models.Project as mongoose.Model<Project>) ||
  mongoose.model<Project>('Project', ProjectSchema);
