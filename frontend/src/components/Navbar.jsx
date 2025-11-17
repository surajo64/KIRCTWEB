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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setShowMenu(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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

  return (
    <nav className="bg-white text-gray-700 shadow-lg sticky top-0 z-50">

      {/* Top Banner */}
      <div className="hidden sm:block bg-blue-950 py-2 text-sm text-blue-200 overflow-hidden">
        <div className="animate-marquee flex whitespace-nowrap">
          <span className="mx-6">👋 Welcome to Kano Independent Research Centre Trust!</span>
          <span className="mx-6">Need REDCap Free Access? Click the glowing button!</span>
          <span className="mx-6">📞 +234-80-80383147</span>
          <span className="mx-6">✉️ info@kirct.com</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto px-2 py-1 flex justify-between items-center">

        {/* Logo */}
        <div onClick={() => navigate("/")} className="flex items-center cursor-pointer gap-1">
          <img src={logo} className="w-10 h-10 bg-white rounded-lg p-1" />
          <span className="text-lg font-bold text-blue-800">KIRCT</span>
        </div>

        {/* DESKTOP MENU */}
        <div ref={dropdownRef} className="hidden lg:flex items-center gap-1">

          {menuItems.map((item, index) =>
            item.name === "REDCap" ? (
              <Link
                key={index}
                to={item.path}
                className="px-3 py-2 text-sm rounded-full bg-gradient-to-r from-blue-700 via-red-600 to-blue-700 text-white font-semibold"
              >
                <Database className="w-4 h-4 inline mr-1" /> REDCap
              </Link>
            ) : item.type === "link" ? (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium border-b-2 ${
                    isActive
                      ? "border-blue-600 text-blue-700"
                      : "border-transparent hover:border-blue-400 hover:text-blue-700"
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
                <button className="px-3 py-2 text-sm font-medium flex items-center hover:text-blue-600">
                  {item.name}
                  <svg
                    className={`ml-1 w-3 h-3 transition-transform ${
                      activeDropdown === item.name ? "rotate-180" : ""
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
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-0 mt-1 w-48 bg-white shadow-xl rounded-lg border text-sm"
                    >
                      {item.items.map((sub, i) => (
                        <NavLink
                          key={i}
                          to={sub.path}
                          className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-700"
                        >
                          {sub.name}
                        </NavLink>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          )}

        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setShowMenu(true)}
          className="lg:hidden p-2 rounded hover:bg-blue-50"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>


      {/* MOBILE MENU */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-blue-900 text-blue-100 z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-blue-800">
              <div className="flex items-center gap-3">
                <img src={logo} className="w-10 h-10 bg-white rounded-lg p-1" />
                <span className="text-lg font-bold">KIRCT</span>
              </div>
              <button onClick={() => setShowMenu(false)}>
                ❌
              </button>
            </div>

            {/* Menu Items */}
            <div className="py-4">
              {menuItems.map((item, index) => (
                <div key={index} className="border-b border-blue-700">
                  {item.type === "link" ? (
                    <NavLink
                      to={item.path}
                      onClick={() => setShowMenu(false)}
                      className="block px-6 py-4 hover:bg-blue-700"
                    >
                      {item.name}
                    </NavLink>
                  ) : (
                    <>
                      <button
                        onClick={() =>
                          setActiveDropdown(activeDropdown === item.name ? null : item.name)
                        }
                        className="flex justify-between w-full px-6 py-4 hover:bg-blue-700"
                      >
                        {item.name}
                        <span>{activeDropdown === item.name ? "▲" : "▼"}</span>
                      </button>

                      <AnimatePresence>
                        {activeDropdown === item.name && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                          >
                            {item.items.map((sub, i) => (
                              <NavLink
                                key={i}
                                to={sub.path}
                                className="block px-10 py-3 text-sm hover:bg-blue-700"
                                onClick={() => setShowMenu(false)}
                              >
                                {sub.name}
                              </NavLink>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="text-center py-4 text-sm border-t border-blue-700">
              📞 +234-80-80383147 <br />
              ✉️ info@kirct.com
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </nav>
  );
};

export default Navbar;
