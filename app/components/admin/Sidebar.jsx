"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";

import {
  FaTachometerAlt,
  FaUser,
  FaBriefcase,
  FaGraduationCap,
  FaCode,
  FaFolderOpen,
  FaBook,
  FaEnvelope,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const menuItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: FaTachometerAlt,
  },
  {
    name: "About",
    href: "/admin/about",
    icon: FaUser,
  },
  {
    name: "Experience",
    href: "/admin/experiences",
    icon: FaBriefcase,
  },
  {
    name: "Education",
    href: "/admin/educations",
    icon: FaGraduationCap,
  },
  {
    name: "Skills",
    href: "/admin/skills",
    icon: FaCode,
  },
  {
    name: "Projects",
    href: "/admin/projects",
    icon: FaFolderOpen,
  },
  {
    name: "Blogs",
    href: "/admin/blogs",
    icon: FaBook,
  },
  {
    name: "Messages",
    href: "/admin/messages",
    icon: FaEnvelope,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActive = (href) => {
    return (
      pathname === href ||
      (href !== "/admin" && pathname.startsWith(`${href}/`))
    );
  };

  const handleNavigation = () => {
    setIsMobileOpen(false);
  };

  const handleLogout = () => {
    signOut({
      callbackUrl: "/admin/login",
    });
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between border-b border-[#1f2937] bg-[#090d1f]/95 px-4 py-4 backdrop-blur-md lg:hidden">
        <div>
          <h1 className="text-lg font-bold text-[#16f2b3]">
            TUSHAR NAMA
          </h1>

          <p className="text-xs text-gray-500">
            Portfolio Admin
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          className="rounded-xl border border-[#374151] bg-[#111827] p-3 text-gray-300 transition hover:border-violet-500 hover:text-[#16f2b3]"
          aria-label="Open admin menu"
        >
          <FaBars size={20} />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden min-h-screen w-64 shrink-0 border-r border-[#1f2937] bg-[#090d1f] lg:flex lg:flex-col">
        {/* Logo */}
        <div className="border-b border-[#1f2937] p-6">
          <h1 className="text-2xl font-bold text-[#16f2b3]">
            TUSHAR NAMA
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Portfolio Admin
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 ${
                  isActive(item.href)
                    ? "bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-lg shadow-violet-900/20"
                    : "text-gray-400 hover:bg-[#121933] hover:text-[#16f2b3]"
                }`}
              >
                <Icon size={18} />

                <span className="text-sm font-medium">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-[#1f2937] p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400 transition-all duration-300 hover:bg-red-500 hover:text-white"
          >
            <FaSignOutAlt size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed bottom-0 left-0 top-0 z-[60] flex w-72 flex-col border-r border-[#1f2937] bg-[#090d1f] transition-transform duration-300 lg:hidden ${
          isMobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* Mobile Sidebar Header */}
        <div className="flex items-center justify-between border-b border-[#1f2937] p-5">
          <div>
            <h1 className="text-xl font-bold text-[#16f2b3]">
              TUSHAR NAMA
            </h1>

            <p className="mt-1 text-xs text-gray-500">
              Portfolio Admin
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-[#121933] hover:text-white"
            aria-label="Close admin menu"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleNavigation}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 ${
                  isActive(item.href)
                    ? "bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-lg shadow-violet-900/20"
                    : "text-gray-400 hover:bg-[#121933] hover:text-[#16f2b3]"
                }`}
              >
                <Icon size={18} />

                <span className="text-sm font-medium">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Logout */}
        <div className="border-t border-[#1f2937] p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400 transition-all duration-300 hover:bg-red-500 hover:text-white"
          >
            <FaSignOutAlt size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}