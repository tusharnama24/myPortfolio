"use client";

import { usePathname } from "next/navigation";

import Sidebar from "@/app/components/admin/Sidebar";
import Header from "@/app/components/admin/Header";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#050816] text-white">
      <Sidebar />

      <main className="min-w-0 flex-1 overflow-y-auto px-4 pb-6 pt-20 sm:px-6 sm:pb-6 sm:pt-20 lg:p-8">
        <Header />

        <div className="mt-6 lg:mt-8">
          {children}
        </div>
      </main>
    </div>
  );
}