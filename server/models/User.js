import mongoose from 'mongoose';

const { Schema } = mongoose; // ✅ Destructure Schema from mongoose

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, lowercase: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'employee', 'hod'], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
});

const User = mongoose.model('User', userSchema);

export default User;
