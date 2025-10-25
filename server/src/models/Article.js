import mongoose from 'mongoose';

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  excerpt: { type: String },
  content: { type: String },
  coverImage: { type: String },
  author: { type: String },
  parishId: { type: mongoose.Schema.Types.ObjectId, ref: 'Parish', index: true },
  categories: [{ type: String, index: true }],
  status: { type: String, enum: ['draft', 'scheduled', 'published', 'archived'], default: 'draft' },
  publishedAt: { type: Date }
}, { timestamps: true });

export default mongoose.models.Article || mongoose.model('Article', ArticleSchema);
