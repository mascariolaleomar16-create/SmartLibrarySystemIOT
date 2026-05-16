import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line
} from "recharts";

const API_URL = process.env.REACT_APP_API_URL;

export default function Statistics() {
  const [overview, setOverview] = useState({});
  const [trend, setTrend] = useState([]);
  const [mostBorrowed, setMostBorrowed] = useState([]);
  const [overdue, setOverdue] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [o, t, m, ov] = await Promise.all([
      axios.get(`${API_URL}/stats/overview`),
      axios.get(`${API_URL}/stats/trend`),
      axios.get(`${API_URL}/stats/most-borrowed`),
      axios.get(`${API_URL}/stats/overdue`),
    ]);

    setOverview(o.data.data);
    setTrend(t.data.data);
    setMostBorrowed(m.data.data);
    setOverdue(ov.data.data);
  };

  return (
    <div className="space-y-6">

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

        <Card title="Books" value={overview.totalBooks} />
        <Card title="Users" value={overview.totalUsers} />
        <Card title="Active" value={overview.activeBorrows} />
        <Card title="Overdue" value={overview.overdueBorrows} />
        <Card title="Returned Today" value={overview.returnedToday} />

      </div>

      {/* BORROW TREND */}
      <div className="bg-white p-4 rounded-xl shadow border border-blue-100">
        <h2 className="font-semibold mb-3 text-blue-700">Borrow Trend</h2>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={trend}>
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#2563eb" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* MOST BORROWED */}
      <div className="bg-white p-4 rounded-xl shadow border border-blue-100">
        <h2 className="font-semibold mb-3 text-blue-700">Most Borrowed Books</h2>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={mostBorrowed}>
            <XAxis dataKey="book.title" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* OVERDUE LIST */}
      <div className="bg-white p-4 rounded-xl shadow border border-red-100">
        <h2 className="font-semibold mb-3 text-red-600">Overdue Books</h2>

        <div className="space-y-2">
          {overdue.map((b) => (
            <div key={b._id} className="flex justify-between text-sm border-b py-2">
              <span className="text-gray-700">{b.book?.title}</span>
              <span className="text-red-500 font-medium">
                {b.user?.username}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

/* =========================
   KPI CARD COMPONENT
========================= */
function Card({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow text-center border border-blue-100">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-xl font-bold text-blue-600">{value || 0}</h2>
    </div>
  );
}