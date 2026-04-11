import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Registration() {
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Remove confirmPassword before sending
      const { confirmPassword, ...payload } = form;

      await axios.post(
        `${API_URL}/auth/register`,
        payload
      );

      alert("Registration successful!");
      navigate("/login");

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fefae0] py-10">
      <div className="w-full max-w-2xl bg-[#e9edc9] p-8 rounded-2xl shadow-lg">
        
        <h1 className="text-3xl font-bold text-center mb-6 text-[#d4a373]">
          Smart Library Register
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Username */}
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full p-3 rounded-lg border"
            required
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 rounded-lg border"
            required
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-3 rounded-lg border"
            required
          />

          {/* Confirm Password */}
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="w-full p-3 rounded-lg border"
            required
          />

          {/* Address */}
          <h2 className="text-lg font-semibold text-[#d4a373] mt-4">
            Address
          </h2>

          <div className="grid md:grid-cols-2 gap-3">
            <input name="street" placeholder="Street" value={form.address.street} onChange={handleChange} className="p-3 border rounded" required />
            <input name="city" placeholder="City" value={form.address.city} onChange={handleChange} className="p-3 border rounded" required />
            <input name="state" placeholder="State" value={form.address.state} onChange={handleChange} className="p-3 border rounded" required />
            <input name="postalCode" placeholder="Postal Code" value={form.address.postalCode} onChange={handleChange} className="p-3 border rounded" required />
            <input name="country" placeholder="Country" value={form.address.country} onChange={handleChange} className="p-3 border rounded md:col-span-2" required />
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#d4a373] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>

        </form>

        <p className="text-center mt-6 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-[#d4a373] font-semibold hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}