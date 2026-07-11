import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Let the login page through unconditionally
    if (pathname === "/admin/login") {
        return NextResponse.next();
    }

    const sessionToken = request.cookies.get("admin_session")?.value;
    const expectedToken = process.env.ADMIN_SESSION_TOKEN;

    if (!sessionToken || !expectedToken || sessionToken !== expectedToken) {
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("from", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin", "/admin/:path*"],
};
