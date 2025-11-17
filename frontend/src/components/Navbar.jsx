import React, { useContext, useState, useRef, useEffect } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Database } from "lucide-react";
import logo from "../assets/logo.png";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { token, setToken } = useContext(AppContext);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDropdownEnter = (menu) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(menu);
  };

  const handleDropdownLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  const menuItems = [
    { name: "REDCap", path: "/redcap", type: "link" },
    { name: "HOME", path: "/", type: "link" },
    {
      name: "ABOUT",
      type: "dropdown",
      items: [
        { name: "About Us", path: "/about" },
        { name: "Our Team", path: "/team" },
        { name: "Facility Description", path: "/facility" },
        { name: "Corporate Profile", path: "/profile" },
        { name: "Meet Our DG", path: "/about-dg" },
        { name: "Board of Trustees", path: "/board" },
        { name: "KIRCT Ethics Committee", path: "/ethics-committee" },
        { name: "Image Gallery", path: "/gallery" },
      ],
    },
    {
      name: "DEPARTMENTS",
      type: "dropdown",
      items: [
        { name: "Epidemiology & Population", path: "/epidemiology" },
        { name: "Maternal & Child Health", path: "/maternal-child" },
        { name: "Health Metrics & AI", path: "/health-metrics" },
        { name: "Hospital Complex", path: "/hospital-complex" },
      ],
    },
    {
      name: "RESEARCH",
      type: "dropdown",
      items: [
        { name: "Genomics Unit", path: "/genomics" },
        { name: "Microbiology Unit", path: "/microbiology" },
        { name: "TB Unit", path: "/tb-unit" },
        { name: "Research Studies", path: "/research-studies" },
        { name: "Vaccine Research", path: "/vaccine-research" },
        { name: "Publications", path: "/publications" },
      ],
    },
    {
      name: "COLLABORATIONS",
      type: "dropdown",
      items: [
        { name: "International Collaboration", path: "/international" },
        { name: "National Collaboration", path: "/national" },
      ],
    },
    {
      name: "SERVICES",
      type: "dropdown",
      items: [
        { name: "Clinical Diagnostic Lab", path: "/clinical-lab" },
        { name: "Central Research Lab", path: "/research-lab" },
      ],
    },
    {
      name: "APPLICATIONS",
      type: "dropdown",
      items: [
        { name: "Internship Application", path: "/internship" },
        { name: "Job Vacancy", path: "/job-vacancy" },
      ],
    },
    {
      name: "TRAINING",
      type: "dropdown",
      items: [
        { name: "Completed Trainings", path: "/completed" },
        { name: "Upcoming Workshops", path: "/upcoming" },
      ],
    },
    { name: "NEWS", path: "/news", type: "link" },
    { name: "CONTACT", path: "/contact", type: "link" },
  ];
// <nav className="bg-gradient-to-r from-blue-900 via-blue-800 to-red-700 text-white shadow-xl sticky top-0 z-50">
  return (
   <nav className="bg-white text-gray-700 shadow-xl sticky top-0 z-50">
   
      {/* Scrolling Banner */}
      <div className="relative overflow-hidden bg-blue-950 py-2 text-sm text-blue-200">
        <div className="animate-marquee whitespace-nowrap flex items-center px-6">
          <span className="mx-12">👋 Welcome to Kano Independent Research Centre Trust!</span>
          <span className="mx-12">Need REDCap Free Access ? Click the glowing button below!</span>
          <span className="mx-12">📞 +234-80-80383147</span>
          <span className="mx-12">✉️ info@kirct.com</span>
          <span className="mx-12">🌐 www.kirct.com</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto px-2 py-2 lg:px-4 lg:py-3 flex justify-between items-center">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <img
            src={logo}
            alt="KIRCT Logo"
            className="w-12 h-12 bg-white rounded-lg p-1 transition-transform group-hover:scale-110"
          />
          <span className="text-xl font-bold text-blue-800 leading-tight">KIRCT</span>
        </div>

        {/* Desktop Menu */}
        <div ref={dropdownRef} className="hidden xl:flex items-center space-x-2">
          {menuItems.map((item, index) =>
            item.name === "REDCap" ? (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{
                  scale: 1.1,
                  rotate: 1,
                  textShadow: "0px 0px 8px rgba(255,255,255,0.8)",
                }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="relative"
              >
                <Link
                  to={item.path}
                  className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-700 via-red-600 to-blue-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <Database className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>

                {/* Animated Glow */}
                <motion.span
                  className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-red-400 to-blue-400 opacity-70 blur-lg"
                  animate={{
                    opacity: [0.6, 1, 0.6],
                    scale: [1, 1.1, 1],
                    filter: ["blur(8px)", "blur(12px)", "blur(8px)"],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            ) : item.type === "link" ? (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `px-4 py-3 text-sm font-semibold border-b-2 transition-all ${isActive
                    ? "border-blue-600 text-blue-700"
                    : "border-transparent hover:text-blue-700 hover:border-blue-400"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ) : (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => handleDropdownEnter(item.name)}
                onMouseLeave={handleDropdownLeave}
              >
                <button className="px-4 py-3 flex items-center text-sm font-semibold hover:text-blue-600 transition-all">
                  {item.name}
                  <svg
                    className={`ml-1 w-3 h-3 transition-transform ${activeDropdown === item.name ? "rotate-180" : ""
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <AnimatePresence>
                  {activeDropdown === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 top-full mt-1 min-w-60 bg-white text-gray-700 rounded-lg shadow-xl py-2 border border-blue-100 z-[999]"
                    >
                      {item.items.map((subItem, subIndex) => (
                        <NavLink
                          key={subIndex}
                          to={subItem.path}
                          className="block px-5 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 transition-all"
                          onClick={() => setActiveDropdown(null)}
                        >
                          {subItem.name}
                        </NavLink>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setShowMenu(true)}
          className="xl:hidden p-2 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 bg-gradient-to-br from-blue-900 to-blue-800 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-blue-700">
              <div className="flex items-center gap-3">
                <img className="w-10 h-10 bg-white rounded-lg p-1" src={logo} alt="Logo" />
                <span className="text-lg font-bold text-white">KIRCT</span>
              </div>
              <button onClick={() => setShowMenu(false)}>
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-4">
              {menuItems.map((item, index) => (
                <div key={index} className="border-b border-blue-700">
                  {item.type === "link" ? (
                    <NavLink
                      to={item.path}
                      onClick={() => setShowMenu(false)}
                      className="block px-6 py-3 text-blue-100 hover:bg-blue-700 transition"
                    >
                      {item.name}
                    </NavLink>
                  ) : (
                    <div>
                      <button
                        onClick={() =>
                          setActiveDropdown(activeDropdown === item.name ? null : item.name)
                        }
                        className="flex justify-between w-full px-6 py-3 text-blue-100 hover:bg-blue-700"
                      >
                        {item.name}
                        <svg
                          className={`w-4 h-4 transform transition-transform ${activeDropdown === item.name ? "rotate-180" : ""
                            }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <AnimatePresence>
                        {activeDropdown === item.name && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-blue-800"
                          >
                            {item.items.map((subItem, i) => (
                              <NavLink
                                key={i}
                                to={subItem.path}
                                className="block px-8 py-2 text-blue-100 hover:bg-blue-700 text-sm"
                                onClick={() => setShowMenu(false)}
                              >
                                {subItem.name}
                              </NavLink>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
