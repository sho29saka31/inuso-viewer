import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { timingSafeEqual } from "crypto";

function safeCompare(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

const ALLOWED_PATHS = new Set([
  "/", "/top", "/notice", "/busy", "/booth", "/event", "/eat", "/map", "/digital",
]);

const ALLOWED_TAGS = new Set(["viewer-features"]);

export async function POST(req: NextRequest) {
  const { secret, paths, tags } = await req.json();
  const envSecret = process.env.REVALIDATE_SECRET;
  if (!envSecret || !secret || !safeCompare(secret, envSecret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const safePaths = ((paths as string[]) ?? []).filter((p) => ALLOWED_PATHS.has(p));
  for (const path of safePaths) revalidatePath(path);

  const safeTags = ((tags as string[]) ?? []).filter((t) => ALLOWED_TAGS.has(t));
  for (const tag of safeTags) revalidateTag(tag, "max");

  return NextResponse.json({ ok: true, revalidated: safePaths, revalidatedTags: safeTags });
}
