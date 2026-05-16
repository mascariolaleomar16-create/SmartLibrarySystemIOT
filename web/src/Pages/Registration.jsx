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
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ADDRESS HELPERS */
  const getAddressParts = (addressString) => {
    return addressString
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
  };

  const isNumeric = (value) => {
    return /^\d+$/.test(value);
  };

  /* SMART PARSER (street/city/state/postal/country) */
  const parseAddress = (addressString) => {
    const parts = getAddressParts(addressString);

    let street = "";
    let city = "";
    let state = "";
    let postalCode = "";
    let country = "";

    if (parts.length === 0) return { street, city, state, postalCode, country };

    street = parts[0] || "";

    country = parts[parts.length - 1] || "";

    const middle = parts.slice(1, -1);

    middle.forEach((item) => {
      if (isNumeric(item)) {
        postalCode = item;
      } else if (!city) {
        city = item;
      } else {
        state = item;
      }
    });

    return {
      street,
      city,
      state,
      postalCode,
      country,
    };
  };

  /* VALIDATION (backend requirement safe) */
  const validateAddress = (addressString) => {
    const parts = getAddressParts(addressString);

    const street = parts[0];
    const country = parts[parts.length - 1];

    const middle = parts.slice(1, -1);
    const hasCity = middle.some((p) => !/^\d+$/.test(p));

    if (!street || !hasCity || !country) {
      showWarning(
        "Please include Street, City, and Country in the address"
      );
      return false;
    }

    return true;
  };

  /* CHECKLIST LOGIC */
  const addressParts = getAddressParts(form.address);

  const addressCheck = {
    street: !!addressParts[0],
    city: !!addressParts[1],
    country: !!addressParts[addressParts.length - 1],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return showWarning("Passwords do not match");
    }

    if (!validateAddress(form.address)) return;

    setLoading(true);

    try {
      const { confirmPassword, address, ...rest } = form;

      await axios.post(
        `${API_URL}/auth/register`,
        {
          ...rest,
          address: parseAddress(address),
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      showSuccess("Registration successful");
      navigate("/login");
    } catch (err) {
      console.error(err);
      showError(
        err.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-10 px-4">
      <div className="w-full max-w-2xl bg-white border border-blue-100 p-8 rounded-3xl shadow-2xl relative overflow-hidden">

        {/* TOP ACCENT */}
        <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>

        {/* HEADER */}
        <h1 className="text-3xl font-extrabold text-center mb-2 text-blue-600">
          BookFlow Register
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

          <InputField
            label="Full Address"
            name="address"
            value={form.address}
            required
            onChange={handleChange}
          />

          <p className="text-xs text-gray-400">
            Format: Street, City, (Optional: State, Postal Code), Country
          </p>

          <p className="text-xs text-gray-500 mt-1">
            Example: 123 Main St, Iloilo City, 5000, Philippines
          </p>

          {/* CHECKLIST */}
          <div className="mt-3 text-sm space-y-1">
            <p className="font-semibold text-gray-700">Required fields:</p>

            <div className="flex items-center gap-2">
              <span className={addressCheck.street ? "text-green-600" : "text-red-500"}>
                {addressCheck.street ? "✔" : "•"}
              </span>
              <span>Street</span>
            </div>

            <div className="flex items-center gap-2">
              <span className={addressCheck.city ? "text-green-600" : "text-red-500"}>
                {addressCheck.city ? "✔" : "•"}
              </span>
              <span>City</span>
            </div>

            <div className="flex items-center gap-2">
              <span className={addressCheck.country ? "text-green-600" : "text-red-500"}>
                {addressCheck.country ? "✔" : "•"}
              </span>
              <span>Country</span>
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