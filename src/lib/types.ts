export interface CardConnection {
  /** id of the other card this connection points to */
  targetId: string;
  /** human/AI-authored description of *why* the two cards relate */
  description: string;
  /** true if the connection was produced by "智能寻根" rather than manually */
  aiGenerated?: boolean;
}

export interface InspirationCard {
  id: string;
  title: string;
  /** 原始素材：摘录、链接、截图描述、灵光一闪的原话 */
  sourceContent: string;
  /** 收集理由：为什么这条素材值得留下 */
  curationReason: string;
  /** 打算怎么使用：未来会用在什么项目/文章/产品里 */
  intendedUse: string;
  tags: string[];
  connections: CardConnection[];
  position: { x: number; y: number };
  createdAt: number;
  /** true when this card was created by "AI 拓展分支" */
  isAIGenerated?: boolean;
}

export type ViewMode = "feed" | "graph";
