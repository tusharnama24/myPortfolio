"use client";

import { useEffect, useState } from "react";

const emptyForm = {
  name: "",
  category: "Other",
  icon: "",
  proficiency: "Intermediate",
  displayOrder: 0,
  isActive: true,
};

const categories = [
  "Frontend",
  "Backend",
  "Database",
  "Tools",
  "Design",
  "Mobile",
  "Other",
];

const proficiencies = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
];

const inputClass =
  "w-full rounded-lg border border-[#374151] bg-[#0f172a] px-4 py-3 text-white outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500";

const labelClass =
  "mb-2 block text-sm font-medium text-gray-300";

export default function SkillsAdminPage() {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ==========================================
  // FETCH SKILLS
  // ==========================================

  const fetchSkills = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/skills", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to fetch skills"
        );
      }

      setSkills(data.skills || []);
    } catch (error) {
      console.error("Fetch skills error:", error);
      setError(
        error.message || "Unable to load skills."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (event) => {
    const { name, value, type, checked } =
      event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]:
        type === "checkbox" ? checked : value,
    }));
  };

  // ==========================================
  // ADD SKILL
  // ==========================================

  const handleAdd = () => {
    setEditingId(null);

    setForm({
      ...emptyForm,
      displayOrder: skills.length + 1,
    });

    setError("");
    setMessage("");
  };

  // ==========================================
  // EDIT SKILL
  // ==========================================

  const handleEdit = (skill) => {
    setEditingId(skill._id);

    setForm({
      name: skill.name || "",
      category: skill.category || "Other",
      icon: skill.icon || "",
      proficiency:
        skill.proficiency || "Intermediate",
      displayOrder: skill.displayOrder ?? 0,
      isActive: skill.isActive ?? true,
    });

    setError("");
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // CANCEL EDITING
  // ==========================================

  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  };

  // ==========================================
  // ADD / UPDATE SKILL
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (!form.name.trim()) {
        setError("Please enter a skill name.");
        setSaving(false);
        return;
      }

      const skillData = {
        name: form.name.trim(),
        category: form.category,
        icon: form.icon.trim(),
        proficiency: form.proficiency,
        displayOrder: Number(
          form.displayOrder
        ),
        isActive: form.isActive,
      };

      const url = editingId
        ? `/api/skills/${editingId}`
        : "/api/skills";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(skillData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to save skill"
        );
      }

      if (editingId) {
        setSkills((previousSkills) =>
          previousSkills.map((skill) =>
            skill._id === editingId
              ? data.skill
              : skill
          )
        );

        setMessage(
          "Skill updated successfully."
        );
      } else {
        setSkills((previousSkills) => [
          ...previousSkills,
          data.skill,
        ]);

        setMessage(
          "Skill added successfully."
        );
      }

      setForm(emptyForm);
      setEditingId(null);
    } catch (error) {
      console.error("Save skill error:", error);

      setError(
        error.message || "Unable to save skill."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE SKILL
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this skill?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const response = await fetch(
        `/api/skills/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to delete skill"
        );
      }

      setSkills((previousSkills) =>
        previousSkills.filter(
          (skill) => skill._id !== id
        )
      );

      if (editingId === id) {
        handleCancel();
      }

      setMessage(
        "Skill deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete skill error:",
        error
      );

      setError(
        error.message ||
          "Unable to delete skill."
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1224] text-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent"></div>

          <p className="text-gray-400">
            Loading skills...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-[#0d1224] text-white p-6">
      <div className="mx-auto max-w-6xl">

        {/* =====================================
            HEADER
        ====================================== */}

        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

          <div>
            <h1 className="text-3xl font-bold">
              Skills
            </h1>

            <p className="mt-2 text-gray-400">
              Manage the skills displayed on
              your portfolio.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="rounded-lg bg-gradient-to-r from-violet-600 to-pink-500 px-6 py-3 font-medium text-white transition-all duration-300 hover:from-pink-500 hover:to-violet-600 hover:scale-[1.02]"
          >
            + Add Skill
          </button>
        </div>

        {/* =====================================
            MESSAGES
        ====================================== */}

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

        {/* =====================================
            ADD / EDIT FORM
        ====================================== */}

        <div className="mb-8 rounded-xl border border-[#1f2937] bg-[#111827] p-6 md:p-8">

          <div className="mb-7">
            <h2 className="text-xl font-semibold md:text-2xl">
              {editingId
                ? "Edit Skill"
                : "Add New Skill"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {editingId
                ? "Update the selected skill."
                : "Add a new skill to your portfolio."}
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* NAME */}

              <div>
                <label
                  htmlFor="name"
                  className={labelClass}
                >
                  Skill Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. React"
                  className={inputClass}
                />
              </div>

              {/* CATEGORY */}

              <div>
                <label
                  htmlFor="category"
                  className={labelClass}
                >
                  Category
                </label>

                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {categories.map(
                    (category) => (
                      <option
                        key={category}
                        value={category}
                        className="bg-[#0f172a]"
                      >
                        {category}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* PROFICIENCY */}

              <div>
                <label
                  htmlFor="proficiency"
                  className={labelClass}
                >
                  Proficiency
                </label>

                <select
                  id="proficiency"
                  name="proficiency"
                  value={form.proficiency}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {proficiencies.map(
                    (proficiency) => (
                      <option
                        key={proficiency}
                        value={proficiency}
                        className="bg-[#0f172a]"
                      >
                        {proficiency}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* DISPLAY ORDER */}

              <div>
                <label
                  htmlFor="displayOrder"
                  className={labelClass}
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
                  className={inputClass}
                />

                <p className="mt-2 text-xs text-gray-500">
                  Lower numbers appear first.
                </p>
              </div>

              {/* ICON */}

              <div className="md:col-span-2">
                <label
                  htmlFor="icon"
                  className={labelClass}
                >
                  Icon Path
                </label>

                <input
                  id="icon"
                  name="icon"
                  type="text"
                  value={form.icon}
                  onChange={handleChange}
                  placeholder="Optional icon path"
                  className={inputClass}
                />

                <p className="mt-2 text-xs text-gray-500">
                  Leave empty to use the existing
                  skill icon system.
                </p>
              </div>

              {/* ACTIVE */}

              <div className="md:col-span-2">

                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#1f2937] bg-[#0f172a] px-4 py-3 transition hover:border-violet-500/40">

                  <input
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 accent-violet-600"
                  />

                  <div>
                    <p className="text-sm font-medium text-gray-200">
                      Show this skill on the
                      portfolio
                    </p>

                    <p className="text-xs text-gray-500">
                      Disable this if you want to
                      keep the skill but hide it
                      publicly.
                    </p>
                  </div>

                </label>

              </div>

            </div>

            {/* BUTTONS */}

            <div className="mt-7 flex flex-wrap gap-3">

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-gradient-to-r from-violet-600 to-pink-500 px-7 py-3 font-medium text-white transition-all duration-300 hover:from-pink-500 hover:to-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Skill"
                  : "Add Skill"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-lg border border-[#374151] px-7 py-3 font-medium text-gray-300 transition hover:border-violet-500 hover:text-white"
                >
                  Cancel
                </button>
              )}

            </div>

          </form>
        </div>

        {/* =====================================
            SKILLS LIST
        ====================================== */}

        <div className="rounded-xl border border-[#1f2937] bg-[#111827] overflow-hidden">

          {/* LIST HEADER */}

          <div className="border-b border-[#1f2937] p-6">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-xl font-semibold">
                  All Skills
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {skills.length} skill
                  {skills.length !== 1
                    ? "s"
                    : ""}{" "}
                  found
                </p>
              </div>

              <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                {skills.length}
              </div>

            </div>

          </div>

          {/* LIST */}

          {skills.length === 0 ? (
            <div className="p-10 text-center">

              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-violet-500/10 text-2xl text-violet-400">
                +
              </div>

              <h3 className="text-lg font-semibold">
                No skills found
              </h3>

              <p className="mt-2 text-gray-500">
                Add your first skill to your
                portfolio.
              </p>

            </div>
          ) : (
            <div className="divide-y divide-[#1f2937]">

              {skills.map((skill) => (

                <div
                  key={skill._id}
                  className="group flex flex-col gap-5 p-5 transition-all duration-300 hover:bg-[#0f172a] md:flex-row md:items-center md:justify-between"
                >

                  {/* SKILL INFORMATION */}

                  <div className="flex-1">

                    <div className="flex flex-wrap items-center gap-3">

                      <h3 className="text-lg font-semibold text-white">
                        {skill.name}
                      </h3>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${
                          skill.isActive
                            ? "border-green-500/30 bg-green-500/10 text-green-400"
                            : "border-gray-600/30 bg-gray-600/10 text-gray-500"
                        }`}
                      >
                        {skill.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>

                    </div>

                    {/* META */}

                    <div className="mt-3 flex flex-wrap gap-2">

                      <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs text-violet-300">
                        {skill.category}
                      </span>

                      <span className="rounded-full border border-[#374151] bg-[#0f172a] px-3 py-1 text-xs text-gray-300">
                        {skill.proficiency}
                      </span>

                      <span className="rounded-full border border-[#374151] bg-[#0f172a] px-3 py-1 text-xs text-gray-400">
                        Order:{" "}
                        {skill.displayOrder}
                      </span>

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex gap-3">

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(skill)
                      }
                      className="rounded-lg border border-violet-500/40 px-5 py-2.5 text-sm font-medium text-violet-400 transition hover:border-violet-500 hover:bg-violet-500/10"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(skill._id)
                      }
                      className="rounded-lg border border-red-500/40 px-5 py-2.5 text-sm font-medium text-red-400 transition hover:border-red-500 hover:bg-red-500/10"
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