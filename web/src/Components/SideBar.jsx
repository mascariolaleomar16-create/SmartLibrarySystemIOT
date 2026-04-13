import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const linkClass = ({ isActive }) =>
    `p-2 rounded transition block ${
      isActive ? "bg-[#283618] text-white" : "hover:bg-[#283618]"
    }`;

  return (
    <aside className="w-64 bg-[#606c38] text-white p-5 space-y-2 hidden md:block">
        <NavLink to="/dashboard" className={linkClass}>
            Dashboard
        </NavLink>
        <NavLink to="/dashboard/rfidscan" className={linkClass}>
            RFID Scanner
        </NavLink>
        <NavLink to="/dashboard/borrowed-books" className={linkClass}>
            Borrowed Books
        </NavLink>

        <NavLink to="/dashboard/available" className={linkClass}>
            Available Books
        </NavLink>

        <NavLink to="/dashboard/search" className={linkClass}>
            Search Library
        </NavLink>

        <NavLink to="/dashboard/notifications" className={linkClass}>
            Notifications
        </NavLink>
    </aside>
  );
}