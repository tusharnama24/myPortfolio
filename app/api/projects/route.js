import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  try {
    await connectDB();

    const projects = await Project.find()
      .sort({
        displayOrder: 1,
        createdAt: -1,
      })
      .lean();

    return Response.json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error("Projects GET error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch projects",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Check admin authentication
    const { authorized, response } = await requireAdmin();

    if (!authorized) {
      return response;
    }

    await connectDB();

    const body = await request.json();

    const project = await Project.create(body);

    return Response.json(
      {
        success: true,
        project,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Projects POST error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to create project",
      },
      { status: 500 }
    );
  }
}