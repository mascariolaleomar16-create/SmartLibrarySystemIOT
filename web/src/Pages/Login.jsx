import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function LoginPage() {
  const navigate = useNavigate();
  const { fetchUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = process.env.REACT_APP_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await axios.post(
        `${API_URL}/auth/login`,
        { email, password }
      );

      await fetchUser();

      navigate("/dashboard");

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">

      <div className="w-full max-w-md bg-white border border-blue-100 p-8 rounded-3xl shadow-2xl relative overflow-hidden">

        {/* RED ACCENT */}
        <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg border-4 border-red-100">
            <img
              src="/BF.ico"
              alt="BookFlow Logo"
              className="w-12 h-12 object-contain"
            />
          </div>

          <h1 className="text-3xl font-extrabold text-blue-600">
            Smart Library Login
          </h1>

          <p className="text-gray-500 mt-2 text-sm">
            Login to continue to BookFlow
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-600 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Footer */}
        <p className="text-center text-sm mt-6 text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-red-500 font-semibold hover:text-red-600 transition"
          >
            Register
          </Link>
        </p>

      </div>

    </div>
  );
}