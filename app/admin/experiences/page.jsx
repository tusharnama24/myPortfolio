"use client";

import { useEffect, useState } from "react";

const emptyForm = {
  company: "",
  position: "",
  employmentType: "Full-time",
  location: "",
  startDate: "",
  endDate: "",
  currentlyWorking: false,
  description: "",
  technologies: "",
  companyLogo: "",
  displayOrder: 0,
  isActive: true,
};

const employmentTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
];

export default function ExperiencesAdminPage() {
  const [experiences, setExperiences] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch experiences
  const fetchExperiences = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/experiences", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to fetch experiences"
        );
      }

      setExperiences(data.experiences || []);
    } catch (error) {
      console.error("Fetch experiences error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Start adding a new experience
  const handleAdd = () => {
    setEditingId(null);

    setForm({
      ...emptyForm,
      displayOrder: experiences.length + 1,
    });

    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Edit experience
  const handleEdit = (experience) => {
    setEditingId(experience._id);

    setForm({
      company: experience.company || "",
      position: experience.position || "",
      employmentType:
        experience.employmentType || "Full-time",
      location: experience.location || "",

      startDate: experience.startDate
        ? new Date(experience.startDate)
            .toISOString()
            .split("T")[0]
        : "",

      endDate: experience.endDate
        ? new Date(experience.endDate)
            .toISOString()
            .split("T")[0]
        : "",

      currentlyWorking:
        experience.currentlyWorking ?? false,

      description: experience.description || "",

      technologies: Array.isArray(experience.technologies)
        ? experience.technologies.join(", ")
        : "",

      companyLogo: experience.companyLogo || "",

      displayOrder:
        experience.displayOrder ?? 0,

      isActive:
        experience.isActive ?? true,
    });

    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Cancel edit
  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  };

  // Submit Add / Edit
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      if (!form.company.trim()) {
        setError("Please enter company name.");
        setSaving(false);
        return;
      }

      if (!form.position.trim()) {
        setError("Please enter job position.");
        setSaving(false);
        return;
      }

      if (!form.startDate) {
        setError("Please select a start date.");
        setSaving(false);
        return;
      }

      const experienceData = {
        company: form.company.trim(),

        position: form.position.trim(),

        employmentType: form.employmentType,

        location: form.location.trim(),

        startDate: form.startDate,

        endDate:
          form.currentlyWorking || !form.endDate
            ? null
            : form.endDate,

        currentlyWorking: form.currentlyWorking,

        description: form.description.trim(),

        technologies: form.technologies
          .split(",")
          .map((technology) => technology.trim())
          .filter(Boolean),

        companyLogo: form.companyLogo.trim(),

        displayOrder: Number(form.displayOrder),

        isActive: form.isActive,
      };

      const url = editingId
        ? `/api/experiences/${editingId}`
        : "/api/experiences";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(experienceData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to save experience"
        );
      }

      if (editingId) {
        setExperiences((previousExperiences) =>
          previousExperiences.map((experience) =>
            experience._id === editingId
              ? data.experience
              : experience
          )
        );
      } else {
        setExperiences((previousExperiences) => [
          ...previousExperiences,
          data.experience,
        ]);
      }

      setForm(emptyForm);
      setEditingId(null);
    } catch (error) {
      console.error("Save experience error:", error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // Delete experience
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this experience?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `/api/experiences/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to delete experience"
        );
      }

      setExperiences((previousExperiences) =>
        previousExperiences.filter(
          (experience) => experience._id !== id
        )
      );

      if (editingId === id) {
        handleCancel();
      }
    } catch (error) {
      console.error("Delete experience error:", error);
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1224] p-4 text-white sm:p-6">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Experience
            </h1>

            <p className="mt-1 text-gray-400">
              Manage your professional experience.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="rounded-xl bg-gradient-to-r from-pink-500 to-violet-600 px-5 py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/20"
          >
            + Add Experience
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="mb-8 rounded-xl border border-[#1f2937] bg-[#111827] p-6 shadow-xl">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-white">
              {editingId
                ? "Edit Experience"
                : "Add New Experience"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {editingId
                ? "Update the selected experience."
                : "Add a new professional experience."}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* Company */}
              <div>
                <label
                  htmlFor="company"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Company
                </label>

                <input
                  id="company"
                  name="company"
                  type="text"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="e.g. URSS TechService PVT LTD"
                  className="w-full rounded-xl border border-[#374151] bg-[#0f172a] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                />
              </div>

              {/* Position */}
              <div>
                <label
                  htmlFor="position"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Position
                </label>

                <input
                  id="position"
                  name="position"
                  type="text"
                  value={form.position}
                  onChange={handleChange}
                  placeholder="e.g. Data Analyst"
                  className="w-full rounded-xl border border-[#374151] bg-[#0f172a] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                />
              </div>

              {/* Employment Type */}
              <div>
                <label
                  htmlFor="employmentType"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Employment Type
                </label>

                <select
                  id="employmentType"
                  name="employmentType"
                  value={form.employmentType}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#374151] bg-[#0f172a] px-4 py-3 text-white outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                >
                  {employmentTypes.map((type) => (
                    <option
                      key={type}
                      value={type}
                      className="bg-[#0f172a] text-white"
                    >
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label
                  htmlFor="location"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Location
                </label>

                <input
                  id="location"
                  name="location"
                  type="text"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Gurugram, India"
                  className="w-full rounded-xl border border-[#374151] bg-[#0f172a] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                />
              </div>

              {/* Start Date */}
              <div>
                <label
                  htmlFor="startDate"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Start Date
                </label>

                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#374151] bg-[#0f172a] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                />
              </div>

              {/* End Date */}
              <div>
                <label
                  htmlFor="endDate"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  End Date
                </label>

                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={handleChange}
                  disabled={form.currentlyWorking}
                  className="w-full rounded-xl border border-[#374151] bg-[#0f172a] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 disabled:bg-[#0f172a]"
                />
              </div>

              {/* Currently Working */}
              <div className="md:col-span-2">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    name="currentlyWorking"
                    checked={form.currentlyWorking}
                    onChange={handleChange}
                    className="h-5 w-5 accent-violet-600"
                  />

                  <span className="text-sm font-medium text-gray-300">
                    I currently work here
                  </span>
                </label>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows="5"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe your responsibilities, achievements, and work..."
                  className="w-full resize-y rounded-xl border border-[#374151] bg-[#0f172a] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                />
              </div>

              {/* Technologies */}
              <div className="md:col-span-2">
                <label
                  htmlFor="technologies"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Technologies
                </label>

                <input
                  id="technologies"
                  name="technologies"
                  type="text"
                  value={form.technologies}
                  onChange={handleChange}
                  placeholder="React, Node.js, MongoDB, Flutter"
                  className="w-full rounded-xl border border-[#374151] bg-[#0f172a] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Separate technologies with commas.
                </p>
              </div>

              {/* Company Logo */}
              <div className="md:col-span-2">
                <label
                  htmlFor="companyLogo"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Company Logo
                </label>

                <input
                  id="companyLogo"
                  name="companyLogo"
                  type="text"
                  value={form.companyLogo}
                  onChange={handleChange}
                  placeholder="Optional logo URL or path"
                  className="w-full rounded-xl border border-[#374151] bg-[#0f172a] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                />
              </div>

              {/* Display Order */}
              <div>
                <label
                  htmlFor="displayOrder"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Display Order
                </label>

                <input
                  id="displayOrder"
                  name="displayOrder"
                  type="number"
                  min="0"
                  value={form.displayOrder}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#374151] bg-[#0f172a] px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                />
              </div>

              {/* Active */}
              <div className="flex items-end">
                <label className="flex cursor-pointer items-center gap-3 pb-3">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                    className="h-5 w-5 accent-violet-600"
                  />

                  <span className="text-sm font-medium text-gray-300">
                    Show on portfolio
                  </span>
                </label>
              </div>
            </div>

            {/* Form Buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-gradient-to-r from-pink-500 to-violet-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Experience"
                    : "Add Experience"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-xl border border-[#374151] bg-white px-6 py-3 font-medium text-gray-300 transition hover:bg-[#0f172a]"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Experience List */}
        <div className="rounded-xl border border-[#1f2937] bg-[#111827] shadow-xl">
          <div className="border-b border-[#1f2937] p-6">
            <h2 className="text-xl font-semibold text-white">
              All Experiences
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {experiences.length} experience
              {experiences.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {loading ? (
            <div className="p-6 text-center text-gray-500">
              Loading experiences...
            </div>
          ) : experiences.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No experiences found.
            </div>
          ) : (
            <div className="divide-y divide-[#1f2937]">
              {experiences
                .slice()
                .sort(
                  (a, b) =>
                    a.displayOrder - b.displayOrder
                )
                .map((experience) => (
                  <div
                    key={experience._id}
                    className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between"
                  >
                    {/* Information */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-semibold text-white">
                          {experience.position}
                        </h3>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            experience.isActive
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-[#0f172a] text-gray-500"
                          }`}
                        >
                          {experience.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </div>

                      <p className="mt-1 font-medium text-gray-300">
                        {experience.company}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2 text-sm">
                        <span className="rounded-md bg-[#0f172a] px-2 py-1 text-gray-400">
                          {experience.employmentType}
                        </span>

                        {experience.location && (
                          <span className="rounded-md bg-[#0f172a] px-2 py-1 text-gray-400">
                            {experience.location}
                          </span>
                        )}

                        {experience.startDate && (
                          <span className="rounded-md bg-[#0f172a] px-2 py-1 text-gray-400">
                            {new Date(
                              experience.startDate
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              year: "numeric",
                            })}
                            {" - "}
                            {experience.currentlyWorking
                              ? "Present"
                              : experience.endDate
                                ? new Date(
                                    experience.endDate
                                  ).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      year: "numeric",
                                    }
                                  )
                                : "N/A"}
                          </span>
                        )}

                        <span className="rounded-md bg-[#0f172a] px-2 py-1 text-gray-400">
                          Order: {experience.displayOrder}
                        </span>
                      </div>

                      {experience.technologies?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {experience.technologies.map(
                            (technology, index) => (
                              <span
                                key={`${technology}-${index}`}
                                className="rounded-md bg-violet-500/10 px-2 py-1 text-xs text-violet-300"
                              >
                                {technology}
                              </span>
                            )
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(experience)
                        }
                        className="rounded-xl border border-[#374151] px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-[#0f172a]"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(experience._id)
                        }
                        className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                      >
                        Delete
                      </button>
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