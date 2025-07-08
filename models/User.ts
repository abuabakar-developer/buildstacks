// models/User.ts
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

interface IUser extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  companyId?: mongoose.Types.ObjectId;
  role: string;
  country: string;
  businessType: string;
  constructionVolume: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
  },
  phone: {
    type: String,
    required: false,
    unique: false,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: false,
  },
  role: {
    type: String,
    enum: ['admin', 'member'],
    default: 'member',
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true,
  },
  businessType: {
    type: String,
    required: [true, 'Business type is required'],
    enum: ['residential-home', 'residential-remodeler', 'commercial-contractor', 'specialty-contractor'],
  },
  constructionVolume: {
    type: String,
    required: [true, 'Construction volume is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  if (!this.password) {
    return next(new Error('Password is required'));
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as any);
  }
});

// Method to compare password with proper type checking
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!this.password) {
    throw new Error('Password not set for this user');
  }
  
  if (!candidatePassword) {
    throw new Error('Candidate password is required');
  }

  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
export default User;



