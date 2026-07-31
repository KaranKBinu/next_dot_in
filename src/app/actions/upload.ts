"use server";

import { put } from "@vercel/blob";
import { getCurrentSession } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function uploadImageToBlobAction(formData: FormData) {
  const session = await getCurrentSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "MASTER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "No file provided for upload." };
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN;

    // If Vercel Blob read/write token is present, upload to CDN storage
    if (token) {
      const filename = `products/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const blob = await put(filename, file, {
        access: "public",
        token,
      });

      logger.info(
        {
          operation: "IMAGE_UPLOAD_BLOB_SUCCESS",
          url: blob.url,
          filename: blob.pathname,
        },
        "Uploaded product image to Vercel Blob CDN"
      );

      return { success: true, url: blob.url };
    }

    // Fallback: Convert to Base64 Data URL if BLOB_READ_WRITE_TOKEN is not configured
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || "image/png";
    const dataUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;

    logger.info(
      {
        operation: "IMAGE_UPLOAD_DATA_URL_SUCCESS",
        filename: file.name,
        sizeBytes: file.size,
      },
      "Processed product image as Base64 Data URL (BLOB token missing)"
    );

    return { success: true, url: dataUrl };
  } catch (error: any) {
    logger.error(
      {
        operation: "IMAGE_UPLOAD_FAILED",
        error: error.message,
      },
      "Product image upload error"
    );
    return { success: false, error: error.message || "Failed to upload product image." };
  }
}
