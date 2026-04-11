import React from "react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#fefae0] text-[#333] flex flex-col">

      {/* TOP SUMMARY (User-focused) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-[#e9edc9]">

        <UserCard title="My Borrowed Books" value="3 Books" />
        <UserCard title="Due Soon" value="1 Book" />
        <UserCard title="Pending Returns" value="0 Overdue" />

      </section>

      {/* MAIN CONTENT */}
      <div className="flex flex-1">

        {/* SIDEBAR */}
        <aside className="w-64 bg-[#606c38] text-white p-5 space-y-4 hidden md:block">
          <NavItem label="Dashboard" />
          <NavItem label="My Books" />
          <NavItem label="Available Books" />
          <NavItem label="Search Library" />
          <NavItem label="Notifications" />
        </aside>

        {/* CONTENT AREA */}
        <main className="flex-1 p-6 space-y-6">

          {/* USER STATUS CARD */}
          <div className="bg-white p-5 rounded-2xl shadow">
            <h2 className="text-lg font-semibold mb-2">
              Welcome Back 👋
            </h2>
            <p className="text-[#606c38] font-medium">
              You can borrow, return, and scan books using RFID
            </p>
          </div>

          {/* BORROWED BOOKS */}
          <div className="bg-white p-5 rounded-2xl shadow">
            <h2 className="text-lg font-semibold mb-4">My Borrowed Books</h2>

            <div className="space-y-3">
              <BookItem
                title="Introduction to AI"
                due="Due in 2 days"
                status="warning"
              />
              <BookItem
                title="Database Systems"
                due="Due in 5 days"
                status="good"
              />
            </div>
          </div>

          {/* RFID STATUS */}
          <div className="bg-white p-5 rounded-2xl shadow">
            <h2 className="text-lg font-semibold mb-2">RFID Scanner</h2>
            <p className="text-green-600 font-medium">
              Ready to Scan
            </p>
          </div>

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

function NavItem({ label }) {
  return (
    <div className="hover:bg-[#283618] p-2 rounded cursor-pointer transition">
      {label}
    </div>
  );
}

function BookItem({ title, due, status }) {
  return (
    <div className="flex justify-between items-center border p-3 rounded-lg">
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-gray-500">{due}</p>
      </div>

      <span
        className={`text-sm px-3 py-1 rounded-full ${
          status === "warning"
            ? "bg-red-100 text-red-600"
            : "bg-green-100 text-green-600"
        }`}
      >
        {status === "warning" ? "Due Soon" : "On Track"}
      </span>
    </div>
  );
}