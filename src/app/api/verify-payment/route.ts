import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, dbOrderId } = await request.json();

    const secret = process.env.RAZORPAY_KEY_SECRET || "";
    
    // Verify signature
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest("hex");

    if (digest !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // Update order status in DB
    const order = await prisma.order.update({
      where: { id: dbOrderId },
      data: { paymentStatus: "verified" },
    });

    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    console.error("Payment verification failed:", err);
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 });
  }
}
