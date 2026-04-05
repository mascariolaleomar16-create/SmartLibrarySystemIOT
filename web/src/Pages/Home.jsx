import React from "react";
import { Link } from "react-router-dom";

export default function LibraryHomePage() {
  return (
    <div className="min-h-screen bg-[#fefae0] text-gray-800">

      {/* HERO SECTION */}
      <section className="relative bg-[#e9edc9] py-24 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 items-center gap-10">
          {/* TEXT */}
          <div className="text-center md:text-left">
            <h1 className="text-5xl font-extrabold mb-6 leading-tight">
              Smart Library <span className="text-[#d4a373]">BookFlow</span>
            </h1>
            <p className="text-lg mb-8 text-gray-700">
              Experience seamless book borrowing with RFID-powered automation. Fast, secure, and built for modern libraries.
            </p>

            <div className="flex justify-center md:justify-start gap-4">
              <Link to="/register">
                <button className="bg-[#d4a373] text-white px-8 py-3 rounded-2xl shadow-lg hover:scale-105 transition">
                  Get Started
                </button>
              </Link>

              <Link to="/login">
                <button className="border-2 border-[#d4a373] text-[#d4a373] px-8 py-3 rounded-2xl hover:bg-[#d4a373] hover:text-white transition">
                  Login
                </button>
              </Link>
            </div>
          </div>

          {/* IMAGE */}
          <div className="flex justify-center">
            <img
              src="/images/library-hero.png"
              alt="Library Illustration"
              className="w-full max-w-md drop-shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-8 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Core Features</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "RFID Automation",
              desc: "Instantly scan books for borrowing and returning using RFID technology.",
              img: "/images/rfid.png",
            },
            {
              title: "Smart Tracking",
              desc: "Track borrowed books, due dates, and penalties automatically.",
              img: "/images/tracking.png",
            },
            {
              title: "User Management",
              desc: "Admins can manage users, monitor activity, and control access.",
              img: "/images/users.png",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-[#e9edc9] p-8 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition text-center"
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-20 h-20 mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold mb-3 text-[#d4a373]">
                {item.title}
              </h3>
              <p className="text-gray-700">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[#e9edc9] py-20 px-8">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto text-center">
          {[
            { step: "Register your account", img: "/images/register.png" },
            { step: "Scan book via RFID", img: "/images/scan.png" },
            { step: "Track & return easily", img: "/images/return.png" },
          ].map((item, i) => (
            <div key={i} className="p-6">
              <img
                src={item.img}
                alt={item.step}
                className="w-24 h-24 mx-auto mb-4"
              />
              <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center rounded-full bg-[#d4a373] text-white font-bold">
                {i + 1}
              </div>
              <p className="font-medium">{item.step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 text-center px-6">
        <h2 className="text-3xl font-bold mb-4">Start Using BookFlow Today</h2>
        <p className="mb-6 text-gray-600">
          Join now and simplify your library experience.
        </p>

        <Link to="/register">
          <button className="bg-[#d4a373] text-white px-10 py-4 rounded-2xl shadow-lg hover:scale-105 transition">
            Create Account
          </button>
        </Link>
      </section>

    </div>
  );
}