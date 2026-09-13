"use client";

import { useEffect, useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaTimes,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  featuredImage: "",
  tags: "",
  published: false,
  publishedAt: "",
  viewCount: 0,
  displayOrder: 0,
  isActive: true,
};

export default function BlogsAdminPage() {
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  // ==========================================
  // FETCH BLOGS
  // ==========================================

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/blogs");

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to fetch blogs"
        );
      }

      setBlogs(data.blogs || []);
    } catch (error) {
      console.error("Fetch blogs error:", error);

      setError(
        error.message || "Unable to load blogs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ==========================================
  // ADD BLOG
  // ==========================================

  const handleAdd = () => {
    setEditingId(null);

    setForm({
      ...emptyForm,
      displayOrder: blogs.length + 1,
    });

    setFormError("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // EDIT BLOG
  // ==========================================

  const handleEdit = (blog) => {
    setEditingId(blog._id);

    setForm({
      title: blog.title || "",
      slug: blog.slug || "",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      featuredImage:
        blog.featuredImage || "",

      tags: Array.isArray(blog.tags)
        ? blog.tags.join(", ")
        : "",

      published: blog.published ?? false,

      publishedAt: blog.publishedAt
        ? new Date(blog.publishedAt)
            .toISOString()
            .slice(0, 16)
        : "",

      viewCount: blog.viewCount ?? 0,

      displayOrder:
        blog.displayOrder ?? 0,

      isActive:
        blog.isActive ?? true,
    });

    setFormError("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // CANCEL
  // ==========================================

  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setShowForm(false);
  };

  // ==========================================
  // CREATE / UPDATE BLOG
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setFormError("");

      if (!form.title.trim()) {
        setFormError("Please enter a blog title.");
        return;
      }

      if (!form.slug.trim()) {
        setFormError("Please enter a blog slug.");
        return;
      }

      if (!form.excerpt.trim()) {
        setFormError("Please enter a blog excerpt.");
        return;
      }

      if (!form.content.trim()) {
        setFormError("Please enter blog content.");
        return;
      }

      const blogData = {
        title: form.title.trim(),

        slug: form.slug
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-"),

        excerpt: form.excerpt.trim(),

        content: form.content.trim(),

        featuredImage:
          form.featuredImage.trim(),

        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),

        published: form.published,

        publishedAt:
          form.publishedAt || null,

        viewCount:
          Number(form.viewCount) || 0,

        displayOrder:
          Number(form.displayOrder) || 0,

        isActive: form.isActive,
      };

      const url = editingId
        ? `/api/blogs/${editingId}`
        : "/api/blogs";

      const method = editingId
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to save blog"
        );
      }

      // Update existing blog
      if (editingId) {
        setBlogs((previousBlogs) =>
          previousBlogs.map((blog) =>
            blog._id === editingId
              ? data.blog
              : blog
          )
        );
      }

      // Add new blog
      else {
        setBlogs((previousBlogs) => [
          ...previousBlogs,
          data.blog,
        ]);
      }

      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      console.error(
        "Save blog error:",
        error
      );

      setFormError(
        error.message ||
          "Unable to save blog."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE BLOG
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this blog?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `/api/blogs/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to delete blog"
        );
      }

      setBlogs((previousBlogs) =>
        previousBlogs.filter(
          (blog) => blog._id !== id
        )
      );

      if (editingId === id) {
        handleCancel();
      }
    } catch (error) {
      console.error(
        "Delete blog error:",
        error
      );

      setError(
        error.message ||
          "Unable to delete blog."
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1224] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-gray-700 border-t-violet-500" />

          <p className="text-gray-400">
            Loading blogs...
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
      <div className="mx-auto max-w-7xl">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-3xl font-bold">
              Blogs
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Create and manage your portfolio blogs.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-pink-500 px-5 py-3 font-medium text-white shadow-lg shadow-violet-900/20 transition-all duration-300 hover:scale-[1.02] hover:from-violet-500 hover:to-pink-400"
          >
            <FaPlus size={14} />
            Add Blog
          </button>
        </div>

        {/* ======================================
            ERROR
        ====================================== */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            <div className="flex items-center justify-between gap-4">
              <span>{error}</span>

              <button
                type="button"
                onClick={fetchBlogs}
                className="rounded-md bg-red-500/10 px-3 py-1.5 text-red-400 transition hover:bg-red-500/20"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* ======================================
            ADD / EDIT FORM
        ====================================== */}

        {showForm && (
          <div className="mb-8 overflow-hidden rounded-2xl border border-[#1f2937] bg-[#111827] shadow-xl shadow-black/20">

            {/* Top gradient line */}

            <div className="h-1 bg-gradient-to-r from-violet-600 via-pink-500 to-violet-600" />

            <div className="p-6">

              <div className="mb-6 flex items-center justify-between">

                <div>
                  <h2 className="text-xl font-semibold">
                    {editingId
                      ? "Edit Blog"
                      : "Create New Blog"}
                  </h2>

                  <p className="mt-1 text-sm text-gray-400">
                    {editingId
                      ? "Update your blog information."
                      : "Add a new blog to your portfolio."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-800 hover:text-white"
                >
                  <FaTimes />
                </button>

              </div>

              {/* FORM ERROR */}

              {formError && (
                <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                  {formError}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >

                {/* TITLE + SLUG */}

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Blog Title
                    </label>

                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="Enter blog title"
                      className="w-full rounded-lg border border-[#374151] bg-[#0f172a] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Slug
                    </label>

                    <input
                      type="text"
                      name="slug"
                      value={form.slug}
                      onChange={handleChange}
                      placeholder="my-first-blog"
                      className="w-full rounded-lg border border-[#374151] bg-[#0f172a] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                    />

                    <p className="mt-1 text-xs text-gray-500">
                      Example: my-first-blog
                    </p>
                  </div>

                </div>

                {/* EXCERPT */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Excerpt
                  </label>

                  <textarea
                    name="excerpt"
                    value={form.excerpt}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Short description of your blog..."
                    className="w-full resize-none rounded-lg border border-[#374151] bg-[#0f172a] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                  />
                </div>

                {/* CONTENT */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Blog Content
                  </label>

                  <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    rows={12}
                    placeholder="Write your blog content here..."
                    className="w-full resize-y rounded-lg border border-[#374151] bg-[#0f172a] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                  />

                  <p className="mt-1 text-xs text-gray-500">
                    For now, content is stored as plain text.
                  </p>
                </div>

                {/* FEATURED IMAGE */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Featured Image URL
                  </label>

                  <input
                    type="text"
                    name="featuredImage"
                    value={form.featuredImage}
                    onChange={handleChange}
                    placeholder="/image/blog.jpg or https://..."
                    className="w-full rounded-lg border border-[#374151] bg-[#0f172a] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                  />

                  {form.featuredImage && (
                    <div className="mt-3 overflow-hidden rounded-lg border border-[#1f2937] bg-[#0f172a]">
                      <img
                        src={form.featuredImage}
                        alt="Preview"
                        className="h-48 w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.style.display =
                            "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* TAGS */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Tags
                  </label>

                  <input
                    type="text"
                    name="tags"
                    value={form.tags}
                    onChange={handleChange}
                    placeholder="React, JavaScript, Next.js"
                    className="w-full rounded-lg border border-[#374151] bg-[#0f172a] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                  />

                  <p className="mt-1 text-xs text-gray-500">
                    Separate tags using commas.
                  </p>
                </div>

                {/* SETTINGS */}

                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                  {/* PUBLISHED */}

                  <div className="rounded-lg border border-[#1f2937] bg-[#0f172a] p-4">

                    <label className="flex cursor-pointer items-center gap-3">

                      <input
                        type="checkbox"
                        name="published"
                        checked={form.published}
                        onChange={handleChange}
                        className="h-4 w-4 accent-violet-600"
                      />

                      <div>
                        <p className="text-sm font-medium text-white">
                          Published
                        </p>

                        <p className="text-xs text-gray-500">
                          Make this blog public
                        </p>
                      </div>

                    </label>

                  </div>

                  {/* ACTIVE */}

                  <div className="rounded-lg border border-[#1f2937] bg-[#0f172a] p-4">

                    <label className="flex cursor-pointer items-center gap-3">

                      <input
                        type="checkbox"
                        name="isActive"
                        checked={form.isActive}
                        onChange={handleChange}
                        className="h-4 w-4 accent-violet-600"
                      />

                      <div>
                        <p className="text-sm font-medium text-white">
                          Active
                        </p>

                        <p className="text-xs text-gray-500">
                          Show in portfolio
                        </p>
                      </div>

                    </label>

                  </div>

                  {/* ORDER */}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Display Order
                    </label>

                    <input
                      type="number"
                      name="displayOrder"
                      value={form.displayOrder}
                      onChange={handleChange}
                      min="0"
                      className="w-full rounded-lg border border-[#374151] bg-[#0f172a] px-4 py-3 text-white outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                    />
                  </div>

                </div>

                {/* PUBLISHED DATE + VIEW COUNT */}

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Published Date
                    </label>

                    <input
                      type="datetime-local"
                      name="publishedAt"
                      value={form.publishedAt}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-[#374151] bg-[#0f172a] px-4 py-3 text-white outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      View Count
                    </label>

                    <input
                      type="number"
                      name="viewCount"
                      value={form.viewCount}
                      onChange={handleChange}
                      min="0"
                      className="w-full rounded-lg border border-[#374151] bg-[#0f172a] px-4 py-3 text-white outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                    />
                  </div>

                </div>

                {/* BUTTONS */}

                <div className="flex flex-col gap-3 border-t border-[#1f2937] pt-6 sm:flex-row">

                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-gradient-to-r from-violet-600 to-pink-500 px-6 py-3 font-medium text-white transition-all duration-300 hover:from-violet-500 hover:to-pink-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving
                      ? "Saving..."
                      : editingId
                      ? "Update Blog"
                      : "Create Blog"}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center justify-center gap-2 rounded-lg border border-[#374151] px-6 py-3 font-medium text-gray-300 transition hover:bg-[#1f2937] hover:text-white"
                  >
                    <FaTimes size={13} />
                    Cancel
                  </button>

                </div>

              </form>
            </div>
          </div>
        )}

        {/* ======================================
            BLOG LIST
        ====================================== */}

        <div className="rounded-2xl border border-[#1f2937] bg-[#111827] shadow-xl shadow-black/20">

          <div className="border-b border-[#1f2937] p-6">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-xl font-semibold">
                  Your Blogs
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  {blogs.length}{" "}
                  {blogs.length === 1
                    ? "blog"
                    : "blogs"}{" "}
                  in your database
                </p>
              </div>

            </div>

          </div>

          {blogs.length === 0 ? (
            <div className="p-12 text-center">

              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/10 text-violet-400">
                <FaPlus size={24} />
              </div>

              <h3 className="text-lg font-medium text-white">
                No blogs yet
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Create your first blog to get started.
              </p>

              <button
                type="button"
                onClick={handleAdd}
                className="mt-5 rounded-lg bg-gradient-to-r from-violet-600 to-pink-500 px-5 py-2.5 text-sm font-medium text-white transition hover:from-violet-500 hover:to-pink-400"
              >
                + Create Blog
              </button>

            </div>
          ) : (
            <div className="divide-y divide-[#1f2937]">

              {blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="p-5 transition hover:bg-[#0f172a]"
                >

                  <div className="flex flex-col gap-5 lg:flex-row">

                    {/* IMAGE */}

                    <div className="h-40 w-full shrink-0 overflow-hidden rounded-xl border border-[#1f2937] bg-[#0f172a] sm:h-48 lg:w-64">

                      {blog.featuredImage ? (
                        <img
                          src={blog.featuredImage}
                          alt={blog.title}
                          className="h-full w-full object-cover transition duration-500 hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-gray-600">
                          No image
                        </div>
                      )}

                    </div>

                    {/* CONTENT */}

                    <div className="flex min-w-0 flex-1 flex-col">

                      <div className="flex flex-wrap items-center gap-2">

                        <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-400">
                          #{blog.displayOrder ?? 0}
                        </span>

                        {blog.published ? (
                          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                            Published
                          </span>
                        ) : (
                          <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-400">
                            Draft
                          </span>
                        )}

                        {blog.isActive ? (
                          <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                            <FaEye size={10} />
                            Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 rounded-full bg-gray-500/10 px-3 py-1 text-xs font-medium text-gray-500">
                            <FaEyeSlash size={10} />
                            Hidden
                          </span>
                        )}

                      </div>

                      <h3 className="mt-3 text-xl font-semibold text-white">
                        {blog.title}
                      </h3>

                      <p className="mt-1 text-xs text-violet-400">
                        /{blog.slug}
                      </p>

                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-400">
                        {blog.excerpt}
                      </p>

                      {/* TAGS */}

                      {blog.tags?.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">

                          {blog.tags.map(
                            (tag, index) => (
                              <span
                                key={`${blog._id}-${tag}-${index}`}
                                className="rounded-md border border-[#374151] bg-[#0f172a] px-2.5 py-1 text-xs text-gray-400"
                              >
                                {tag}
                              </span>
                            )
                          )}

                        </div>
                      )}

                      {/* META */}

                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500">

                        <span>
                          Views:{" "}
                          {blog.viewCount ?? 0}
                        </span>

                        {blog.publishedAt && (
                          <span>
                            Published:{" "}
                            {new Date(
                              blog.publishedAt
                            ).toLocaleDateString()}
                          </span>
                        )}

                      </div>

                      {/* ACTIONS */}

                      <div className="mt-5 flex flex-wrap gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(blog)
                          }
                          className="flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-400 transition hover:bg-violet-500/20 hover:text-violet-300"
                        >
                          <FaEdit size={13} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(blog._id)
                          }
                          className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20 hover:text-red-300"
                        >
                          <FaTrash size={13} />
                          Delete
                        </button>

                        {blog.url && (
                          <a
                            href={blog.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-lg border border-[#374151] px-4 py-2 text-sm font-medium text-gray-400 transition hover:bg-[#1f2937] hover:text-white"
                          >
                            View
                          </a>
                        )}

                      </div>

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