import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    gender: { type: String, required: true },
    address: { type: String },
    qualification: { type: String, required: true },
    experience: { type: Number },
    position: { type: String, required: true },
    coverLetter: { type: String, required: true },
    cv: {
      url: { type: String, required: true }, // Cloudinary URL
      public_id: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ["Pending", "Invited", "Approved", "Rejected"],
      default: "Pending",
    },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

export default JobApplication;

