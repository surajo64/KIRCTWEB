import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import LoadingOverlay from "../components/loadingOverlay.jsx";

const Login = () => {
  const { setToken, backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/login`, {
        email,
        password,
      });

      if (data.success && data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setToken(data.token);
        toast.success("Login successful!");
        navigate("/dashboard");
      }

    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-6 py-10 relative">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-center text-blue-800 mb-8 tracking-wide">
        KIRCT ADMIN <span className="text-red-600">LOGIN PAGE</span>
      </h1>

      {/* Login Card */}
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md border border-blue-100">
        <h2 className="text-2xl font-bold text-blue-800 text-center mb-6">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              placeholder="Enter your password"
            />
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:text-red-600 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl shadow-md transition-all duration-300"
          >
            Sign In
          </button>
        </form>
      </div>

      {/* Footer */}
      <p className="text-sm text-gray-600 mt-6 text-center">
        © {new Date().getFullYear()}{" "}
        <span className="text-blue-700 font-semibold">KIRCT</span> — All Rights Reserved.
      </p>

      {/* Loading Spinner */}
      {isLoading && <LoadingOverlay />}
    </div>
  );
};

export default Login;
