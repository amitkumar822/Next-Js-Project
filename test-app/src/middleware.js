import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  const publicPaths = ["/login", "/register"];

  if (publicPaths.includes(pathname)) return NextResponse.next();

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", decoded.userId);
    return NextResponse.next({ request: { headers: requestHeaders } });
  } catch (err) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/project/:path*"],
};
