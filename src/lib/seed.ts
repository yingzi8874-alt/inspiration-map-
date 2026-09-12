import { InspirationCard } from "./types";

export const seedCards: InspirationCard[] = [
  {
    id: "c1",
    title: "「留白」不是空的",
    sourceContent:
      "在一本关于日本庭院设计的书里看到：枯山水中的白砂不是背景，而是被耙出波纹的、有方向感的主体。",
    curationReason:
      "一直以为留白是「没画的地方」，这个说法把留白变成了主动的设计元素，而不是消极的空缺。",
    intendedUse:
      "写一篇关于界面留白设计的文章时用作开篇类比，或者用在下次做 PPT 排版时提醒自己。",
    tags: ["设计", "留白", "灵感"],
    connections: [
      { targetId: "c2", description: "两者都在讨论「减法」如何变成一种主动的表达方式" },
    ],
    position: { x: -280, y: -80 },
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 6,
  },
  {
    id: "c2",
    title: "减法式产品叙事",
    sourceContent:
      "播客里听到一位产品经理说：好的产品发布会不是罗列功能，而是讲清楚「我们决定不做什么」。",
    curationReason:
      "和最近在做的功能取舍讨论很相关，很少有人把「不做什么」当作叙事的核心。",
    intendedUse: "整理成团队内部的产品原则文档草稿。",
    tags: ["产品", "叙事", "取舍"],
    connections: [],
    position: { x: 60, y: -160 },
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 4,
  },
  {
    id: "c3",
    title: "地图上的空白区域",
    sourceContent:
      "老地图上未勘探的区域会写「此处有龙」，用想象填补未知，而不是留白。",
    curationReason:
      "和「留白」形成一个有趣的反例：同样是未知，有人选择空白，有人选择用故事填满。",
    intendedUse: "作为思维导图里的一个分支素材，探索「未知」的两种处理方式。",
    tags: ["历史", "未知", "叙事"],
    connections: [
      { targetId: "c1", description: "都在处理「未被定义的空间」，但选择了相反的策略" },
    ],
    position: { x: -520, y: 160 },
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
];
