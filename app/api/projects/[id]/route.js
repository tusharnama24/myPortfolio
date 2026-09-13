import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
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
          message: "Invalid project ID",
        },
        { status: 400 }
      );
    }

    const project = await Project.findById(id);

    if (!project) {
      return Response.json(
        {
          success: false,
          message: "Project not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("Project GET error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch project",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    // Check admin authentication
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
          message: "Invalid project ID",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const project = await Project.findByIdAndUpdate(
      id,
      body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!project) {
      return Response.json(
        {
          success: false,
          message: "Project not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("Project PUT error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to update project",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    // Check admin authentication
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
          message: "Invalid project ID",
        },
        { status: 400 }
      );
    }

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return Response.json(
        {
          success: false,
          message: "Project not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Project DELETE error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to delete project",
      },
      { status: 500 }
    );
  }
}