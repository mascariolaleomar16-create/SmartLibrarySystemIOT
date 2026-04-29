import React, { useEffect, useState } from "react";
import Sidebar from "../Components/SideBar";
import axios from "axios";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  const API_URL = process.env.REACT_APP_API_URL;

  const [user, setUser] = useState(null);

  const [totalBorrowed, setTotalBorrowed] = useState(0);
  const [overdueCount, setOverdueCount] = useState(0);
  const [dueSoonCount, setDueSoonCount] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        /* =========================
           GET USER
        ========================= */
        const userRes = await axios.get(`${API_URL}/auth/me`, {
          withCredentials: true,
        });

        const userId = userRes.data.user._id;
        setUser(userRes.data.user);

        /* =========================
           GET TOTAL BORROWS
        ========================= */
        const allRes = await axios.get(
          `${API_URL}/borrow/user/${userId}`,
          { withCredentials: true }
        );

        setTotalBorrowed(allRes.data.borrows?.length || 0);

        /* =========================
           GET OVERDUE (BACKEND)
        ========================= */
        const overdueRes = await axios.get(
          `${API_URL}/borrow/user/${userId}/overdue`,
          { withCredentials: true }
        );

        setOverdueCount(overdueRes.data.count || 0);

        /* =========================
           GET DUE SOON (BACKEND)
        ========================= */
        const dueSoonRes = await axios.get(
          `${API_URL}/borrow/user/${userId}/due-soon`,
          { withCredentials: true }
        );

        setDueSoonCount(dueSoonRes.data.count || 0);

      } catch (err) {
        console.error("Dashboard stats error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#fefae0] text-[#333] flex flex-col">

      {/* TOP SUMMARY */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">

        <UserCard
          title="My Borrowed Books"
          value={loading ? "Loading..." : `${totalBorrowed} Books`}
        />

        <UserCard
          title="My Books Due Soon"
          value={loading ? "Loading..." : `${dueSoonCount} Books`}
        />

        <UserCard
          title="My Overdue Books"
          value={loading ? "Loading..." : `${overdueCount} Books`}
        />

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

/* =========================
   CARD COMPONENT
========================= */
function UserCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow text-center hover:scale-105 transition">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-xl font-bold text-[#283618]">{value}</p>
    </div>
  );
}