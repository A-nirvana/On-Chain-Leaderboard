"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[#a1c4fd] via-[#c2e9fb] to-[#fbc2eb] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-white drop-shadow-lg">404</h1>
      <p className="mt-2 text-2xl text-white font-medium">Oops! Page not found.</p>
      <p className="mt-2 text-white text-sm max-w-md">
        The page you are looking for doesn’t exist or has been moved. Maybe try heading back?
      </p>
      <button
        onClick={() => router.push("/")}
        className="mt-6 px-6 py-2 bg-white text-blue-500 rounded-full shadow hover:bg-blue-100 transition"
      >
        Go Home
      </button>
    </div>
  );
}
