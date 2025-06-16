// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/profile")) {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.redirect(new URL("/", req.url));
    try {
      jwt.verify(token, SECRET);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*"],
};
