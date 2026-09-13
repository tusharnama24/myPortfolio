import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import ContactMessage from "@/models/ContactMessage";
import { requireAdmin } from "@/lib/require-admin";

// ==========================================
// GET ALL CONTACT MESSAGES
// ==========================================

export async function GET() {
  try {
    const { authorized, response } = await requireAdmin();

    if (!authorized) {
      return response;
    }

    await connectDB();

    const messages = await ContactMessage.find({})
      .sort({
        createdAt: -1,
      })
      .lean();

    return NextResponse.json({
      success: true,
      messages: messages.map((message) => ({
        ...message,
        _id: message._id.toString(),

        createdAt: message.createdAt
          ? message.createdAt.toISOString()
          : null,

        updatedAt: message.updatedAt
          ? message.updatedAt.toISOString()
          : null,
      })),
    });
  } catch (error) {
    console.error("Contact GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch messages",
      },
      {
        status: 500,
      }
    );
  }
}

// ==========================================
// CREATE CONTACT MESSAGE
// PUBLIC
// ==========================================

export async function POST(request) {
  try {
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

    if (!body.message?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Message is required",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================
    // CREATE MESSAGE
    // ==========================================

    const contactMessage = await ContactMessage.create({
      name: body.name.trim(),

      email: body.email.trim().toLowerCase(),

      subject: body.subject?.trim() || "",

      message: body.message.trim(),

      status: "new",

      isSpam: false,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully",

        contactMessage: {
          ...contactMessage.toObject(),
          _id: contactMessage._id.toString(),
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Contact POST error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Failed to send message",
      },
      {
        status: 500,
      }
    );
  }
}