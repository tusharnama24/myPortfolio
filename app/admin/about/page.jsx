"use client";

import { useEffect, useState } from "react";
import ImageUpload from "@/app/components/admin/ImageUpload";

const initialForm = {
  name: "",
  title: "",
  description: "",
  email: "",
  phone: "",
  location: "",
  profileImage: "",
  resumeUrl: "",
  socialLinks: {
    github: "",
    linkedin: "",
    twitter: "",
    facebook: "",
    stackOverflow: "",
    leetcode: "",
    devUsername: "",
  },
};

export default function AboutAdminPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // FETCH ABOUT INFORMATION
  // ==========================================

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/about", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to fetch About information"
        );
      }

      const about = data.about;

      setForm({
        name: about.name || "",
        title: about.title || "",
        description: about.description || "",
        email: about.email || "",
        phone: about.phone || "",
        location: about.location || "",
        profileImage: about.profileImage || "",
        resumeUrl: about.resumeUrl || "",

        socialLinks: {
          github:
            about.socialLinks?.github || "",

          linkedin:
            about.socialLinks?.linkedin || "",

          twitter:
            about.socialLinks?.twitter || "",

          facebook:
            about.socialLinks?.facebook || "",

          stackOverflow:
            about.socialLinks?.stackOverflow || "",

          leetcode:
            about.socialLinks?.leetcode || "",

          devUsername:
            about.socialLinks?.devUsername || "",
        },
      });
    } catch (err) {
      console.error("Fetch About error:", err);

      setError(
        err.message ||
          "Failed to load About information"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // HANDLE BASIC INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // HANDLE SOCIAL INPUT CHANGE
  // ==========================================

  const handleSocialChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,

      socialLinks: {
        ...prev.socialLinks,
        [name]: value,
      },
    }));
  };

  // ==========================================
  // HANDLE FORM SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await fetch("/api/about", {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to update About information"
        );
      }

      setMessage(
        "About information updated successfully."
      );

      // Update form with saved database data
      if (data.about) {
        const about = data.about;

        setForm({
          name: about.name || "",
          title: about.title || "",
          description: about.description || "",
          email: about.email || "",
          phone: about.phone || "",
          location: about.location || "",
          profileImage: about.profileImage || "",
          resumeUrl: about.resumeUrl || "",

          socialLinks: {
            github:
              about.socialLinks?.github || "",

            linkedin:
              about.socialLinks?.linkedin || "",

            twitter:
              about.socialLinks?.twitter || "",

            facebook:
              about.socialLinks?.facebook || "",

            stackOverflow:
              about.socialLinks?.stackOverflow || "",

            leetcode:
              about.socialLinks?.leetcode || "",

            devUsername:
              about.socialLinks?.devUsername || "",
          },
        });
      }
    } catch (err) {
      console.error("Update About error:", err);

      setError(
        err.message ||
          "Failed to update About information"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1224] p-6 text-white">
        <div className="mx-auto max-w-5xl">
          <p className="text-gray-400">
            Loading About information...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-[#0d1224] p-6 text-white">
      <div className="mx-auto max-w-5xl">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            About
          </h1>

          <p className="mt-2 text-gray-400">
            Update the information displayed in your
            portfolio.
          </p>
        </div>

        {/* ======================================
            SUCCESS MESSAGE
        ====================================== */}

        {message && (
          <div className="mb-6 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-400">
            {message}
          </div>
        )}

        {/* ======================================
            ERROR MESSAGE
        ====================================== */}

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400">
            {error}
          </div>
        )}

        {/* ======================================
            FORM
        ====================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* ====================================
              BASIC INFORMATION
          ==================================== */}

          <div className="rounded-xl border border-[#1f2937] bg-[#111827] p-6">

            <h2 className="mb-6 text-xl font-semibold">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* Name */}

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="TUSHAR NAMA"
                  required
                  className="w-full rounded-lg border border-[#374151] bg-[#0f172a] px-4 py-3 text-white outline-none focus:border-violet-500"
                />
              </div>

              {/* Title */}

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Title / Designation
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Full Stack Engineer"
                  required
                  className="w-full rounded-lg border border-[#374151] bg-[#0f172a] px-4 py-3 text-white outline-none focus:border-violet-500"
                />
              </div>

              {/* Email */}

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                  className="w-full rounded-lg border border-[#374151] bg-[#0f172a] px-4 py-3 text-white outline-none focus:border-violet-500"
                />
              </div>

              {/* Phone */}

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                  required
                  className="w-full rounded-lg border border-[#374151] bg-[#0f172a] px-4 py-3 text-white outline-none focus:border-violet-500"
                />
              </div>

              {/* Location */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-gray-300">
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Jaipur, Rajasthan, India"
                  required
                  className="w-full rounded-lg border border-[#374151] bg-[#0f172a] px-4 py-3 text-white outline-none focus:border-violet-500"
                />
              </div>

              {/* Description */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-gray-300">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Write your portfolio description..."
                  rows={7}
                  required
                  className="w-full resize-y rounded-lg border border-[#374151] bg-[#0f172a] px-4 py-3 text-white outline-none focus:border-violet-500"
                />
              </div>

            </div>
          </div>

          {/* ====================================
              PROFILE & RESUME
          ==================================== */}

          <div className="rounded-xl border border-[#1f2937] bg-[#111827] p-6">

            <h2 className="mb-6 text-xl font-semibold">
              Profile & Resume
            </h2>

            <div className="space-y-6">

              {/* Profile Image */}

              <ImageUpload
                label="Profile Image"
                value={form.profileImage}
                onChange={(url) =>
                  setForm((prev) => ({
                    ...prev,
                    profileImage: url,
                  }))
                }
              />

              {/* Resume */}

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Resume URL
                </label>

                <input
                  type="url"
                  name="resumeUrl"
                  value={form.resumeUrl}
                  onChange={handleChange}
                  placeholder="https://drive.google.com/..."
                  className="w-full rounded-lg border border-[#374151] bg-[#0f172a] px-4 py-3 text-white outline-none focus:border-violet-500"
                />
              </div>

            </div>
          </div>

          {/* ====================================
              SOCIAL LINKS
          ==================================== */}

          <div className="rounded-xl border border-[#1f2937] bg-[#111827] p-6">

            <h2 className="mb-6 text-xl font-semibold">
              Social Links
            </h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* GitHub */}

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  GitHub
                </label>

                <input
                  type="url"
                  name="github"
                  value={form.socialLinks.github}
                  onChange={handleSocialChange}
                  placeholder="https://github.com/username"
                  className="w-full rounded-lg border border-[#374151] bg-[#0f172a] px-4 py-3 text-white outline-none focus:border-violet-500"
                />
              </div>

              {/* LinkedIn */}

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  LinkedIn
                </label>

                <input
                  type="url"
                  name="linkedin"
                  value={form.socialLinks.linkedin}
                  onChange={handleSocialChange}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full rounded-lg border border-[#374151] bg-[#0f172a] px-4 py-3 text-white outline-none focus:border-violet-500"
                />
              </div>

              {/* Twitter */}

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Twitter / X
                </label>

                <input
                  type="url"
                  name="twitter"
                  value={form.socialLinks.twitter}
                  onChange={handleSocialChange}
                  placeholder="https://twitter.com/username"
                  className="w-full rounded-lg border border-[#374151] bg-[#0f172a] px-4 py-3 text-white outline-none focus:border-violet-500"
                />
              </div>

              {/* Facebook */}

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Facebook
                </label>

                <input
                  type="url"
                  name="facebook"
                  value={form.socialLinks.facebook}
                  onChange={handleSocialChange}
                  placeholder="https://facebook.com/username"
                  className="w-full rounded-lg border border-[#374151] bg-[#0f172a] px-4 py-3 text-white outline-none focus:border-violet-500"
                />
              </div>

              {/* Stack Overflow */}

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Stack Overflow
                </label>

                <input
                  type="url"
                  name="stackOverflow"
                  value={form.socialLinks.stackOverflow}
                  onChange={handleSocialChange}
                  placeholder="https://stackoverflow.com/users/..."
                  className="w-full rounded-lg border border-[#374151] bg-[#0f172a] px-4 py-3 text-white outline-none focus:border-violet-500"
                />
              </div>

              {/* LeetCode */}

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  LeetCode
                </label>

                <input
                  type="url"
                  name="leetcode"
                  value={form.socialLinks.leetcode}
                  onChange={handleSocialChange}
                  placeholder="https://leetcode.com/username"
                  className="w-full rounded-lg border border-[#374151] bg-[#0f172a] px-4 py-3 text-white outline-none focus:border-violet-500"
                />
              </div>

              {/* Dev Username */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-gray-300">
                  Dev Username
                </label>

                <input
                  type="text"
                  name="devUsername"
                  value={form.socialLinks.devUsername}
                  onChange={handleSocialChange}
                  placeholder="tusharnama24"
                  className="w-full rounded-lg border border-[#374151] bg-[#0f172a] px-4 py-3 text-white outline-none focus:border-violet-500"
                />
              </div>

            </div>
          </div>

          {/* ====================================
              SAVE BUTTON
          ==================================== */}

          <div className="flex justify-end pb-10">

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-violet-600 px-8 py-3 font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Updating..."
                : "Update About"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}