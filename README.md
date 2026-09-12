# 灵感board · 卡片与思维导图

基于 Next.js 14（App Router）+ Tailwind CSS + @xyflow/react 的单页应用：收集碎片化灵感为「卡片」，再在交互式知识图谱里让卡片生长、连接。

## 快速开始

```bash
npm install
npm run dev
```

打开 http://localhost:3000 即可使用。数据保存在浏览器 localStorage 中（key: `inspiration-map-storage`），刷新不丢失。

## AI 功能

`✨ AI 拓展分支` 和 `✨ 智能寻根` 默认使用**内置本地模拟逻辑**，无需任何配置即可完整体验交互流程。

如果想接入真实的 Claude API：

```bash
cp .env.example .env.local
# 编辑 .env.local，填入 ANTHROPIC_API_KEY=sk-ant-xxxx
npm run dev
```

配置后，`src/lib/ai.ts` 中的 `expandCard` / `findRoot` 会自动改为调用 `claude-sonnet-4-6`；请求失败时会自动降级回本地模拟，不会导致界面报错。

## 目录结构

```
src/
  app/
    page.tsx                主页面：视图切换、详情弹窗
    layout.tsx               字体（Fraunces + Space Grotesk）与全局布局
    globals.css               暗色主题 + React Flow 主题覆盖
    api/ai/expand/route.ts    AI 拓展分支 接口
    api/ai/connect/route.ts   智能寻根 接口
  components/
    QuickAdd.tsx              快速录入栏（标题 + 可展开详情）
    CardFeed.tsx               瀑布流网格
    CardTile.tsx                单张卡片（图钉笔记视觉）
    CardDetailModal.tsx        卡片流视图下的详情弹窗
    ViewToggle.tsx              卡片流 / 知识图谱 切换
    graph/
      GraphView.tsx             React Flow 画布主逻辑
      CardNode.tsx              自定义节点（含 AI 拓展分支按钮）
      LabeledEdge.tsx           带描述标签的自定义连线
      RootFinderBar.tsx         智能寻根 悬浮工具条
      NodeDrawer.tsx            画布右侧详情抽屉
  lib/
    types.ts                    InspirationCard / CardConnection 数据结构
    store.ts                    Zustand 全局状态（含 localStorage 持久化）
    ai.ts                       AI 调用封装 + 本地模拟降级
    seed.ts                     初始示例卡片
```

## 数据结构

```ts
interface InspirationCard {
  id: string;
  title: string;
  sourceContent: string;   // 原始素材
  curationReason: string;  // 收集理由
  intendedUse: string;     // 打算怎么使用
  tags: string[];
  connections: { targetId: string; description: string; aiGenerated?: boolean }[];
  position: { x: number; y: number };
  createdAt: number;
  isAIGenerated?: boolean;
}
```
