"use client";

import React from "react";

export default function Loading() {
  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[#a1c4fd] via-[#c2e9fb] to-[#fbc2eb] flex flex-col items-center justify-center">
      {/* Pulsating Circle */}
      <div className="h-16 w-16 bg-white rounded-full animate-pulse"></div>

      {/* Optional: Pulsating Dots Below */}
      <div className="flex space-x-2 mt-6">
        <div className="h-4 w-4 bg-white rounded-full animate-pulse delay-200"></div>
        <div className="h-4 w-4 bg-white rounded-full animate-pulse delay-400"></div>
        <div className="h-4 w-4 bg-white rounded-full animate-pulse delay-600"></div>
      </div>

      <p className="mt-6 text-white text-xl font-medium">Loading, please wait...</p>
    </div>
  );
}
