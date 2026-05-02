import mongoose from 'mongoose';
import type { Blog } from '@/lib/blog/types';

const BlogSchema = new mongoose.Schema<Blog>(
  {
    title: String,
    description: String,
    date: String,
    readTime: String,
    tags: [String],
    slug: String,
    language: String,
    content: String,
  },
  { collection: 'blogs' }
);

BlogSchema.index({ slug: 1, language: 1 });

export default (mongoose.models.Blog as mongoose.Model<Blog>) ||
  mongoose.model<Blog>('Blog', BlogSchema);
