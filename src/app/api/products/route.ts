import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthed } from "@/lib/auth";

// GET /api/products — fetch all active products
export async function GET() {
    try {
        const products = await prisma.product.findMany({
            where: { isActive: true },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(products);
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}

// POST /api/products — create a new product (admin only)
export async function POST(req: NextRequest) {
    if (!isAdminAuthed(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const body = await req.json();
        const {
            sku, parentProductId, name, description, brand, year, category, material,
            size, colorName, colorHex, priceInRupees, imagePath,
            chestInch, lengthInch, shoulderInch, condition, hotness, stockQuantity
        } = body;

        if (!sku || !name || !brand || !category || !priceInRupees || !imagePath) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                sku,
                parentProductId: parentProductId || null,
                name,
                description: description || "",
                brand,
                year: year || new Date().getFullYear().toString(),
                category,
                material: material || "",
                size: size || "",
                colorName: colorName || "",
                colorHex: colorHex || "#000000",
                priceInRupees: Number(priceInRupees),
                imagePath,
                chestInch: chestInch || "",
                lengthInch: lengthInch || "",
                shoulderInch: shoulderInch || "",
                condition: condition || "condVeryGood",
                hotness: Number(hotness) || 3,
                stockQuantity: stockQuantity !== undefined ? Number(stockQuantity) : 1,
                isActive: true,
            },
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error: unknown) {
        console.error("Failed to create product:", error);
        // Unique constraint violation
        if (
            typeof error === "object" && error !== null &&
            "code" in error && (error as { code: string }).code === "P2002"
        ) {
            return NextResponse.json({ error: "SKU already exists" }, { status: 409 });
        }
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}

// DELETE /api/products?sku=xxx — soft-delete (admin only)
export async function DELETE(req: NextRequest) {
    if (!isAdminAuthed(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const { searchParams } = new URL(req.url);
        const sku = searchParams.get("sku");

        if (!sku) {
            return NextResponse.json({ error: "SKU is required" }, { status: 400 });
        }

        await prisma.product.update({
            where: { sku },
            data: { isActive: false },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete product:", error);
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
    }
}
