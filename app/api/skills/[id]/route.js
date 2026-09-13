import connectDB from "@/lib/mongodb";
import Skill from "@/models/Skill";
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
          message: "Invalid skill ID",
        },
        { status: 400 }
      );
    }

    const skill = await Skill.findById(id);

    if (!skill) {
      return Response.json(
        {
          success: false,
          message: "Skill not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      skill,
    });
  } catch (error) {
    console.error("Skill GET error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch skill",
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
          message: "Invalid skill ID",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const skill = await Skill.findByIdAndUpdate(
      id,
      body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!skill) {
      return Response.json(
        {
          success: false,
          message: "Skill not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      skill,
    });
  } catch (error) {
    console.error("Skill PUT error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to update skill",
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
          message: "Invalid skill ID",
        },
        { status: 400 }
      );
    }

    const skill = await Skill.findByIdAndDelete(id);

    if (!skill) {
      return Response.json(
        {
          success: false,
          message: "Skill not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
    console.error("Skill DELETE error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to delete skill",
      },
      { status: 500 }
    );
  }
}