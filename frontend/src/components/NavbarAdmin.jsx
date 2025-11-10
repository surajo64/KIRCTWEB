import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { Bell, LogOut, Menu, X } from "lucide-react";

const NavbarAdmin = ({ toggleSidebar, isSidebarOpen }) => {
  const { token, backendUrl, setToken, user, messages, setMessages, fetchMessages } =
    useContext(AppContext);
  const [showMessages, setShowMessages] = useState(false);
  const navigate = useNavigate();

  

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const markMessageRead = async (id) => {
    try {
      await axios.put(
        `${backendUrl}/api/auth/mark-read/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Error marking message read:", err);
    }
  };

  const inboxMessages = (messages || []).filter((msg) =>
    msg.recipients?.some((r) => {
      const rid = r._id?.toString() || r.toString();
      const uid = user._id?.toString();
      return rid === uid;
    })
  );

  const unreadInboxMessages = inboxMessages.filter((msg) => {
    const myReadStatus = msg.isRead?.find(
      (readStatus) => readStatus.userId?.toString() === user._id?.toString()
    );
    return !myReadStatus || myReadStatus.read === false;
  });

  const latestUnreadMessages = unreadInboxMessages.slice(0, 5);

  const handleViewMessage = (msg) => {
    markMessageRead(msg._id);
    setShowMessages(false);
    navigate("/messages", { state: { focusMessageId: msg._id } });
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm px-4 sm:px-6 py-3 sticky top-0 z-50 flex items-center justify-between">
      {/* Sidebar toggle */}
      <button
        onClick={toggleSidebar}
        className="text-blue-700 sm:hidden focus:outline-none hover:bg-blue-50 p-2 rounded-lg"
      >
        {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Title */}
      <h1 className="text-lg sm:text-xl font-semibold text-blue-700">
        Admin Dashboard
      </h1>

      {/* Right section */}
      <div className="flex items-center gap-5 relative">
        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setShowMessages(!showMessages)}
            className="relative p-2 rounded-full hover:bg-blue-50 text-blue-700 transition"
          >
            <Bell size={22} />
            {unreadInboxMessages.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {unreadInboxMessages.length}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {showMessages && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
              <div className="p-3 bg-blue-50 border-b border-gray-200 flex justify-between items-center">
                <span className="font-semibold text-blue-700">
                  Notifications
                </span>
                <span className="text-xs text-gray-500">
                  {unreadInboxMessages.length} unread
                </span>
              </div>

              <ul className="max-h-64 overflow-y-auto divide-y">
                {latestUnreadMessages.length > 0 ? (
                  latestUnreadMessages.map((msg) => (
                    <li
                      key={msg._id}
                      onClick={() => handleViewMessage(msg)}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition"
                    >
                      <div className="font-semibold text-gray-800">
                        {msg.title}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        From: {msg.createdBy?.name || "Admin"}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-3 text-sm text-gray-500 text-center">
                    No unread messages
                  </li>
                )}
              </ul>

              <div className="p-3 bg-gray-50 text-center">
                <button
                  onClick={() => {
                    navigate("/messages");
                    setShowMessages(false);
                  }}
                  className="text-blue-700 font-medium text-sm hover:underline"
                >
                  View All Messages
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="hidden sm:inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-full transition"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
};

export default NavbarAdmin;
