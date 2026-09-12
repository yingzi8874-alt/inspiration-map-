import { NextRequest, NextResponse } from "next/server";
import { expandCard } from "@/lib/ai";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const branches = await expandCard(body);
  return NextResponse.json({ branches });
}
