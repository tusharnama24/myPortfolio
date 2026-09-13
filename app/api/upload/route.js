import { NextResponse } from "next/server";

import cloudinary from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/require-admin";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    // ==========================================
    // ADMIN AUTHENTICATION
    // ==========================================

    const { authorized, response } = await requireAdmin();

    if (!authorized) {
      return response;
    }

    // ==========================================
    // GET FILE
    // ==========================================

    const formData = await request.formData();

    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "No file provided",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================
    // VALIDATE FILE TYPE
    // ==========================================

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        {
          success: false,
          message: "Only image files are allowed",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================
    // VALIDATE FILE SIZE
    // ==========================================

    const maxSize = 5 * 1024 * 1024; // 5 MB

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          message: "Image size must be less than 5 MB",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================
    // CONVERT FILE TO BUFFER
    // ==========================================

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    // ==========================================
    // UPLOAD TO CLOUDINARY
    // ==========================================

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "tushar-portfolio",
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        )
        .end(buffer);
    });

    // ==========================================
    // RETURN CLOUDINARY URL
    // ==========================================

    return NextResponse.json({
      success: true,
      message: "Image uploaded successfully",

      image: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
      },
    });
  } catch (error) {
    console.error("Image upload error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error.message || "Failed to upload image",
      },
      {
        status: 500,
      }
    );
  }
}