import { auth } from "@/auth";
import { apiResponseErr } from "@/lib/api-response";
import { unlink, writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import { v4 as uuid } from "uuid";

export const POST = auth(async function POST(req) {
  if (!req.auth) {
    return apiResponseErr(401, {
      message: "You are not allowed to access this resource",
    });
  }

  try {
    const { image } = await req.json();

    const matches = image.match(/^data:(.+);base64,(.+)$/);
    if (!matches) {
      return NextResponse.json(
        { error: "Invalid image format" },
        { status: 400 }
      );
    }

    const mime = matches[1];
    const ext = mime.split("/")[1];
    const buffer = Buffer.from(matches[2], "base64");

    const filename = `${uuid()}.${ext}`;
    const filepath = path.join(process.cwd(), "public/uploads", filename);

    await writeFile(filepath, buffer);

    return NextResponse.json({
      message: "Success upload image",
      url: `/uploads/${filename}`,
    });
  } catch (err) {
    console.error("Image upload error", err);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
});

export const DELETE = auth(async function DELETE(req) {
  if (!req.auth) {
    return apiResponseErr(401, {
      message: "You are not allowed to access this resource",
    });
  }

  try {
    const { imagePath } = await req.json();

    if (!imagePath || typeof imagePath !== "string") {
      return NextResponse.json(
        { error: "Invalid image path" },
        { status: 400 }
      );
    }

    // Ensure it's only within /uploads to prevent abuse
    if (!imagePath.startsWith("/uploads/")) {
      return NextResponse.json(
        { error: "Unauthorized file path" },
        { status: 403 }
      );
    }

    const filePath = path.join(process.cwd(), "public", imagePath);
    await unlink(filePath);

    return NextResponse.json({ message: "Success removing file" });
  } catch (error) {
    console.error("Image delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
});
