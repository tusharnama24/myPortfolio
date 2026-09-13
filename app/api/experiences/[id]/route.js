import connectDB from "@/lib/mongodb";
import Experience from "@/models/Experience";
import { requireAdmin } from "@/lib/require-admin";
import mongoose from "mongoose";

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        {
          success: false,
          message: "Invalid experience ID",
        },
        { status: 400 }
      );
    }

    const experience = await Experience.findById(id);

    if (!experience) {
      return Response.json(
        {
          success: false,
          message: "Experience not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      experience,
    });
  } catch (error) {
    console.error("Experience GET error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch experience",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { authorized, response } = await requireAdmin();

    if (!authorized) {
      return response;
    }

    await connectDB();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        {
          success: false,
          message: "Invalid experience ID",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const experience = await Experience.findByIdAndUpdate(
      id,
      body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!experience) {
      return Response.json(
        {
          success: false,
          message: "Experience not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      experience,
    });
  } catch (error) {
    console.error("Experience PUT error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to update experience",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { authorized, response } = await requireAdmin();

    if (!authorized) {
      return response;
    }

    await connectDB();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json(
        {
          success: false,
          message: "Invalid experience ID",
        },
        { status: 400 }
      );
    }

    const experience = await Experience.findByIdAndDelete(id);

    if (!experience) {
      return Response.json(
        {
          success: false,
          message: "Experience not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Experience deleted successfully",
    });
  } catch (error) {
    console.error("Experience DELETE error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to delete experience",
      },
      { status: 500 }
    );
  }
}