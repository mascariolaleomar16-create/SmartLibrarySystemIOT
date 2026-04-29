import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // adjust path if needed

export default function Sidebar() {
  const { user, isAdmin, loading } = useAuth();

  const linkClass = ({ isActive }) =>
    `p-2 rounded transition block ${
      isActive ? "bg-[#283618] text-white" : "hover:bg-[#283618]"
    }`;

  // optional loading state (prevents flicker)
  if (loading) {
    return (
      <aside className="w-64 bg-[#606c38] text-white p-5 hidden md:block">
        <p>Loading...</p>
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-[#606c38] text-white p-5 space-y-2 hidden md:block">
      
      {/* USER INFO (optional but nice) */}
      <div className="mb-4">
        <p className="text-sm font-semibold">
          {user?.fullName || "User"}
        </p>
        <p className="text-xs text-white/70">
          {isAdmin ? "Admin" : "Basic User"}
        </p>
      </div>

      <hr className="border-white/30 mb-2" />

      {/* GENERAL LINKS */}
      <NavLink to="/dashboard" className={linkClass}>
        Dashboard
      </NavLink>

      <NavLink to="/dashboard/rfidscan" className={linkClass}>
        RFID Scanner
      </NavLink>

      <NavLink to="/dashboard/catalogue" className={linkClass}>
        Library Catalogue
      </NavLink>

      <NavLink to="/dashboard/borrowed-books" className={linkClass}>
        Borrowed Books
      </NavLink>

      <NavLink to="/dashboard/notifications" className={linkClass}>
        Notifications
      </NavLink>

      {/* 🔥 ADMIN SECTION */}
      {isAdmin && (
        <>
          <hr className="my-3 border-white/30" />

          <p className="text-xs uppercase text-white/70 tracking-wide">
            Admin
          </p>

          <NavLink to="/dashboard/add-book" className={linkClass}>
            Add Book
          </NavLink>

          <NavLink to="/dashboard/statistics" className={linkClass}>
            Statistics
          </NavLink>

          <NavLink to="/dashboard/manage-users" className={linkClass}>
            Manage Users
          </NavLink>

          <NavLink to="/dashboard/system-logs" className={linkClass}>
            System Logs
          </NavLink>
        </>
      )}
    </aside>
  );
}