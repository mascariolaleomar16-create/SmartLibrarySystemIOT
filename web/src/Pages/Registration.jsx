import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

/* ✅ MOVE THIS OUTSIDE COMPONENT */
const InputField = ({ label, name, type = "text", required = false, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-3 rounded-lg border"
      required={required}
    />
  </div>
);

export default function Registration() {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...rest } = form;

      await axios.post(`${API_URL}/auth/register`, rest, {
        headers: { "Content-Type": "application/json" },
      });

      alert("Registration successful");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed. Try again.");
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

          <div>
            <label className="block text-sm font-medium mb-1">
              Full Name <span className="text-gray-500">(optional)</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border"
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

          <h2 className="text-lg font-semibold text-[#d4a373] mt-4">
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

          {error && <p className="text-red-500 text-sm">{error}</p>}

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