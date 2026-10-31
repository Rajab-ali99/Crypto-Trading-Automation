import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("Token_Access")?.value;

  if (!token) {
    return NextResponse.redirect(
      new URL("/auth/login", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
  ],
};