import connectDB from "@/lib/mongodb";
import Skill from "@/models/Skill";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  try {
    await connectDB();

    const skills = await Skill.find()
      .sort({
        displayOrder: 1,
        createdAt: -1,
      })
      .lean();

    return Response.json({
      success: true,
      skills,
    });
  } catch (error) {
    console.error("Skills GET error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch skills",
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

    const skill = await Skill.create(body);

    return Response.json(
      {
        success: true,
        skill,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Skills POST error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to create skill",
      },
      { status: 500 }
    );
  }
}