"use client";

import { useEffect, useState } from "react";

const initialForm = {
  institution: "",
  degree: "",
  field: "",
  startDate: "",
  endDate: "",
  currentlyStudying: false,
  description: "",
  logo: "",
  displayOrder: 0,
  isActive: true,
};

export default function EducationAdminPage() {
  const [educations, setEducations] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEducations();
  }, []);

  const fetchEducations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/educations", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to fetch educations"
        );
      }

      setEducations(data.educations || []);
    } catch (err) {
      console.error("Fetch education error:", err);
      setError(err.message || "Failed to load educations");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const payload = {
        ...form,
        displayOrder: Number(form.displayOrder),
        startDate: form.startDate
          ? new Date(form.startDate).toISOString()
          : null,
        endDate:
          form.endDate && !form.currentlyStudying
            ? new Date(form.endDate).toISOString()
            : null,
      };

      const url = editingId
        ? `/api/educations/${editingId}`
        : "/api/educations";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            `Failed to ${editingId ? "update" : "create"} education`
        );
      }

      setMessage(
        editingId
          ? "Education updated successfully."
          : "Education created successfully."
      );

      resetForm();
      await fetchEducations();
    } catch (err) {
      console.error("Save education error:", err);
      setError(err.message || "Failed to save education");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (education) => {
    setEditingId(education._id);

    setForm({
      institution: education.institution || "",
      degree: education.degree || "",
      field: education.field || "",
      startDate: education.startDate
        ? new Date(education.startDate).toISOString().split("T")[0]
        : "",
      endDate: education.endDate
        ? new Date(education.endDate).toISOString().split("T")[0]
        : "",
      currentlyStudying: education.currentlyStudying || false,
      description: education.description || "",
      logo: education.logo || "",
      displayOrder: education.displayOrder ?? 0,
      isActive: education.isActive ?? true,
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this education?"
    );

    if (!confirmed) return;

    try {
      setMessage("");
      setError("");

      const response = await fetch(`/api/educations/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to delete education"
        );
      }

      setMessage("Education deleted successfully.");

      if (editingId === id) {
        resetForm();
      }

      await fetchEducations();
    } catch (err) {
      console.error("Delete education error:", err);
      setError(err.message || "Failed to delete education");
    }
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const getDuration = (education) => {
    const start = formatDate(education.startDate);

    if (education.currentlyStudying) {
      return `${start} - Present`;
    }

    const end = formatDate(education.endDate);

    return `${start} - ${end}`;
  };

  return (
    <div className="min-h-screen bg-[#0d1224] text-white p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Education
          </h1>

          <p className="text-gray-400 mt-2">
            Add and manage your education information.
          </p>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-6 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-400">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="rounded-xl border border-[#1f2937] bg-[#111827] p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {editingId
                ? "Edit Education"
                : "Add Education"}
            </h2>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-sm text-gray-400 hover:text-white"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Institution */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Institution
                </label>

                <input
                  type="text"
                  name="institution"
                  value={form.institution}
                  onChange={handleChange}
                  placeholder="Indian Institute of Information Technology, Kota"
                  required
                  className="w-full rounded-lg border border-[#374151] bg-[#0f172a] px-4 py-3 text-white outline-none focus:border-violet-500"
                />
              </div>

              {/* Degree */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Degree
                </label>

                <input
                  type="text"
                  name="degree"
                  value={form.degree}
                  onChange={handleChange}
                  placeholder="Bachelor Degree"
                  required
                  className="w-full rounded-lg border border-[#374151] bg-[#0f172a] px-4 py-3 text-white outline-none focus:border-violet-500"
                />
              </div>

              {/* Field */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Field of Study
                </label>

                <input
                  type="text"
                  name="field"
                  value={form.field}
                  onChange={handleChange}
                  placeholder="Information Technology"
                  required
                  className="w-full rounded-lg border border-[#374151] bg-[#0f172a] px-4 py-3 text-white outline-none focus:border-violet-500"
                />
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Start Date
                </label>

                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-[#374151] bg-[#0f172a] px-4 py-3 text-white outline-none focus:border-violet-500"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  End Date
                </label>

                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  disabled={form.currentlyStudying}
                  className="w-full rounded-lg border border-[#374151] bg-[#0f172a] px-4 py-3 text-white outline-none focus:border-violet-500 disabled:opacity-50"
                />
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Display Order
                </label>

                <input
                  type="number"
                  name="displayOrder"
                  value={form.displayOrder}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#374151] bg-[#0f172a] px-4 py-3 text-white outline-none focus:border-violet-500"
                />
              </div>

              {/* Logo */}
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-300 mb-2">
                  Logo
                </label>

                <input
                  type="text"
                  name="logo"
                  value={form.logo}
                  onChange={handleChange}
                  placeholder="/image/education.png"
                  className="w-full rounded-lg border border-[#374151] bg-[#0f172a] px-4 py-3 text-white outline-none focus:border-violet-500"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-300 mb-2">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe your education..."
                  className="w-full resize-y rounded-lg border border-[#374151] bg-[#0f172a] px-4 py-3 text-white outline-none focus:border-violet-500"
                />
              </div>

              {/* Currently Studying */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="currentlyStudying"
                  checked={form.currentlyStudying}
                  onChange={handleChange}
                  className="h-4 w-4 accent-violet-600"
                />

                <label className="text-sm text-gray-300">
                  Currently Studying
                </label>
              </div>

              {/* Active */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 accent-violet-600"
                />

                <label className="text-sm text-gray-300">
                  Show on Portfolio
                </label>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-violet-600 px-8 py-3 font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Education"
                  : "Add Education"}
              </button>
            </div>
          </form>
        </div>

        {/* Education List */}
        <div className="rounded-xl border border-[#1f2937] bg-[#111827] p-6">
          <h2 className="text-xl font-semibold mb-6">
            Your Education
          </h2>

          {loading ? (
            <p className="text-gray-400">
              Loading educations...
            </p>
          ) : educations.length === 0 ? (
            <p className="text-gray-500">
              No education records found. Add your first
              education above.
            </p>
          ) : (
            <div className="space-y-4">
              {educations.map((education) => (
                <div
                  key={education._id}
                  className="rounded-lg border border-[#374151] bg-[#0f172a] p-5"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">
                          {education.degree}
                        </h3>

                        {!education.isActive && (
                          <span className="rounded-full bg-red-500/10 px-2 py-1 text-xs text-red-400">
                            Hidden
                          </span>
                        )}
                      </div>

                      <p className="text-gray-300 mt-1">
                        {education.institution}
                      </p>

                      {education.field && (
                        <p className="text-sm text-gray-400 mt-1">
                          {education.field}
                        </p>
                      )}

                      <p className="text-sm text-[#16f2b3] mt-2">
                        {getDuration(education)}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(education)
                        }
                        className="rounded-lg border border-violet-500/40 px-4 py-2 text-sm text-violet-400 transition hover:bg-violet-500/10"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(education._id)
                        }
                        className="rounded-lg border border-red-500/40 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}