import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const link = await prisma.link.findUnique({ where: { slug } });

  if (!link) {
    return NextResponse.redirect(new URL("/not-found", req.url));
  }

  // Track click asynchronously (don't await so redirect is instant)
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  prisma.click
    .create({
      data: {
        linkId: link.id,
        ip,
        userAgent: req.headers.get("user-agent") ?? null,
        referer: req.headers.get("referer") ?? null,
      },
    })
    .catch(() => {});

  return NextResponse.redirect(link.originalUrl, { status: 302 });
}
