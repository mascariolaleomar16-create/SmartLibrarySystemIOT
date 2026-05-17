import React, { useEffect, useState } from "react";
import Sidebar from "../Components/SideBar";
import axios from "axios";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout() {
  const API_URL = process.env.REACT_APP_API_URL;
  const { user, isAdmin } = useAuth();

  const [totalBorrowed, setTotalBorrowed] = useState(0);
  const [overdueCount, setOverdueCount] = useState(0);
  const [dueSoonCount, setDueSoonCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?._id) return; // wait until auth is ready

    const fetchStats = async () => {
      try {
        setLoading(true);

        const userId = user._id;

        const [allRes, overdueRes, dueSoonRes] = await Promise.all([
          axios.get(`${API_URL}/borrow/user/${userId}`, {
            withCredentials: true,
          }),
          axios.get(`${API_URL}/borrow/user/${userId}/overdue`, {
            withCredentials: true,
          }),
          axios.get(`${API_URL}/borrow/user/${userId}/due-soon`, {
            withCredentials: true,
          }),
        ]);

        setTotalBorrowed(allRes.data.borrows?.length || 0);
        setOverdueCount(overdueRes.data.count || 0);
        setDueSoonCount(dueSoonRes.data.count || 0);
      } catch (err) {
        console.error("Dashboard stats error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?._id]);

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      {/* TOP SUMMARY */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        <UserCard
          title="My Borrowed Books"
          value={loading ? "Loading..." : `${totalBorrowed} Books`}
          type="blue"
        />

        <UserCard
          title="Due Soon"
          value={loading ? "Loading..." : `${dueSoonCount} Books`}
          type="blue"
        />

        <UserCard
          title="Overdue Books"
          value={loading ? "Loading..." : `${overdueCount} Books`}
          type="red"
        />
      </section>

      {/* MAIN AREA */}
      <div className="flex flex-1 bg-gray-50">
        <Sidebar />

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/* =========================
   CARD COMPONENT
========================= */
function UserCard({ title, value, type }) {
  const isRed = type === "red";

  return (
    <div
      className={`relative bg-white p-5 rounded-2xl shadow-md border transition hover:scale-[1.02]
      ${isRed ? "border-red-200" : "border-blue-100"}`}
    >
      <div
        className={`absolute top-0 left-0 w-full h-1 rounded-t-2xl
        ${isRed ? "bg-red-500" : "bg-blue-600"}`}
      />

      <h3 className="text-sm text-gray-500 mb-2">{title}</h3>

      <p
        className={`text-2xl font-extrabold
        ${isRed ? "text-red-500" : "text-blue-600"}`}
      >
        {value}
      </p>
    </div>
  );
}