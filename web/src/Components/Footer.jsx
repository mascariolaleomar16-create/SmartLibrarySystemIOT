import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-blue-600 text-white mt-10 border-t-4 border-red-500">

      <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8 text-sm">

        {/* System Info */}
        <div>
          <h2 className="text-lg font-bold mb-3">
            <span className="text-red-300">BookFlow</span> | Smart Library System with IoT
          </h2>

          <p className="text-blue-100 leading-relaxed">
            A smart library system powered by RFID and MERN stack.
            Easily manage books, users, and borrowing activities.
          </p>

          <div className="w-12 h-1 bg-red-500 mt-4 rounded-full"></div>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-bold mb-3">
            Quick Links
          </h2>

          <ul className="space-y-2 text-blue-100">
            <li>
              <Link to="/" className="hover:text-red-300 hover:underline transition">
                Home
              </Link>
            </li>

            <li>
              <Link to="/login" className="hover:text-red-300 hover:underline transition">
                Login
              </Link>
            </li>

            <li>
              <Link to="/register" className="hover:text-red-300 hover:underline transition">
                Register
              </Link>
            </li>

            <li>
              <Link to="/credits" className="hover:text-red-300 hover:underline transition">
                Credits
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact / Info */}
        <div>
          <h2 className="text-lg font-bold mb-3">
            Library Info
          </h2>

          <ul className="space-y-2 text-blue-100">
            <li>
              <span className="text-red-300 font-semibold">Email:</span>{" "}
              support@bookflow.com
            </li>

            <li>
              <span className="text-red-300 font-semibold">Phone:</span>{" "}
              +63 900 000 0000
            </li>

            <li>
              <span className="text-red-300 font-semibold">Hours:</span>{" "}
              Mon - Fri (8:00 AM - 5:00 PM)
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-red-500 text-center py-4 text-sm text-blue-100">
        <span className="text-red-300 font-semibold">©</span>{" "}
        {new Date().getFullYear()} BookFlow | BSIT-3A Batch 2025–2026 | All Rights Reserved
      </div>

    </footer>
  );
}