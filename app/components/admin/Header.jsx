"use client";

import { useEffect, useState } from "react";

export default function Header() {
  const [greeting, setGreeting] = useState("Good Evening");
  const [today, setToday] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const hour = now.getHours();

      const currentGreeting =
        hour < 12
          ? "Good Morning"
          : hour < 18
          ? "Good Afternoon"
          : "Good Evening";

      const currentDate = now.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      setGreeting(currentGreeting);
      setToday(currentDate);
    };

    updateDateTime();
  }, []);

  return (
    <header className="rounded-2xl border border-[#1f2937] bg-[#111827] p-5 sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            {greeting}, Tushar 👋
          </h2>

          <p className="mt-2 text-sm text-gray-400 sm:text-base">
            Welcome back to your portfolio dashboard.
          </p>
        </div>

        <div className="rounded-xl border border-[#1f2937] bg-[#0f172a] px-4 py-3 sm:text-right">
          <p className="text-xs text-gray-500">
            Today&apos;s Date
          </p>

          <p className="mt-1 text-sm font-semibold text-[#16f2b3]">
            {today || "Loading..."}
          </p>
        </div>
      </div>
    </header>
  );
}