import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import About from "@/models/About";
import { requireAdmin } from "@/lib/require-admin";

// ==========================================
// GET ABOUT
// ==========================================

export async function GET() {
  try {
    await connectDB();

    const about = await About.findOne().lean();

    if (!about) {
      return NextResponse.json(
        {
          success: false,
          message: "About information not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      about: {
        ...about,
        _id: about._id.toString(),

        createdAt: about.createdAt
          ? about.createdAt.toISOString()
          : null,

        updatedAt: about.updatedAt
          ? about.updatedAt.toISOString()
          : null,
      },
    });
  } catch (error) {
    console.error("About GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch about information",
      },
      {
        status: 500,
      }
    );
  }
}

// ==========================================
// UPDATE ABOUT
// ==========================================

export async function PUT(request) {
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
    // VALIDATION
    // ==========================================

    if (!body.name?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Name is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!body.title?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Title is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!body.description?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Description is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!body.email?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!body.phone?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!body.location?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Location is required",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================
    // PREPARE DATA
    // ==========================================

    const aboutData = {
      name: body.name.trim(),

      title: body.title.trim(),

      description: body.description.trim(),

      email: body.email.trim(),

      phone: body.phone.trim(),

      location: body.location.trim(),

      profileImage:
        body.profileImage?.trim() || "/profile.jpg",

      resumeUrl: body.resumeUrl?.trim() || "",

      socialLinks: {
        github: body.socialLinks?.github?.trim() || "",

        linkedin:
          body.socialLinks?.linkedin?.trim() || "",

        twitter:
          body.socialLinks?.twitter?.trim() || "",

        facebook:
          body.socialLinks?.facebook?.trim() || "",

        stackOverflow:
          body.socialLinks?.stackOverflow?.trim() || "",

        leetcode:
          body.socialLinks?.leetcode?.trim() || "",

        devUsername:
          body.socialLinks?.devUsername?.trim() || "",
      },
    };

    // ==========================================
    // FIND EXISTING ABOUT
    // ==========================================

    const existingAbout = await About.findOne();

    // ==========================================
    // CREATE IF NOT EXISTS
    // ==========================================

    if (!existingAbout) {
      const about = await About.create(aboutData);

      return NextResponse.json(
        {
          success: true,
          message: "About information created successfully",
          about,
        },
        {
          status: 201,
        }
      );
    }

    // ==========================================
    // UPDATE EXISTING ABOUT
    // ==========================================

    const about = await About.findByIdAndUpdate(
      existingAbout._id,
      aboutData,
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    return NextResponse.json({
      success: true,
      message: "About information updated successfully",

      about: {
        ...about,
        _id: about._id.toString(),

        createdAt: about.createdAt
          ? about.createdAt.toISOString()
          : null,

        updatedAt: about.updatedAt
          ? about.updatedAt.toISOString()
          : null,
      },
    });
  } catch (error) {
    console.error("About PUT error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Failed to update about information",
      },
      {
        status: 500,
      }
    );
  }
}