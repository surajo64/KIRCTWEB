import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, Users, Settings, FileText, Briefcase } from "lucide-react";

const SidebarAdmin = ({ isSidebarOpen }) => {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", icon: <Home size={18} />, path: "/dashboard" },
    { name: "Job Applications", icon: <FileText size={18} />, path: "/job-application" },
    { name: "Internship Applications", icon: <FileText size={18} />, path: "/intenship-application" },
     { name: "Manage News", icon: <Users size={18} />, path: "/manage-news" },
    { name: "Manage Users", icon: <Users size={18} />, path: "/add-admin" },
    { name: "Settings", icon: <Settings size={18} />, path: "/settings" },
  ];

  return (
    <aside
      className={`fixed sm:static top-0 left-0 h-full sm:h-auto bg-blue-700 text-white w-64 sm:w-60 transition-transform transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
      } sm:translate-x-0 shadow-lg z-40`}
    >
      <div className="p-4 text-lg font-bold border-b border-blue-500">
        KIRCT Admin
      </div>
      <nav className="flex flex-col p-3 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-600 transition"
          >
            {item.icon}
            <span>{item.name}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default SidebarAdmin;
