"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  const handleLogin = () => {
    console.log("Login with Instagram");
    signIn("instagram", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <button
        onClick={handleLogin}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Login with Instagram
      </button>
    </div>
  );
}
