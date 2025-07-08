import mongoose, { Schema, models } from 'mongoose';

const TaskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  assignee: { type: Schema.Types.ObjectId, ref: 'User' },
  dueDate: { type: Date },
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  completedAt: { type: Date },
  history: [
    {
      changedAt: Date,
      changedBy: { type: Schema.Types.ObjectId, ref: 'User' },
      changes: Schema.Types.Mixed, // { field: [old, new], ... }
    }
  ]
}, { timestamps: true });

// Add a pre-save middleware to set completedAt when status changes to 'done'
TaskSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'done' && !this.completedAt) {
    this.completedAt = new Date();
  } else if (this.isModified('status') && this.status !== 'done') {
    this.completedAt = undefined;
  }
  next();
});

export default models.Task || mongoose.model('Task', TaskSchema); 