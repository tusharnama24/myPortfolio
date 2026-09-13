import connectDB from "@/lib/mongodb";
import Education from "@/models/Education";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  try {
    await connectDB();

    const educations = await Education.find()
      .sort({
        displayOrder: 1,
        createdAt: -1,
      })
      .lean();

    return Response.json({
      success: true,
      educations,
    });
  } catch (error) {
    console.error("Educations GET error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch educations",
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

    const education = await Education.create(body);

    return Response.json(
      {
        success: true,
        education,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Educations POST error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to create education",
      },
      { status: 500 }
    );
  }
}