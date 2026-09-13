import connectDB from "@/lib/mongodb";
import Experience from "@/models/Experience";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  try {
    await connectDB();

    const experiences = await Experience.find()
      .sort({
        displayOrder: 1,
        createdAt: -1,
      })
      .lean();

    return Response.json({
      success: true,
      experiences,
    });
  } catch (error) {
    console.error("Experiences GET error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch experiences",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { authorized, response } = await requireAdmin();

    if (!authorized) {
      return response;
    }

    await connectDB();

    const body = await request.json();

    const experience = await Experience.create(body);

    return Response.json(
      {
        success: true,
        experience,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Experiences POST error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to create experience",
      },
      { status: 500 }
    );
  }
}