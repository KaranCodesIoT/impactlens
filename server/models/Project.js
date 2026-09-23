import mongoose from 'mongoose';

const { Schema } = mongoose;

const ProjectSchema = new Schema({
  name:        { type: String, required: true, trim: true },
  slug:        { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, default: '' },
  location:    { type: String, default: '' },
  category: {
    type: String,
    enum: ['environment', 'infrastructure', 'agriculture', 'education',
           'health', 'water', 'energy', 'other'],
    default: 'other'
  },
  coverImage:  { type: String },
  stats: {
    totalMedia:    { type: Number, default: 0 },
    analyzedMedia: { type: Number, default: 0 },
    findings:      { type: Number, default: 0 }
  }
}, { timestamps: true });

// Auto-generate slug from name before validation
ProjectSchema.pre('validate', function (next) {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

export default mongoose.model('Project', ProjectSchema);
