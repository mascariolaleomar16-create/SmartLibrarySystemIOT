import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const { user, loading, setUser, fetchUser } = useAuth();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${API_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );

      await fetchUser();

      // instantly clear global auth state
      setUser(null);

      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="w-full bg-blue-600 py-4 shadow-md border-b border-blue-700">
      <div className="flex items-center justify-between px-6">

        {/* LEFT: Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/BF.ico"
            alt="BookFlow Logo"
            className="h-10 w-10 object-contain"
          />

          <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-wide">
            BookFlow
          </h1>
        </div>

        {/* RIGHT: Auth Section */}
        <div className="flex items-center gap-4 text-sm">

          {loading ? (
            <span className="text-blue-100">Loading...</span>
          ) : user ? (
            <>
              {/* Logged in */}
              <span className="hidden md:block font-bold uppercase tracking-wide text-white">
                {user.username}
              </span>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-xl font-semibold shadow hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Not logged in */}
              <Link
                to="/login"
                className="bg-white text-blue-600 px-4 py-2 rounded-xl font-semibold shadow hover:bg-blue-50 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="border-2 border-white text-white px-4 py-2 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition"
              >
                Register
              </Link>
            </>
          )}

        </div>

      </div>
    </nav>
  );
}