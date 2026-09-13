import { NextResponse } from "next/server";
import mongoose from "mongoose";

import connectDB from "@/lib/mongodb";
import ContactMessage from "@/models/ContactMessage";
import { requireAdmin } from "@/lib/require-admin";

// ==========================================
// GET SINGLE MESSAGE
// ADMIN ONLY
// ==========================================

export async function GET(request, { params }) {
  try {
    const { authorized, response } = await requireAdmin();

    if (!authorized) {
      return response;
    }

    await connectDB();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid message ID",
        },
        {
          status: 400,
        }
      );
    }

    const message = await ContactMessage.findById(id).lean();

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          message: "Message not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,

      message: {
        ...message,
        _id: message._id.toString(),

        createdAt: message.createdAt
          ? message.createdAt.toISOString()
          : null,

        updatedAt: message.updatedAt
          ? message.updatedAt.toISOString()
          : null,
      },
    });
  } catch (error) {
    console.error("Contact GET by ID error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch message",
      },
      {
        status: 500,
      }
    );
  }
}

// ==========================================
// UPDATE MESSAGE
// ADMIN ONLY
// ==========================================

export async function PUT(request, { params }) {
  try {
    const { authorized, response } = await requireAdmin();

    if (!authorized) {
      return response;
    }

    await connectDB();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid message ID",
        },
        {
          status: 400,
        }
      );
    }

    const body = await request.json();

    const updateData = {};

    if (body.name !== undefined) {
      updateData.name = body.name.trim();
    }

    if (body.email !== undefined) {
      updateData.email = body.email
        .trim()
        .toLowerCase();
    }

    if (body.subject !== undefined) {
      updateData.subject =
        body.subject?.trim() || "";
    }

    if (body.message !== undefined) {
      updateData.message =
        body.message.trim();
    }

    if (body.status !== undefined) {
      const allowedStatuses = [
        "new",
        "read",
        "replied",
        "archived",
      ];

      if (!allowedStatuses.includes(body.status)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid message status",
          },
          {
            status: 400,
          }
        );
      }

      updateData.status = body.status;
    }

    if (body.isSpam !== undefined) {
      updateData.isSpam = Boolean(body.isSpam);
    }

    const message =
      await ContactMessage.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      ).lean();

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          message: "Message not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Message updated successfully",

      contactMessage: {
        ...message,
        _id: message._id.toString(),

        createdAt: message.createdAt
          ? message.createdAt.toISOString()
          : null,

        updatedAt: message.updatedAt
          ? message.updatedAt.toISOString()
          : null,
      },
    });
  } catch (error) {
    console.error("Contact PUT error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update message",
      },
      {
        status: 500,
      }
    );
  }
}

// ==========================================
// DELETE MESSAGE
// ADMIN ONLY
// ==========================================

export async function DELETE(request, { params }) {
  try {
    const { authorized, response } = await requireAdmin();

    if (!authorized) {
      return response;
    }

    await connectDB();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid message ID",
        },
        {
          status: 400,
        }
      );
    }

    const message =
      await ContactMessage.findByIdAndDelete(id);

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          message: "Message not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Contact DELETE error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete message",
      },
      {
        status: 500,
      }
    );
  }
}