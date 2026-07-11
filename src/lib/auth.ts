/**
 * Checks if an incoming API request carries a valid admin session cookie.
 * Used by mutating admin API routes (POST, DELETE, PUT).
 */
export function isAdminAuthed(request: Request): boolean {
    const cookieHeader = request.headers.get("cookie") ?? "";
    const cookies = Object.fromEntries(
        cookieHeader.split(";").map((c) => {
            const [key, ...val] = c.trim().split("=");
            return [key.trim(), val.join("=")];
        })
    );
    const expectedToken = process.env.ADMIN_SESSION_TOKEN ?? "";
    return !!expectedToken && cookies["admin_session"] === expectedToken;
}
