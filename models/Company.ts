import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  members: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['admin', 'member'], default: 'member' },
    status: { type: String, enum: ['active', 'invited', 'pending'], default: 'active' }
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Company || mongoose.model("Company", companySchema); 