import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Upload the file to Vercel Blob
        // Vercel Blob automatically adds a random hash to the end of the file name
        // to prevent collisions.
        const blob = await put(file.name, file, {
            access: "public",
        });

        return NextResponse.json({ url: blob.url });
    } catch (error: unknown) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to upload file" },
            { status: 500 }
        );
    }
}
