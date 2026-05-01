import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema(
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

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
