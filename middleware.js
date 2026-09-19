import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((request) => {
  const { pathname } = request.nextUrl;
  const user = request.auth?.user;

  // Allow the login page
  if (pathname === "/admin/login") {
    if (user?.role === "admin") {
      return Response.redirect(
        new URL("/admin", request.url)
      );
    }

    return;
  }

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!user) {
      return Response.redirect(
        new URL("/admin/login", request.url)
      );
    }

    if (user.role !== "admin") {
      return Response.redirect(
        new URL("/", request.url)
      );
    }
  }

  return;
});

export const config = {
  matcher: ["/admin/:path*"],
};