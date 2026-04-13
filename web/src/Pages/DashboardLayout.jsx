import React from "react";
import Sidebar from "../Components/SideBar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[#fefae0] text-[#333] flex flex-col">

      {/* TOP SUMMARY (optional static or move later) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">

        <UserCard title="My Borrowed Books" value="3 Books" />
        <UserCard title="Due Soon" value="1 Book" />
        <UserCard title="Pending Returns" value="0 Overdue" />

      </section>

      {/* MAIN AREA */}
      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function UserCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow text-center hover:scale-105 transition">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-xl font-bold text-[#283618]">{value}</p>
    </div>
  );
}