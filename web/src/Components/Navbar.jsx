import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation  } from "react-router-dom";
import axios from "axios";

export default function Navbar() {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in (cookie-based)
  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/me`, {
        withCredentials: true,
      });

      setUser(res.data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [location]);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${API_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );

      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="w-full bg-[#d4a373] py-4 shadow-md">
      <div className="flex items-center justify-between px-6">

        {/* LEFT: Logo */}
        <div className="flex items-center gap-3">
          <img
            src="BF.ico"
            alt="BookFlow Logo"
            className="h-10 w-10 object-contain"
          />
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">
            BookFlow
          </h1>
        </div>

        {/* RIGHT: Auth Section */}
        <div className="flex items-center gap-4 text-white text-sm">

          {loading ? (
            <span>Loading...</span>
          ) : user ? (
            <>
              {/* Logged in */}
              <span className="hidden md:block font-bold uppercase tracking-wide">
                {user.username}
              </span>

              <button
                onClick={handleLogout}
                className="bg-white text-[#d4a373] px-3 py-1 rounded-md font-semibold hover:opacity-90 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Not logged in */}
              <Link
                to="/login"
                className="bg-white text-[#d4a373] px-3 py-1 rounded-md font-semibold hover:opacity-90 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="border border-white px-3 py-1 rounded-md hover:bg-white hover:text-[#d4a373] transition"
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