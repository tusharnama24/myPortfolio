"use client";

import { useEffect, useState } from "react";

const emptyForm = {
  title: "",
  slug: "",
  description: "",
  shortDescription: "",
  image: "",
  technologies: "",
  githubUrl: "",
  liveUrl: "",
  featured: false,
  category: "Web",
  displayOrder: 0,
  role: "",
};

const inputClass =
  "w-full rounded-lg border border-[#374151] bg-[#0f172a] px-4 py-3 text-white outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500";

const labelClass = "block text-sm text-gray-300 mb-2";

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [message, setMessage] = useState("");

  // ==========================================
  // GET ALL PROJECTS
  // ==========================================

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/projects", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch projects");
      }

      setProjects(data.projects || []);
    } catch (error) {
      console.error("Fetch projects error:", error);
      setError("Unable to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ==========================================
  // OPEN ADD FORM
  // ==========================================

  const handleAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setMessage("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // OPEN EDIT FORM
  // ==========================================

  const handleEdit = (project) => {
    setEditingId(project._id);

    setForm({
      title: project.title || "",
      slug: project.slug || "",
      description: project.description || "",
      shortDescription: project.shortDescription || "",
      image: project.image || "",
      technologies: project.technologies?.join(", ") || "",
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      featured: project.featured || false,
      category: project.category || "Web",
      displayOrder: project.displayOrder ?? 0,
      role: project.role || "",
    });

    setFormError("");
    setMessage("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // CLOSE FORM
  // ==========================================

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
  };

  // ==========================================
  // CREATE / UPDATE PROJECT
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setFormError("");
    setMessage("");

    try {
      const projectData = {
        ...form,

        technologies: form.technologies
          .split(",")
          .map((technology) => technology.trim())
          .filter(Boolean),

        displayOrder: Number(form.displayOrder),
      };

      const url = editingId
        ? `/api/projects/${editingId}`
        : "/api/projects";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to save project"
        );
      }

      if (editingId) {
        setProjects((currentProjects) =>
          currentProjects.map((project) =>
            project._id === editingId
              ? data.project
              : project
          )
        );

        setMessage("Project updated successfully.");
      } else {
        setProjects((currentProjects) => [
          ...currentProjects,
          data.project,
        ]);

        setMessage("Project created successfully.");
      }

      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      console.error("Save project error:", error);

      setFormError(
        error.message || "Unable to save project."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE PROJECT
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");

      const response = await fetch(
        `/api/projects/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to delete project"
        );
      }

      setProjects((currentProjects) =>
        currentProjects.filter(
          (project) => project._id !== id
        )
      );

      setMessage("Project deleted successfully.");
    } catch (error) {
      console.error("Delete project error:", error);

      setMessage("");
      setFormError(
        error.message || "Unable to delete project."
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
            Loading projects...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="min-h-screen bg-[#0d1224] text-white flex items-center justify-center p-6">
        <div className="rounded-xl border border-red-500/30 bg-[#111827] p-8 text-center">
          <p className="text-red-400 mb-5">
            {error}
          </p>

          <button
            onClick={fetchProjects}
            className="rounded-lg bg-violet-600 px-6 py-3 text-white transition hover:bg-violet-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-[#0d1224] text-white p-6">
      <div className="max-w-6xl mx-auto">

        {/* =====================================
            HEADER
        ====================================== */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

          <div>
            <h1 className="text-3xl font-bold">
              Projects
            </h1>

            <p className="text-gray-400 mt-2">
              Manage your portfolio projects.
            </p>
          </div>

          <button
            onClick={handleAdd}
            className="rounded-lg bg-gradient-to-r from-violet-600 to-pink-500 px-6 py-3 font-medium text-white transition-all duration-300 hover:from-pink-500 hover:to-violet-600 hover:scale-[1.02]"
          >
            + Add Project
          </button>
        </div>

        {/* SUCCESS MESSAGE */}

        {message && (
          <div className="mb-6 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-green-400">
            {message}
          </div>
        )}

        {/* ERROR MESSAGE */}

        {formError && !showForm && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400">
            {formError}
          </div>
        )}

        {/* =====================================
            ADD / EDIT FORM
        ====================================== */}

        {showForm && (
          <div className="mb-8 rounded-xl border border-[#1f2937] bg-[#111827] p-6 md:p-8">

            <div className="flex items-center justify-between mb-7">
              <div>
                <h2 className="text-xl md:text-2xl font-semibold">
                  {editingId
                    ? "Edit Project"
                    : "Add New Project"}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Fill in the project information below.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCancel}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#374151] text-gray-400 transition hover:border-red-500/50 hover:text-red-400"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* TITLE + SLUG */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>
                  <label className={labelClass}>
                    Project Title *
                  </label>

                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="E-commerce Website"
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Slug *
                  </label>

                  <input
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="e-commerce-website"
                    required
                    className={inputClass}
                  />

                  <p className="text-xs text-gray-500 mt-2">
                    Example: my-awesome-project
                  </p>
                </div>

              </div>

              {/* SHORT DESCRIPTION */}

              <div>
                <label className={labelClass}>
                  Short Description
                </label>

                <input
                  name="shortDescription"
                  value={form.shortDescription}
                  onChange={handleChange}
                  placeholder="A modern e-commerce platform"
                  className={inputClass}
                />
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className={labelClass}>
                  Description *
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe your project..."
                  rows={7}
                  required
                  className={`${inputClass} resize-y`}
                />
              </div>

              {/* TECHNOLOGIES */}

              <div>
                <label className={labelClass}>
                  Technologies
                </label>

                <input
                  name="technologies"
                  value={form.technologies}
                  onChange={handleChange}
                  placeholder="React, Next.js, Node.js, MongoDB"
                  className={inputClass}
                />

                <p className="text-xs text-gray-500 mt-2">
                  Separate technologies using commas.
                </p>
              </div>

              {/* IMAGE */}

              <div>
                <label className={labelClass}>
                  Image Path
                </label>

                <input
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="/image/project.jpg"
                  className={inputClass}
                />

                <p className="text-xs text-gray-500 mt-2">
                  Example: /image/crefin.jpg
                </p>
              </div>

              {/* GITHUB + LIVE */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>
                  <label className={labelClass}>
                    GitHub URL
                  </label>

                  <input
                    name="githubUrl"
                    type="url"
                    value={form.githubUrl}
                    onChange={handleChange}
                    placeholder="https://github.com/username/project"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Live URL
                  </label>

                  <input
                    name="liveUrl"
                    type="url"
                    value={form.liveUrl}
                    onChange={handleChange}
                    placeholder="https://myproject.com"
                    className={inputClass}
                  />
                </div>

              </div>

              {/* CATEGORY + ROLE + ORDER */}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                <div>
                  <label className={labelClass}>
                    Category
                  </label>

                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="Web">Web</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Desktop">Desktop</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>
                    Role
                  </label>

                  <input
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    placeholder="Full Stack Developer"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Display Order
                  </label>

                  <input
                    name="displayOrder"
                    type="number"
                    value={form.displayOrder}
                    onChange={handleChange}
                    className={inputClass}
                  />

                  <p className="text-xs text-gray-500 mt-2">
                    Lower numbers appear first.
                  </p>
                </div>

              </div>

              {/* FEATURED */}

              <div className="flex items-center gap-3 rounded-lg border border-[#1f2937] bg-[#0f172a] px-4 py-3">
                <input
                  name="featured"
                  type="checkbox"
                  checked={form.featured}
                  onChange={handleChange}
                  className="h-4 w-4 accent-violet-600"
                />

                <label className="text-sm text-gray-300">
                  Featured Project
                </label>
              </div>

              {/* FORM ERROR */}

              {formError && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400">
                  {formError}
                </div>
              )}

              {/* BUTTONS */}

              <div className="flex flex-wrap gap-3 pt-2">

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-gradient-to-r from-violet-600 to-pink-500 px-7 py-3 font-medium text-white transition-all duration-300 hover:from-pink-500 hover:to-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Project"
                    : "Save Project"}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-lg border border-[#374151] px-7 py-3 text-gray-300 transition hover:border-violet-500 hover:text-white"
                >
                  Cancel
                </button>

              </div>

            </form>
          </div>
        )}

        {/* =====================================
            PROJECT LIST
        ====================================== */}

        <div className="space-y-5">

          {projects.map((project) => (
            <div
              key={project._id}
              className="group rounded-xl border border-[#1f2937] bg-[#111827] p-6 transition-all duration-300 hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/5"
            >

              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

                {/* PROJECT INFO */}

                <div className="flex-1 min-w-0">

                  <div className="flex flex-wrap items-center gap-3">

                    <h2 className="text-xl font-semibold text-white">
                      {project.title}
                    </h2>

                    {project.featured && (
                      <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-400">
                        Featured
                      </span>
                    )}

                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-2">

                    {project.role && (
                      <p className="text-sm text-gray-400">
                        {project.role}
                      </p>
                    )}

                    {project.category && (
                      <>
                        <span className="text-gray-700">
                          •
                        </span>

                        <p className="text-sm text-violet-400">
                          {project.category}
                        </p>
                      </>
                    )}

                  </div>

                  {project.shortDescription && (
                    <p className="text-gray-300 mt-4 leading-relaxed">
                      {project.shortDescription}
                    </p>
                  )}

                  {/* TECHNOLOGIES */}

                  {project.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-5">

                      {project.technologies.map(
                        (technology, index) => (
                          <span
                            key={`${technology}-${index}`}
                            className="rounded-full border border-[#374151] bg-[#0f172a] px-3 py-1 text-xs text-gray-300 transition hover:border-violet-500/50 hover:text-violet-300"
                          >
                            {technology}
                          </span>
                        )
                      )}

                    </div>
                  )}

                  {/* LINKS */}

                  <div className="flex flex-wrap gap-4 mt-5">

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-400 transition hover:text-white"
                      >
                        GitHub ↗
                      </a>
                    )}

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-400 transition hover:text-violet-400"
                      >
                        Live Demo ↗
                      </a>
                    )}

                  </div>

                </div>

                {/* ACTION BUTTONS */}

                <div className="flex gap-3 lg:pt-1">

                  <button
                    onClick={() =>
                      handleEdit(project)
                    }
                    className="rounded-lg border border-violet-500/40 px-5 py-2.5 text-sm text-violet-400 transition hover:bg-violet-500/10 hover:border-violet-500"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(project._id)
                    }
                    className="rounded-lg border border-red-500/40 px-5 py-2.5 text-sm text-red-400 transition hover:bg-red-500/10 hover:border-red-500"
                  >
                    Delete
                  </button>

                </div>

              </div>
            </div>
          ))}

          {/* NO PROJECTS */}

          {projects.length === 0 && (
            <div className="rounded-xl border border-dashed border-[#374151] bg-[#111827] p-10 text-center">

              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-violet-500/10 text-2xl text-violet-400">
                +
              </div>

              <h3 className="text-lg font-semibold text-white">
                No projects found
              </h3>

              <p className="text-gray-500 mt-2">
                Add your first portfolio project.
              </p>

              <button
                onClick={handleAdd}
                className="mt-5 rounded-lg bg-violet-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-violet-700"
              >
                + Add Your First Project
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminProjects;