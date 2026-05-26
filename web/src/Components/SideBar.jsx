import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { user, isAdmin, loading } = useAuth();

  const linkClass = ({ isActive }) =>
    `p-2 rounded-lg transition block font-medium ${
      isActive
        ? "bg-white text-blue-700 font-bold shadow border-l-4 border-red-500"
        : "hover:bg-white/10 text-white"
    }`;

  if (loading) {
    return (
      <aside className="w-64 bg-gradient-to-b from-blue-700 to-blue-900 text-white p-5 hidden md:block">
        <p className="text-white/70">Loading...</p>
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-gradient-to-b from-blue-700 via-blue-800 to-blue-900 text-white p-5 space-y-2 hidden md:block shadow-xl">

      {/* USER INFO */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-white">
          {user?.fullName || "User"}
        </p>

        <p className="text-xs text-white/70">
          {isAdmin ? "Admin Access" : "Basic User"}
        </p>
      </div>

      <hr className="border-white/20 mb-2" />

      {/* DASHBOARD */}
      <NavLink to="/dashboard" className={linkClass}>
        Dashboard
      </NavLink>

      {/* ADMIN SECTION */}
      {isAdmin && (
        <>
          <hr className="my-3 border-white/20" />

          <p className="text-xs uppercase tracking-wider text-white/70 font-bold">
            Admin Panel
          </p>

          <NavLink to="/dashboard/borrow-return-manager" className={linkClass}>
            Borrow Return Manager
          </NavLink>

          <NavLink to="/dashboard/add-book" className={linkClass}>
            Add Book
          </NavLink>

          <NavLink to="/dashboard/statistics" className={linkClass}>
            Statistics
          </NavLink>

          <NavLink to="/dashboard/manage-users" className={linkClass}>
            Manage Users
          </NavLink>

          <hr className="my-3 border-white/20" />
        </>
      )}

      {/* GENERAL LINKS */}
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
    </aside>
  );
}