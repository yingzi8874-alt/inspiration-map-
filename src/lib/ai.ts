// Thin wrapper around the Anthropic Messages API for the two AI features:
// "✨ AI 拓展分支" (expand) and "✨ 智能寻根" (connect).
//
// If ANTHROPIC_API_KEY is set in the environment, real calls are made.
// Otherwise both functions fall back to a lightweight local simulation so
// the app is fully demoable without any credentials.

interface CardLike {
  title: string;
  sourceContent?: string;
  curationReason?: string;
  intendedUse?: string;
  tags?: string[];
}

export interface ExpandBranch {
  title: string;
  sourceContent: string;
  curationReason: string;
  intendedUse: string;
  tags: string[];
  relation: string;
}

const MODEL = "claude-sonnet-4-6";

async function callClaude(system: string, user: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("no api key configured");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1200,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });

  if (!res.ok) {
    throw new Error(`anthropic api error: ${res.status}`);
  }
  const data = await res.json();
  const text = (data.content ?? [])
    .map((block: { type: string; text?: string }) => (block.type === "text" ? block.text : ""))
    .join("\n");
  return text;
}

function extractJSON(text: string): unknown {
  const fenced = text.match(/```json\s*([\s\S]*?)```/i) ?? text.match(/```\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf("{") === -1 ? raw.indexOf("[") : raw.indexOf("{");
  const end = Math.max(raw.lastIndexOf("}"), raw.lastIndexOf("]"));
  const slice = start >= 0 && end >= 0 ? raw.slice(start, end + 1) : raw;
  return JSON.parse(slice);
}

// ---------- Expand: generate 2-3 divergent child concepts ----------

export async function expandCard(card: CardLike): Promise<ExpandBranch[]> {
  try {
    const system =
      "你是一个帮助用户做发散性思考的创意伙伴。基于用户给出的一张“灵感卡片”，生成 2-3 个与它相关但角度不同的子概念分支，" +
      "帮助用户把一个想法生长成一棵思维树。只输出 JSON，不要输出任何解释文字。";
    const user = `原始卡片：
标题：${card.title}
原始素材：${card.sourceContent || "（无）"}
收集理由：${card.curationReason || "（无）"}
打算怎么使用：${card.intendedUse || "（无）"}
标签：${(card.tags || []).join("、") || "（无）"}

请生成 2-3 个发散的子概念，返回 JSON 数组，每个元素包含字段：
title（子概念标题，8字以内为佳）、sourceContent（虚构或提炼出的素材/例子，1-2句）、
curationReason（为什么这个子概念值得记录，1句）、intendedUse（可能的使用场景，1句）、
tags（1-3个标签的数组）、relation（这个子概念与原始卡片之间的关系描述，10字以内，用于连线标注）。
只返回 JSON 数组本身。`;
    const text = await callClaude(system, user);
    const parsed = extractJSON(text) as ExpandBranch[];
    if (Array.isArray(parsed) && parsed.length > 0) return parsed.slice(0, 3);
    throw new Error("empty branches");
  } catch {
    return simulateExpand(card);
  }
}

function simulateExpand(card: CardLike): ExpandBranch[] {
  const angles: { suffix: string; relation: string; use: string }[] = [
    { suffix: "的反面", relation: "对立视角", use: "用于对比论证，制造张力" },
    { suffix: "的具体案例", relation: "举例说明", use: "写作或分享时作为实证" },
    { suffix: "在别的领域", relation: "跨领域迁移", use: "跨行业类比时的引子" },
  ];
  return angles.map((a) => ({
    title: `${card.title}${a.suffix}`,
    sourceContent: `围绕「${card.title}」发散出的一个角度：如果反过来看待「${
      card.curationReason || card.title
    }」，会指向${a.suffix}。这是一个模拟生成的占位素材，配置 ANTHROPIC_API_KEY 后将替换为真实 AI 生成内容。`,
    curationReason: `帮助从「${a.relation}」的角度重新审视原始卡片，避免思路固化。`,
    intendedUse: a.use,
    tags: Array.from(new Set([...(card.tags || []).slice(0, 1), a.relation])),
    relation: a.relation,
  }));
}

// ---------- Root-finding: bridge two cards with a shared concept ----------

export async function findRoot(cardA: CardLike, cardB: CardLike): Promise<string> {
  try {
    const system =
      "你是一个擅长发现隐藏联系的创意顾问。给你两张看似不相关的灵感卡片，请提炼出连接它们的共同概念脉络，" +
      "用一句简洁的中文短语（15字以内）描述这条连线代表的关系。只输出 JSON，不要输出任何解释文字。";
    const user = `卡片 A：
标题：${cardA.title}
素材：${cardA.sourceContent || "（无）"}
理由：${cardA.curationReason || "（无）"}
标签：${(cardA.tags || []).join("、")}

卡片 B：
标题：${cardB.title}
素材：${cardB.sourceContent || "（无）"}
理由：${cardB.curationReason || "（无）"}
标签：${(cardB.tags || []).join("、")}

返回 JSON 对象：{ "description": "连接这两张卡片的共同概念脉络，15字以内" }`;
    const text = await callClaude(system, user);
    const parsed = extractJSON(text) as { description: string };
    if (parsed?.description) return parsed.description;
    throw new Error("empty description");
  } catch {
    return simulateRoot(cardA, cardB);
  }
}

function simulateRoot(cardA: CardLike, cardB: CardLike): string {
  const sharedTag = (cardA.tags || []).find((t) => (cardB.tags || []).includes(t));
  if (sharedTag) return `共享概念：${sharedTag}`;
  return `都在处理「未被定义的边界」`;
}
