import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const { secret, paths } = await req.json();
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const revalidated: string[] = [];
  for (const path of (paths as string[]) ?? []) {
    revalidatePath(path);
    revalidated.push(path);
  }

  return NextResponse.json({ ok: true, revalidated });
}
