import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: String, required: true },
    image: { type: String, required: true }, // You can store Cloudinary URL
    summary: { type: String, required: true },
    content: { type: String, required: true },
    status: { type: Boolean, default: true }, // active/inactive
  },
  { timestamps: true }
);

const News = mongoose.model('News', newsSchema);

export default News;