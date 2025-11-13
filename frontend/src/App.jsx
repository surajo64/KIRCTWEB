import React, { useEffect, useContext } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLoading } from "./context/loadingContext";
import { AppContext } from "./context/AppContext";

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NavbarAdmin from './components/NavbarAdmin';
import Sidebar from './components/Sidebar';

// 🌍 Public Pages
import Home from './pages/Home';
import About from './pages/About';
import AboutDg from './pages/aboutDg';
import Facility from './pages/facility';
import Profile from './pages/profile';
import Board from './pages/board';
import EthicsCommuty from './pages/ethics';
import OurGallary from './pages/gallery';
import Epidemiology from './pages/epidemiology';
import Maternity from './pages/maternity';
import Hospital from './pages/hospital';
import HealthCare from './pages/health';
import Genomics from './pages/genomics';
import Microbiology from './pages/microbiology';
import Studies from './pages/studies';
import TbUnit from './pages/tbUnit';
import Vaccine from './pages/vaccine';
import Publications from './pages/publications';
import International from './pages/international';
import National from './pages/national';
import Clinical from './pages/clinical';
import ResearchLab from './pages/researchLab';
import JobVaccancy from './pages/job';
import Intenship from './pages/intenship';
import ContactForm from './pages/Contact';
import News from './pages/News';
import TraningCompleted from './pages/TraningCompleted';
import TraningUpcoming from './pages/TraningUpcoming';
import Tearm from './pages/tearm';
import Login from './pages/Login';

// 🔐 Protected Pages
import Dashboard from './pages/Dashboard';
import JobApplication from './pages/JobApplication';
import IntenshipApplication from './pages/IntenshipApplication';
import Setting from './pages/setting';
import AddAdmin from './pages/addAdmin';
import Redcap from './pages/redcap';
import ScrollToTop from './components/ScrollToTop';
import ManageNews from './pages/manageNews';

const App = () => {
  const { setLoading } = useLoading();
  const { token } = useContext(AppContext);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [location]);

  // Layout detection
  const isAdminRoute =
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/job-application') ||
    location.pathname.startsWith('/intenship-application') ||
    location.pathname.startsWith('/add-admin') ||
    location.pathname.startsWith('/setting')||
    location.pathname.startsWith('/manage-news');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <ToastContainer />
       <ScrollToTop />

      {/* 🧭 Public Layout */}
      {!isAdminRoute && (
        <>
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/about-dg" element={<AboutDg />} />
              <Route path="/facility" element={<Facility />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/board" element={<Board />} />
              <Route path="/ethics-committee" element={<EthicsCommuty />} />
              <Route path="/gallery" element={<OurGallary />} />
              <Route path="/epidemiology" element={<Epidemiology />} />
              <Route path="/maternal-child" element={<Maternity />} />
              <Route path="/health-metrics" element={<HealthCare />} />
              <Route path="/hospital-complex" element={<Hospital />} />
              <Route path="/genomics" element={<Genomics />} />
              <Route path="/microbiology" element={<Microbiology />} />
              <Route path="/research-studies" element={<Studies />} />
              <Route path="/tb-unit" element={<TbUnit />} />
              <Route path="/vaccine-research" element={<Vaccine />} />
              <Route path="/publications" element={<Publications />} />
              <Route path="/international" element={<International />} />
              <Route path="/national" element={<National />} />
              <Route path="/clinical-lab" element={<Clinical />} />
              <Route path="/research-lab" element={<ResearchLab />} />
              <Route path="/job-vacancy" element={<JobVaccancy />} />
              <Route path="/internship" element={<Intenship />} />
              <Route path="/completed" element={<TraningCompleted />} />
              <Route path="/upcoming" element={<TraningUpcoming />} />
              <Route path="/news" element={<News />} />
              <Route path="/contact" element={<ContactForm />} />
              <Route path="/team" element={<Tearm />} />
               <Route path="/redcap" element={<Redcap />} />
              <Route path="/admin" element={<Login />} />
            </Routes>
          </main>
          <Footer />
        </>
      )}

      {/* 🧱 Admin Layout */}
      {isAdminRoute && token && (
        <div className="flex min-h-screen bg-gray-100">
          <Sidebar />
          <div className="flex flex-col flex-1">
            <NavbarAdmin />
            <main className="flex-grow p-6 overflow-y-auto">
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/job-application" element={<JobApplication />} />
                <Route path="/intenship-application" element={<IntenshipApplication />} />
                <Route path="/add-admin" element={<AddAdmin />} />
                <Route path="/settings" element={<Setting />} />
                <Route path="/manage-news" element={<ManageNews />} />
              </Routes>
            </main>
          </div>
        </div>
      )}

      {/* 🚫 If not logged in but tries to access protected route */}
       {isAdminRoute && !token && <Navigate to="/admin" replace />}
      
    </div>
  );
};

export default App;
