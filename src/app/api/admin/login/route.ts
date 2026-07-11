import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { password } = await req.json();

        if (!password || password !== process.env.ADMIN_PASSWORD) {
            // Small delay to resist brute-force
            await new Promise((r) => setTimeout(r, 500));
            return NextResponse.json({ error: "Invalid password" }, { status: 401 });
        }

        const token = process.env.ADMIN_SESSION_TOKEN ?? "";
        const response = NextResponse.json({ success: true });

        response.cookies.set("admin_session", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        return response;
    } catch {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
}
