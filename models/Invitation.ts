import mongoose from "mongoose";
import sgMail from "@sendgrid/mail";

const invitationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  role: { type: String, enum: ['admin', 'member'], default: 'member' },
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  from: { type: String, default: process.env.EMAIL_FROM }
});

export default mongoose.models.Invitation || mongoose.model("Invitation", invitationSchema); 


