import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

// Edge-safe — no Prisma. Only runs on /dashboard routes.
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;

  // Unauthenticated users hitting /dashboard get sent to login
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  // Only protect dashboard routes. Login/signup pages load freely —
  // the dashboard layout handles its own server-side auth redirect.
  matcher: ["/dashboard/:path*"],
};
