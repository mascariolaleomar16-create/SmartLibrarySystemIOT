import React from "react";
import { Link } from "react-router-dom";

export default function LibraryHomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 overflow-hidden">

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-red-600 py-24 px-6 text-white">
        
        {/* Decorative Blur */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-400 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-300 opacity-20 rounded-full blur-3xl"></div>

        <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 items-center gap-14">

          {/* TEXT */}
          <div className="text-center md:text-left">
            <div className="inline-block bg-white/10 border border-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-6 backdrop-blur">
              Smart Library System with IoT
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              Smart Library{" "}
              <span className="text-red-300">BookFlow</span>
            </h1>

            <p className="text-lg mb-8 text-blue-100 leading-relaxed max-w-xl">
              Experience seamless book borrowing with RFID-powered automation.
              Fast, secure, and designed for modern libraries and schools.
            </p>

            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
              
              <Link to="/register">
                <button className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-2xl shadow-2xl font-semibold hover:scale-105 transition">
                  Get Started
                </button>
              </Link>

              <Link to="/login">
                <button className="bg-white text-blue-700 px-8 py-4 rounded-2xl font-semibold hover:bg-blue-50 hover:scale-105 transition shadow-lg">
                  Login
                </button>
              </Link>

            </div>
          </div>

          {/* IMAGE */}
          <div className="flex justify-center">
            <div className="relative">
              
              {/* Red Glow */}
              <div className="absolute inset-0 bg-red-500 opacity-20 blur-3xl rounded-full"></div>

              <img
                src="/images/library-hero.png"
                alt="Library Illustration"
                className="relative w-full max-w-lg drop-shadow-2xl"
              />
            </div>
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-8 bg-white">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Core Features
            </h2>

            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-red-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "RFID Automation",
                desc: "Instantly scan books for borrowing and returning using RFID technology.",
                img: "/images/rfid.png",
                color: "blue",
              },
              {
                title: "Smart Tracking",
                desc: "Track borrowed books, due dates, and penalties automatically.",
                img: "/images/tracking.png",
                color: "red",
              },
              {
                title: "User Management",
                desc: "Admins can manage users, monitor activity, and control access.",
                img: "/images/users.png",
                color: "blue",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition text-center relative overflow-hidden"
              >

                {/* Accent Bar */}
                <div
                  className={`absolute top-0 left-0 w-full h-2 ${
                    item.color === "red"
                      ? "bg-red-500"
                      : "bg-blue-600"
                  }`}
                ></div>

                <img
                  src={item.img}
                  alt={item.title}
                  className="w-20 h-20 mx-auto mb-5"
                />

                <h3
                  className={`text-2xl font-bold mb-3 ${
                    item.color === "red"
                      ? "text-red-500"
                      : "text-blue-600"
                  }`}
                >
                  {item.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-8 bg-gradient-to-br from-blue-50 to-red-50 border-y border-gray-200">

        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              How It Works
            </h2>

            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">

            {[
              { step: "Register your account", img: "/images/register.png" },
              { step: "Scan book via RFID", img: "/images/scan.png" },
              { step: "Track & return easily", img: "/images/return.png" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-8 shadow-lg border border-white hover:shadow-2xl transition"
              >

                <img
                  src={item.img}
                  alt={item.step}
                  className="w-24 h-24 mx-auto mb-5"
                />

                <div
                  className={`w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full text-white font-bold text-lg shadow-lg ${
                    i % 2 === 0
                      ? "bg-blue-600"
                      : "bg-red-500"
                  }`}
                >
                  {i + 1}
                </div>

                <p className="font-semibold text-gray-700 text-lg">
                  {item.step}
                </p>

              </div>
            ))}

          </div>

        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 text-center px-6 bg-white relative overflow-hidden">

        {/* Decorative Shapes */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-red-100 rounded-full blur-3xl opacity-50"></div>

        <div className="relative max-w-3xl mx-auto">
          <h2 className="text-5xl font-extrabold mb-6 text-gray-900">
            Start Using{" "}
            <span className="text-blue-600">BookFlow</span>{" "}
            Today
          </h2>

          <p className="mb-8 text-lg text-gray-600 leading-relaxed">
            Join now and simplify your library experience with modern RFID-powered automation.
          </p>

          <Link to="/register">
            <button className="bg-gradient-to-r from-blue-600 to-red-500 hover:from-blue-700 hover:to-red-600 text-white px-12 py-5 rounded-2xl shadow-2xl text-lg font-bold hover:scale-105 transition">
              Create Account
            </button>
          </Link>
        </div>

      </section>

    </div>
  );
}