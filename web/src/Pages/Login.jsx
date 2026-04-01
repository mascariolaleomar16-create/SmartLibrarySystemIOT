import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // temporary demo login
    console.log("Email:", email);
    console.log("Password:", password);

    alert("Login clicked (connect this to backend later)");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fefae0]">
      <div className="w-full max-w-md bg-[#e9edc9] p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-[#d4a373]">
          Smart Library Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-[#d4a373] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Don’t have an account? <span className="text-[#d4a373] cursor-pointer"><Link to="/register">Register</Link></span>
        </p>
      </div>
    </div>
  );
}