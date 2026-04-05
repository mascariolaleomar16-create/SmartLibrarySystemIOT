import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#d4a373] text-white mt-10">
      <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8 text-sm">
        {/* System Info */}
        <div>
          <h2 className="text-lg font-semibold mb-3">BookFlow | Smart Library System with IoT</h2>
          <p>
            A smart library system powered by RFID and MERN stack. Easily manage books, users, and borrowing activities.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Quick Links</h2>
          <ul className="space-y-2">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="/login" className="hover:underline">Login</a></li>
            <li><a href="/register" className="hover:underline">Register</a></li>
          </ul>
        </div>

        {/* Contact / Info */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Library Info</h2>
          <ul className="space-y-2">
            <li>Email: support@bookflow.com</li>
            <li>Phone: +63 900 000 0000</li>
            <li>Open Hours: Mon - Fri (8:00 AM - 5:00 PM)</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/30 text-center py-4 text-sm">
        © {new Date().getFullYear()} BookFlow | All Rights Reserved
      </div>
    </footer>
  );
}