// controller/adminController.js
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import Internship from "../models/internshipModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import JobApplication from "../models/job.js";
import News from "../models/News.js";



export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ success: false, message: "User does not exist" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ success: false, message: "Invalid email or password" });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};



// internship Controllers

export const applyInternship = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      gender,
      institution,
      course,
      department,
      level,
      startDate,
      endDate,
      reason,
    } = req.body;

    // File URL from Cloudinary
    const fileUrl = req.file ? req.file.path : null;

    const newInternship = new Internship({
      name,
      email,
      phone,
      gender,
      institution,
      course,
      department,
      level,
      startDate,
      endDate,
      reason,
      file: fileUrl,
    });

    await newInternship.save();
    res.status(201).json({ success: true, message: "Internship submitted successfully!" });
  } catch (error) {
    console.error("Internship creation failed:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};


// Get all internship applications (Admin)
export const getAllInternships = async (req, res) => {
  try {
    const applications = await Internship.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// ✅ Update Internship Application Status + Email Notification
export const updateInternshipStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Pending", "Approved", "Rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const internship = await Internship.findById(id);
    if (!internship) {
      return res.status(404).json({ message: "Application not found." });
    }

    internship.status = status;
    await internship.save();

    // ✅ Send email notification
    let subject, html;
    if (status === "Approved") {
      subject = "Internship Application Approved ✅";
      html = `
        <h3>Hello ${internship.name},</h3>
        <p>Congratulations! Your internship application has been <b>approved</b>.</p>
        <p>Department: ${internship.department}</p>
        <p>Duration: ${internship.startDate} → ${internship.endDate}</p>
        <p>We look forward to welcoming you onboard.</p>
        <p>Best Regards,<br/>KIRCT HR Department</p>
      `;
    } else if (status === "Rejected") {
      subject = "Internship Application Update ❌";
      html = `
        <h3>Hello ${internship.name},</h3>
        <p>We regret to inform you that your internship application has been <b>rejected</b>.</p>
        <p>We encourage you to reapply in the future.</p>
        <p>Best Wishes,<br/>KIRCT HR Department</p>
      `;
    }

    await sendEmail(internship.email, subject, html);

    return res.status(200).json({
      message: `Application status updated to ${status}. Email sent to ${internship.email}`,
      data: internship,
    });
  } catch (error) {
    console.error("Error updating internship status:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// Job Applications Controllers

// Apply for a job
export const applyJob = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "CV is required" });

    // Create new application
    const newApp = new JobApplication({
      ...req.body,
      position: req.body.position || "Not specified",
      cv: {
        url: req.file.path,
        public_id: req.file.filename,
      },
    });

    await newApp.save();
    res.status(201).json({ message: "Application submitted successfully", application: newApp });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all applications (admin)
export const getApplications = async (req, res) => {
  try {
    const apps = await JobApplication.find().sort({ appliedAt: -1 });
    res.json({apps});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/// Update status (approve/reject) and notify applicant
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Pending", "Invite", "Approved", "Rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const app = await JobApplication.findById(id);
    if (!app) {
      return res.status(404).json({ message: "Application not found." });
    }

    app.status = status;
    await app.save();

    // ✅ Prepare email content
    let subject = "";
    let html = "";

    switch (status) {
      case "Approved":
        subject = "Job Application Approved ✅";
        html = `
          <h3>Hello ${app.name},</h3>
          <p>Congratulations! Your application for <b>${app.positionApplied}</b> has been <b>approved</b>.</p>
          <p>We will contact you soon with further details.</p>
          <p>Best Regards,<br/>KIRCT HR Department</p>
        `;
        break;

      case "Rejected":
        subject = "Job Application Update ❌";
        html = `
          <h3>Hello ${app.name},</h3>
          <p>We regret to inform you that your application for <b>${app.positionApplied}</b> has been <b>rejected</b>.</p>
          <p>We encourage you to apply again in the future.</p>
          <p>Best Wishes,<br/>KIRCT HR Department</p>
        `;
        break;

      case "Invite":
        subject = "Job Application Invitation 📨";
        html = `
          <h3>Hello ${app.name},</h3>
          <p>Your application for <b>${app.positionApplied}</b> has been reviewed, and you are <b>invited</b> for further assessment/interview.</p>
          <p>We will contact you with schedule details.</p>
          <p>Best Regards,<br/>KIRCT HR Department</p>
        `;
        break;

      default:
        break;
    }

    if (status !== "Pending") {
      await sendEmail(app.email, subject, html);
    }

    res.status(200).json({
      message: `Application status updated to ${status}. Email sent to ${app.email}`,
      application: app,
    });
  } catch (error) {
    console.error("Error updating job application status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// user Controllers

// Add new user
export const addUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role)
      return res.status(400).json({ message: "All fields are required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ message: "User created", user: newUser });
  } catch (error) {
    console.error("Add User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all applications (admin)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ users }); // ✅ lowercase and correct key
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { name, email, role, updatedAt: Date.now() },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated", user });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// API to change Password

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    const userId = req.userId; // ✅ this comes from your auth middleware

    if (!userId || !oldPassword || !newPassword || !confirmPassword) {
      return res.json({ success: false, message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.json({ success: false, message: "New password and confirm password do not match" });
    }

    const user = await User.findById(userId); // ✅ correctly placed after declaration
    if (!user || !user.password) {
      return res.json({ success: false, message: "User not found or password missing" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Incorrect old password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await User.updateOne(
      { _id: userId },
      { $set: { password: hashedPassword } }
    );


    return res.json({ success: true, message: "Password changed successfully" });

  } catch (error) {
    console.error("Password change error:", error); // 🔍 Shows the real error
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalJobs = await JobApplication.countDocuments();
    const totalInterns = await Internship.countDocuments();
    const totalNews = await News.countDocuments();

    // For chart visualization
    const jobStats = await JobApplication.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          jobs: { $sum: 1 },
        },
      },
    ]);

    const userStats = await User.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          users: { $sum: 1 },
        },
      },
    ]);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const chartData = months.map((m, i) => ({
      name: m,
      users: userStats.find((u) => u._id === i + 1)?.users || 0,
      jobs: jobStats.find((j) => j._id === i + 1)?.jobs || 0,
    }));

    // Fetch latest users
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(3);

    // Fetch latest job applications
    const recentJobs = await JobApplication.find().sort({ createdAt: -1 }).limit(3);

    // Fetch recently updated applications (Approved / Rejected / Invite)
    const recentStatusUpdates = await JobApplication.find({
      status: { $in: ["Approved", "Rejected", "Invite"] },
    })
      .sort({ updatedAt: -1 })
      .limit(3);

    // Merge all activities together
    const recentActivities = [
      ...recentUsers.map((u) => ({
        text: `New user registered: ${u.name}`,
        type: "user",
        time: u.createdAt,
      })),
      ...recentJobs.map((j) => ({
        text: `Job application received for ${j.position || "a position"}`,
        type: "job",
        time: j.createdAt,
      })),
      ...recentStatusUpdates.map((j) => ({
        text: `Application for ${j.position || "a position"} was ${j.status}`,
        type: j.status === "Approved" ? "success" : j.status === "Rejected" ? "error" : "invite",
        time: j.updatedAt,
      })),
    ]
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 8);

    res.json({
      totalUsers,
      totalJobs,
      totalInterns,
      totalNews,
      chartData,
      recentActivities,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};


// ➕ Add News

export const addNews = async (req, res) => {
  try {
    const { title, date, summary, content } = req.body;
    
    // Validate required fields
    if (!title || !date || !summary || !content) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required" 
      });
    }

    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "Image is required" 
      });
    }

    const newsData = {
      title,
      date,
      summary,
      content,
      image: req.file.path // Cloudinary URL
    };

    const news = await News.create(newsData);
    res.status(201).json({ 
      success: true, 
      message: "News created successfully", 
      news 
    });
  } catch (err) {
    console.error('Create news error:', err);
    res.status(500).json({ success: false, message: "Failed to create news" });
  }
};

// ✏️ Update News
export const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, summary, content } = req.body;

    // Find existing news
    const existingNews = await News.findById(id);
    if (!existingNews) {
      return res.status(404).json({ success: false, message: "News not found" });
    }

    const updateData = {
      title: title || existingNews.title,
      date: date || existingNews.date,
      summary: summary || existingNews.summary,
      content: content || existingNews.content,
    };

    // If new image is uploaded, update image and delete old one from Cloudinary
    if (req.file) {
      // Delete old image from Cloudinary if it exists
      if (existingNews.image) {
        const publicId = existingNews.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`news-images/${publicId}`);
      }
      updateData.image = req.file.path;
    }

    const updatedNews = await News.findByIdAndUpdate(id, updateData, { 
      new: true, 
      runValidators: true 
    });

    res.json({ 
      success: true, 
      message: "News updated successfully", 
      news: updatedNews 
    });
  } catch (err) {
    console.error('Update news error:', err);
    res.status(500).json({ success: false, message: "Update failed" });
  }
};

// 🧾 Get All News
export const getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json({ success: true, news });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🚫 Disable / Enable News
export const toggleNewsStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findById(id);
    if (!news) return res.status(404).json({ success: false, message: "News not found" });

    news.status = !news.status;
    await news.save();
    res.json({ success: true, message: `News ${news.status ? "enabled" : "disabled"} successfully` });
  } catch (err) {
    res.status(500).json({ success: false, message: "Toggle failed" });
  }
};

// 🗑️ Delete News
export const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findById(id);
    
    if (!news) {
      return res.status(404).json({ success: false, message: "News not found" });
    }

    // Delete image from Cloudinary
    if (news.image) {
      const publicId = news.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`news-images/${publicId}`);
    }

    await News.findByIdAndDelete(id);

    res.json({ 
      success: true, 
      message: "News deleted successfully" 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete news" });
  }
};
