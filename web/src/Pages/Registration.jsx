import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { showSuccess, showError, showWarning } from "../utils/toast";

/* INPUT FIELD */
const InputField = ({
  label,
  name,
  type = "text",
  required = false,
  value,
  onChange,
}) => (
  <div>
    <label className="block text-sm font-semibold mb-1 text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>

    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
      required={required}
    />
  </div>
);

export default function Registration() {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    fullName: "",
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

  const addressFields = ["street", "city", "state", "postalCode", "country"];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (addressFields.includes(name)) {
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

    if (form.password !== form.confirmPassword) {
      return showWarning("Passwords do not match");
    }

    setLoading(true);

    try {
      const { confirmPassword, ...rest } = form;

      await axios.post(`${API_URL}/auth/register`, rest, {
        headers: { "Content-Type": "application/json" },
      });

      showSuccess("Registration successful");
      navigate("/login");
    } catch (err) {
      console.error(err);
      showError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-10 px-4">

      <div className="w-full max-w-2xl bg-white border border-blue-100 p-8 rounded-3xl shadow-2xl relative overflow-hidden">

        {/* RED TOP ACCENT */}
        <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>

        {/* HEADER */}
        <h1 className="text-3xl font-extrabold text-center mb-2 text-blue-600">
          Smart Library Register
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Create your BookFlow account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Full Name <span className="text-red-500">(optional)</span>
            </label>

            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <InputField
            label="Username"
            name="username"
            value={form.username}
            required
            onChange={handleChange}
          />

          <InputField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            required
            onChange={handleChange}
          />

          <InputField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            required
            onChange={handleChange}
          />

          <InputField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            required
            onChange={handleChange}
          />

          {/* ADDRESS SECTION */}
          <h2 className="text-lg font-bold text-blue-600 mt-6 border-l-4 border-red-500 pl-3">
            Address
          </h2>

          <div className="grid md:grid-cols-2 gap-3">

            <InputField label="Street" name="street" value={form.address.street} required onChange={handleChange} />
            <InputField label="City" name="city" value={form.address.city} required onChange={handleChange} />
            <InputField label="State" name="state" value={form.address.state} onChange={handleChange} />
            <InputField label="Postal Code" name="postalCode" value={form.address.postalCode} onChange={handleChange} />

            <div className="md:col-span-2">
              <InputField label="Country" name="country" value={form.address.country} required onChange={handleChange} />
            </div>

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-lg transition disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>

        </form>

        {/* LOGIN LINK */}
        <p className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-red-500 font-semibold hover:text-red-600 transition"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}