"use client";

import { signIn } from "next-auth/react";
import { FaInstagram } from "react-icons/fa";

export default function LoginPage() {
  const handleLogin = () => {
    signIn("instagram");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Instagram Icon */}
      <FaInstagram className="text-pink-500 text-6xl mb-4" />
      <button
        onClick={handleLogin}
        className="px-4 py-2 bg-blue-500 text-white rounded flex items-center"
      >
        Login with Instagram
      </button>
    </div>
  );
}
