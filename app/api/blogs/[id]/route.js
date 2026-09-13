import { NextResponse } from "next/server";
import mongoose from "mongoose";

import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { requireAdmin } from "@/lib/require-admin";

function isObjectId(value) {
  return mongoose.Types.ObjectId.isValid(value);
}

// ==========================================
// GET SINGLE BLOG
// ==========================================

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = params;

    let blog;

    // If the value is a MongoDB ObjectId,
    // search by _id.
    if (isObjectId(id)) {
      blog = await Blog.findById(id).lean();
    } else {
      // Otherwise search by slug.
      blog = await Blog.findOne({
        slug: id.toLowerCase(),
      }).lean();
    }

    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          message: "Blog not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      blog: {
        ...blog,
        _id: blog._id.toString(),

        publishedAt: blog.publishedAt
          ? blog.publishedAt.toISOString()
          : null,

        createdAt: blog.createdAt
          ? blog.createdAt.toISOString()
          : null,

        updatedAt: blog.updatedAt
          ? blog.updatedAt.toISOString()
          : null,
      },
    });
  } catch (error) {
    console.error("GET blog error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch blog",
      },
      { status: 500 }
    );
  }
}

// ==========================================
// UPDATE BLOG
// ==========================================

export async function PUT(request, { params }) {
  try {
    // Admin authentication
    const { authorized, response } = await requireAdmin();

    if (!authorized) {
      return response;
    }

    await connectDB();

    const { id } = params;
    const body = await request.json();

    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      tags,
      published,
      publishedAt,
      viewCount,
      displayOrder,
      isActive,
    } = body;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!title || !slug || !excerpt || !content) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Title, slug, excerpt and content are required",
        },
        { status: 400 }
      );
    }

    const normalizedSlug = slug
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");

    // ==========================================
    // CHECK DUPLICATE SLUG
    // ==========================================

    const existingBlog = await Blog.findOne({
      slug: normalizedSlug,
      _id: {
        $ne: isObjectId(id) ? id : null,
      },
    });

    if (existingBlog) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A blog with this slug already exists",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // PREPARE UPDATE DATA
    // ==========================================

    const updateData = {
      title: title.trim(),

      slug: normalizedSlug,

      excerpt: excerpt.trim(),

      content: content.trim(),

      featuredImage: featuredImage?.trim() || "",

      tags: Array.isArray(tags)
        ? tags
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [],

      published: Boolean(published),

      publishedAt: published
        ? publishedAt
          ? new Date(publishedAt)
          : new Date()
        : null,

      viewCount: Number(viewCount) || 0,

      displayOrder: Number(displayOrder) || 0,

      isActive: isActive !== false,
    };

    // ==========================================
    // UPDATE BY ID OR SLUG
    // ==========================================

    let updatedBlog;

    if (isObjectId(id)) {
      updatedBlog = await Blog.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      ).lean();
    } else {
      updatedBlog = await Blog.findOneAndUpdate(
        {
          slug: id.toLowerCase(),
        },
        updateData,
        {
          new: true,
          runValidators: true,
        }
      ).lean();
    }

    // ==========================================
    // BLOG NOT FOUND
    // ==========================================

    if (!updatedBlog) {
      return NextResponse.json(
        {
          success: false,
          message: "Blog not found",
        },
        { status: 404 }
      );
    }

    // ==========================================
    // SUCCESS
    // ==========================================

    return NextResponse.json({
      success: true,
      message: "Blog updated successfully",

      blog: {
        ...updatedBlog,

        _id: updatedBlog._id.toString(),

        publishedAt: updatedBlog.publishedAt
          ? updatedBlog.publishedAt.toISOString()
          : null,

        createdAt: updatedBlog.createdAt
          ? updatedBlog.createdAt.toISOString()
          : null,

        updatedAt: updatedBlog.updatedAt
          ? updatedBlog.updatedAt.toISOString()
          : null,
      },
    });
  } catch (error) {
    console.error("PUT blog error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update blog",
      },
      { status: 500 }
    );
  }
}

// ==========================================
// DELETE BLOG
// ==========================================

export async function DELETE(request, { params }) {
  try {
    // Admin authentication
    const { authorized, response } = await requireAdmin();

    if (!authorized) {
      return response;
    }

    await connectDB();

    const { id } = params;

    let deletedBlog;

    // Delete by MongoDB ObjectId
    if (isObjectId(id)) {
      deletedBlog = await Blog.findByIdAndDelete(id);
    } else {
      // Delete by slug
      deletedBlog = await Blog.findOneAndDelete({
        slug: id.toLowerCase(),
      });
    }

    if (!deletedBlog) {
      return NextResponse.json(
        {
          success: false,
          message: "Blog not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("DELETE blog error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete blog",
      },
      { status: 500 }
    );
  }
}