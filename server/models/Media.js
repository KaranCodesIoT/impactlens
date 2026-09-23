import mongoose from 'mongoose';

const { Schema } = mongoose;

const MediaSchema = new Schema({
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true
  },
  cloudinaryId:     { type: String, required: true, unique: true },
  cloudinaryUrl:    { type: String, required: true },
  resourceType:     { type: String, enum: ['image', 'video'], required: true },
  format:           { type: String },
  bytes:            { type: Number },
  width:            { type: Number },
  height:           { type: Number },
  originalFilename: { type: String },

  // User-provided metadata
  caption:    { type: String, default: '' },
  tags:       [{ type: String }],
  capturedAt: { type: Date },

  // AI analysis output
  analysis: {
    status: {
      type: String,
      enum: ['pending', 'analyzing', 'ready', 'failed'],
      default: 'pending'
    },
    completedAt: { type: Date },
    error:       { type: String },
    result:      { type: Schema.Types.Mixed }
  },

  // For before/after pairing
  comparisonGroup: { type: String },
  sequenceOrder:   { type: Number }
}, { timestamps: true });

MediaSchema.index({ project: 1, 'analysis.status': 1 });
MediaSchema.index({ project: 1, tags: 1 });
MediaSchema.index({ project: 1, createdAt: -1 });

export default mongoose.model('Media', MediaSchema);
