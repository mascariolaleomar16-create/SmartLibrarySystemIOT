import React from "react";

export default function Navbar() {
  return (
    <nav className="w-full bg-[#d4a373] py-4 shadow-md">
      <div className="flex items-center justify-center gap-3">
        {/* Logo */}
        <img
          src="BF.ico" // replace with your logo path
          alt="BookFlow Logo"
          className="h-12 w-12 object-contain"
        />

        {/* Name */}
        <h1 className="text-2xl font-bold text-white">
          BookFlow
        </h1>
      </div>
    </nav>
  );
}