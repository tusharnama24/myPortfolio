import connectDB from "@/lib/mongodb";
import Education from "@/models/Education";
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
          message: "Invalid education ID",
        },
        { status: 400 }
      );
    }

    const education = await Education.findById(id);

    if (!education) {
      return Response.json(
        {
          success: false,
          message: "Education not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      education,
    });
  } catch (error) {
    console.error("Education GET error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch education",
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
          message: "Invalid education ID",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const education = await Education.findByIdAndUpdate(
      id,
      body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!education) {
      return Response.json(
        {
          success: false,
          message: "Education not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      education,
    });
  } catch (error) {
    console.error("Education PUT error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to update education",
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
          message: "Invalid education ID",
        },
        { status: 400 }
      );
    }

    const education = await Education.findByIdAndDelete(id);

    if (!education) {
      return Response.json(
        {
          success: false,
          message: "Education not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Education deleted successfully",
    });
  } catch (error) {
    console.error("Education DELETE error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to delete education",
      },
      { status: 500 }
    );
  }
}