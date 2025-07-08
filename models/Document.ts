import mongoose, { Schema, models } from 'mongoose';

const DocumentSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  size: { type: Number },
  status: { type: String, enum: ['approved', 'pending', 'rejected', 'draft'], default: 'pending' },
  url: { type: String },
  summary: { type: String },
  date: { type: Date, default: Date.now },
  uploadedBy: { type: String },
  data: { type: Buffer },
  currentVersion: { type: Number, default: 1 },
  versions: [
    {
      version: Number,
      fileUrl: String,
      uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
      uploadedAt: Date,
      notes: String,
    }
  ],
});

export default models.Document || mongoose.model('Document', DocumentSchema); 




