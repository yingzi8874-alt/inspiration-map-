import { NextResponse } from 'next/server';

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

// 从云端获取所有卡片
export async function GET() {
  if (!REDIS_URL || !REDIS_TOKEN) {
    return NextResponse.json({ error: 'Storage not configured' }, { status: 500 });
  }

  try {
    const res = await fetch(`${REDIS_URL}/get/inspiration_cards`, {
      headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
      cache: 'no-store',
    });
    const data = await res.json();
    const cards = data.result ? JSON.parse(data.result) : [];
    return NextResponse.json(cards);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 });
  }
}

// 保存卡片列表到云端
export async function POST(req: Request) {
  if (!REDIS_URL || !REDIS_TOKEN) {
    return NextResponse.json({ error: 'Storage not configured' }, { status: 500 });
  }

  try {
    const body = await req.json();
    await fetch(`${REDIS_URL}/set/inspiration_cards`, {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${REDIS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(JSON.stringify(body)),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save cards' }, { status: 500 });
  }
}
