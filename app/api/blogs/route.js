import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { requireAdmin } from "@/lib/require-admin";

// ==========================================
// GET ALL BLOGS
// ==========================================

export async function GET() {
  try {
    await connectDB();

    const blogs = await Blog.find({})
      .sort({
        displayOrder: 1,
        createdAt: -1,
      })
      .lean();

    return NextResponse.json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.error("Get blogs error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch blogs",
      },
      {
        status: 500,
      }
    );
  }
}

// ==========================================
// CREATE BLOG
// ==========================================

export async function POST(request) {
  try {
    // ==========================================
    // ADMIN AUTHENTICATION
    // ==========================================

    const { authorized, response } = await requireAdmin();

    if (!authorized) {
      return response;
    }

    await connectDB();

    const body = await request.json();

    // ==========================================
    // BASIC VALIDATION
    // ==========================================

    if (!body.title?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Blog title is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!body.slug?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Blog slug is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!body.excerpt?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Blog excerpt is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!body.content?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Blog content is required",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================
    // NORMALIZE DATA
    // ==========================================

    const blogData = {
      title: body.title.trim(),

      slug: body.slug
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-"),

      excerpt: body.excerpt.trim(),

      content: body.content.trim(),

      featuredImage: body.featuredImage?.trim() || "",

      tags: Array.isArray(body.tags)
        ? body.tags
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [],

      published: Boolean(body.published),

      publishedAt: body.publishedAt
        ? new Date(body.publishedAt)
        : body.published
        ? new Date()
        : null,

      viewCount: Number(body.viewCount) || 0,

      displayOrder: Number(body.displayOrder) || 0,

      isActive:
        body.isActive === undefined
          ? true
          : Boolean(body.isActive),
    };

    // ==========================================
    // CHECK DUPLICATE SLUG
    // ==========================================

    const existingBlog = await Blog.findOne({
      slug: blogData.slug,
    });

    if (existingBlog) {
      return NextResponse.json(
        {
          success: false,
          message: "A blog with this slug already exists",
        },
        {
          status: 409,
        }
      );
    }

    // ==========================================
    // CREATE BLOG
    // ==========================================

    const blog = await Blog.create(blogData);

    return NextResponse.json(
      {
        success: true,
        message: "Blog created successfully",
        blog,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Create blog error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create blog",
      },
      {
        status: 500,
      }
    );
  }
}