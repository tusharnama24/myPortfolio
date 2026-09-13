"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const AdminLogin = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password.");
        return;
      }

      router.push("/admin/projects");
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);
      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0d1224] flex items-center justify-center px-4">

      {/* Background Glow */}

      <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-violet-600/10 blur-3xl" />

      <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-pink-500/10 blur-3xl" />

      {/* Login Card */}

      <div className="relative w-full max-w-md">

        <div className="rounded-2xl border border-[#1f2937] bg-[#111827] p-8 shadow-2xl shadow-black/20">

          {/* Top Gradient Line */}

          <div className="absolute left-0 right-0 top-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-transparent via-pink-500 to-violet-600" />

          {/* Header */}

          <div className="mb-8 text-center">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/20 to-pink-500/20 text-2xl text-violet-400">
              &lt;/&gt;
            </div>

            <h1 className="text-3xl font-bold text-white">
              Admin Login
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Sign in to manage your portfolio
            </p>

          </div>

          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Email */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="Enter your email"
                required
                autoComplete="email"
                className="w-full rounded-lg border border-[#374151] bg-[#0f172a] px-4 py-3 text-white placeholder:text-gray-600 outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
            </div>

            {/* Password */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-[#374151] bg-[#0f172a] px-4 py-3 text-white placeholder:text-gray-600 outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
            </div>

            {/* Error */}

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-violet-600 to-pink-500 py-3 font-semibold text-white transition-all duration-300 hover:from-pink-500 hover:to-violet-600 hover:shadow-lg hover:shadow-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Signing in..."
                : "Sign In"}
            </button>

          </form>

          {/* Footer */}

          <div className="mt-7 border-t border-[#1f2937] pt-5 text-center">
            <p className="text-xs text-gray-600">
              Portfolio Admin Panel
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminLogin;