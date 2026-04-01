import React from "react";
import { Link } from "react-router-dom";

export default function LibraryHomePage() {
  return (
    <div className="min-h-screen bg-[#fefae0] text-gray-800">

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-6 bg-[#e9edc9]">
        <h2 className="text-4xl font-bold mb-4">Welcome to the Smart Library</h2>
        <p className="max-w-xl mb-6 text-lg">
          Easily borrow and return books using RFID technology. Fast, secure, and convenient for students and admins.
        </p>
        
        <Link to="/register">
          <button className="bg-[#d4a373] text-white px-6 py-3 rounded-2xl shadow hover:opacity-90">
            Get Started
          </button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-16 px-8 grid md:grid-cols-3 gap-8">
        <div className="bg-[#e9edc9] p-6 rounded-2xl shadow">
          <h3 className="text-xl font-semibold mb-2">RFID Scanning</h3>
          <p>
            Borrow and return books instantly using RFID technology integrated with Arduino.
          </p>
        </div>

        <div className="bg-[#e9edc9] p-6 rounded-2xl shadow">
          <h3 className="text-xl font-semibold mb-2">User Management</h3>
          <p>
            Admins can manage students, track borrowing history, and monitor activity.
          </p>
        </div>

        <div className="bg-[#e9edc9] p-6 rounded-2xl shadow">
          <h3 className="text-xl font-semibold mb-2">Due & Notifications</h3>
          <p>
            Automatic due dates, penalties, and notifications for late returns.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#d4a373] text-white text-center py-4 mt-10">
        <p>© 2026 Smart Library System | Built with MERN & IoT</p>
      </footer>
    </div>
  );
}