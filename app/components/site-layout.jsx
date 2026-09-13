"use client";

import { usePathname } from "next/navigation";

import Footer from "./footer";
import Navbar from "./navbar";
import ScrollToTop from "./helper/scroll-to-top";

export default function SiteLayout({ children }) {
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");

  // Admin pages have their own layout
  if (isAdmin) {
    return children;
  }

  // Public portfolio layout
  return (
    <>
      <main className="min-h-screen relative mx-auto px-6 sm:px-12 lg:max-w-[70rem] xl:max-w-[76rem] 2xl:max-w-[92rem] text-white">
        <Navbar />
        {children}
        <ScrollToTop />
      </main>

      <Footer />
    </>
  );
}