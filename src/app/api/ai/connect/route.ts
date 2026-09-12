import { NextRequest, NextResponse } from "next/server";
import { findRoot } from "@/lib/ai";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const description = await findRoot(body.cardA, body.cardB);
  return NextResponse.json({ description });
}
