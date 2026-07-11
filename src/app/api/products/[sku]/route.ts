import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthed } from "@/lib/auth";

// PATCH /api/products/[sku] — update a product field
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ sku: string }> }
) {
    if (!isAdminAuthed(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const { sku } = await params;
        const body = await req.json();

        const data = { ...body };
        if (data.stockQuantity !== undefined) data.stockQuantity = Number(data.stockQuantity);
        if (data.priceInRupees !== undefined) data.priceInRupees = Number(data.priceInRupees);
        if (data.hotness !== undefined) data.hotness = Number(data.hotness);

        const product = await prisma.product.update({
            where: { sku },
            data,
        });

        return NextResponse.json(product);
    } catch (error: unknown) {
        console.error("Failed to update product:", error);
        // Unique constraint violation (e.g. if updated SKU already exists on another product)
        if (
            typeof error === "object" && error !== null &&
            "code" in error && (error as { code: string }).code === "P2002"
        ) {
            return NextResponse.json({ error: "SKU already exists" }, { status: 409 });
        }
        return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
    }
}
