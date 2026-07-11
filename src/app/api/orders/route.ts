import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthed } from "@/lib/auth";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    const mappedOrders = orders.map((order: any) => ({
      id: order.id,
      date: order.date.getTime(),
      total: order.total,
      utr: order.utr,
      reservationCode: order.reservationCode,
      paymentStatus: order.paymentStatus,
      directBuy: order.directBuy,
      items: order.items,
      customerInfo: {
        name: order.name,
        phone: order.phone,
        address: order.address,
        pincode: order.pincode,
      },
    }));

    return NextResponse.json(mappedOrders);
  } catch (error) {
    console.warn("Database not ready or unconfigured, returning empty orders:", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      id, 
      name, 
      phone, 
      address, 
      pincode, 
      total, 
      utr, 
      reservationCode, 
      directBuy, 
      items 
    } = body;

    if (!id || !name || !phone || !address || !pincode || !total || !utr || !reservationCode || !items) {
      return NextResponse.json(
        { error: "Missing required order fields" },
        { status: 400 }
      );
    }

    // Validate stock before creating order
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { sku: item.sku } });
      if (!product || product.stockQuantity < 1) {
        return NextResponse.json(
          { error: `Item ${item.nameKey || item.sku} is out of stock.` },
          { status: 400 }
        );
      }
    }

    // Create order and decrement stock in a transaction
    const [order] = await prisma.$transaction([
      prisma.order.create({
        data: {
          id,
          name,
          phone,
          address,
          pincode,
          total,
          utr,
          reservationCode,
          directBuy: !!directBuy,
          items: {
            create: items.map((item: any) => ({
              sku: item.sku,
              nameKey: item.nameKey,
              brand: item.brand,
              size: item.size,
              colorName: item.colorName || "",
              priceInRupees: item.priceInRupees,
              imagePath: item.imagePath,
            })),
          },
        },
        include: {
          items: true,
        },
      }),
      ...items.map((item: any) => 
        prisma.product.update({
          where: { sku: item.sku },
          data: { stockQuantity: { decrement: 1 } }
        })
      )
    ]);

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Failed to create order in database:", error);
    return NextResponse.json(
      { error: "Database error while placing order" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  if (!isAdminAuthed(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id, paymentStatus } = await request.json();

    if (!id || !paymentStatus) {
      return NextResponse.json(
        { error: "id and paymentStatus are required" },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        paymentStatus,
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Failed to update order payment status:", error);
    return NextResponse.json(
      { error: "Database error while updating order status" },
      { status: 500 }
    );
  }
}
