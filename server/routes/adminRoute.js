import express from 'express'
import {addNews, addUser, applyInternship, applyJob, changePassword, deleteNews, getAllInternships, getAllNews, getApplications, getDashboardStats, getUsers, login, toggleNewsStatus, updateApplicationStatus, updateInternshipStatus, updateNews, updateUser,  } from '../controller/adminController.js';
import authUser from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js'; // ✅ You must have this

const authAdmin = express.Router();

// user Routes
authAdmin.post('/login', login);
authAdmin.post("/create", authUser, addUser);
authAdmin.get("/get", authUser,getUsers);
authAdmin.post("/update/:id",authUser, updateUser);
authAdmin.post('/change-password',authUser, changePassword );
authAdmin.get("/dashboard", authUser, getDashboardStats);



// internship Routes
authAdmin.post("/apply", upload.single("file"), applyInternship);

authAdmin.get("/get-internships", authUser, getAllInternships);
authAdmin.post("/update-status/:id", authUser, updateInternshipStatus);


// Job Application routes
authAdmin.post("/applyJob", upload.single("cv"), applyJob);
authAdmin.get("/applications",authUser, getApplications);
authAdmin.post("/applications/:id/status",authUser, updateApplicationStatus);

// Public route
authAdmin.get("/getNews", getAllNews);

// Admin routes
authAdmin.post('/addNews', authUser, upload.single('image'), addNews);
authAdmin.put('/update/:id', authUser, upload.single('image'), updateNews);
authAdmin.patch("/toggle/:id", authUser, toggleNewsStatus);
authAdmin.delete('/delete/:id', authUser, deleteNews);

export default authAdmin;