import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { nanoid } from "@/lib/utils";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

  const links = await prisma.link.findMany({
    where: { userId: session.user.id },
    include: {
      _count: { select: { clicks: true } },
      clicks: {
        where: { clickedAt: { gte: fourteenDaysAgo } },
        select: { clickedAt: true },
        orderBy: { clickedAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(links);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { originalUrl, slug, title } = await req.json();

  if (!originalUrl) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    new URL(originalUrl);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const finalSlug = slug?.trim() || nanoid(7);

  if (slug) {
    const exists = await prisma.link.findUnique({ where: { slug: finalSlug } });
    if (exists) {
      return NextResponse.json(
        { error: "This slug is already taken" },
        { status: 409 }
      );
    }
  }

  const link = await prisma.link.create({
    data: {
      userId: session.user.id,
      originalUrl,
      slug: finalSlug,
      title: title?.trim() || null,
    },
    include: { _count: { select: { clicks: true } } },
  });

  return NextResponse.json(link, { status: 201 });
}
