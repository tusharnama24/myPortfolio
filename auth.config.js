export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },

  callbacks: {
    async authorized({ auth, request }) {
      const { pathname } = request.nextUrl;

      // Login page should always be accessible
      if (pathname === "/admin/login") {
        return true;
      }

      // Every other /admin route requires an admin
      if (pathname.startsWith("/admin")) {
        return auth?.user?.role === "admin";
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }

      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,
};