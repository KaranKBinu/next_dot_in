import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthed } from "@/lib/auth";

const DEFAULT_UPI = "bothzmannhypo123@okicici";
const DEFAULT_QR = "/qr_code.jpg";

export async function GET() {
  try {
    const config = await prisma.qRConfig.findUnique({
      where: { id: "default" },
    });

    if (!config) {
      return NextResponse.json({
        upiId: DEFAULT_UPI,
        qrCode: DEFAULT_QR,
        isDefault: true,
      });
    }

    return NextResponse.json({
      upiId: config.upiId,
      qrCode: config.qrCode,
      isDefault: false,
    });
  } catch (error) {
    console.warn("Database not ready or unconfigured, falling back to local QR config:", error);
    return NextResponse.json({
      upiId: DEFAULT_UPI,
      qrCode: DEFAULT_QR,
      isDefault: true,
      error: "DB_UNAVAILABLE",
    });
  }
}

export async function POST(request: Request) {
  if (!isAdminAuthed(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { upiId, qrCode } = await request.json();

    if (!upiId || !qrCode) {
      return NextResponse.json(
        { error: "upiId and qrCode are required" },
        { status: 400 }
      );
    }

    const config = await prisma.qRConfig.upsert({
      where: { id: "default" },
      update: { upiId, qrCode },
      create: { id: "default", upiId, qrCode },
    });

    return NextResponse.json({
      success: true,
      upiId: config.upiId,
      qrCode: config.qrCode,
    });
  } catch (error) {
    console.error("Failed to update QR config in database:", error);
    return NextResponse.json(
      { error: "Database error while updating configuration" },
      { status: 500 }
    );
  }
}
