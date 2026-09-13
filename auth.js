import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { authConfig } from "@/auth.config";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide email and password");
        }

        await connectDB();

        const user = await User.findOne({
          email: credentials.email,
        }).select("+password");

        if (!user) {
          throw new Error("Invalid credentials");
        }

        if (!user.isActive) {
          throw new Error("User account is disabled");
        }

        const isPasswordValid = await user.matchPassword(
          credentials.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
});