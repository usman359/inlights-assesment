import React from "react";
import Link from "next/link";

export default function RootPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Welcome to Instagram App</h1>
      <div className="flex space-x-4">
        <Link
          className="px-4 py-2 bg-blue-500 text-white rounded"
          href="/auth/login"
        >
          Login
        </Link>
        <Link
          className="px-4 py-2 bg-green-500 text-white rounded"
          href="/auth/signup"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
