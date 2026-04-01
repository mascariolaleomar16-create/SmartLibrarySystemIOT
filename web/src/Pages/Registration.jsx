import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Registration() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // handle nested address fields
    if (name in form.address) {
      setForm((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log("Register Data:", form);
    alert("Register submitted (connect to backend later)");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fefae0] py-10">
      <div className="w-full max-w-2xl bg-[#e9edc9] p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-[#d4a373]">
          Smart Library Register
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block mb-1 font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1 font-medium">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
              required
            />
          </div>

          {/* Address Section */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3 text-[#d4a373]">Address</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                name="street"
                placeholder="Street"
                value={form.address.street}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-300"
                required
              />

              <input
                type="text"
                name="city"
                placeholder="City"
                value={form.address.city}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-300"
                required
              />

              <input
                type="text"
                name="state"
                placeholder="State"
                value={form.address.state}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-300"
                required
              />

              <input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                value={form.address.postalCode}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-300"
                required
              />

              <input
                type="text"
                name="country"
                placeholder="Country"
                value={form.address.country}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-300 md:col-span-2"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#d4a373] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Register
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center mt-6 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-[#d4a373] font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}