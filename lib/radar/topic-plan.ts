import type { TopicPlan } from "@/lib/types";

export function getTopicPlans(): TopicPlan[] {
  return [
    {
      id: "ai-workflow",
      order: 1,
      title: "别再收藏AI工具了，真正能变现的是这套工作流",
      angle: "反工具清单，强调可交付流程",
      whyNow: "AI工具内容已经泛滥，用户真正焦虑的是怎么把工具变成收入。",
      targetUser: "想做AI副业但还没有方向的新手",
      hook: "如果你收藏了100个AI工具还没赚到钱，这条先看完。",
      script:
        "如果你收藏了100个AI工具，却还没有赚到钱，问题大概率不是工具不够多，而是你没有一套能交付的流程。\n\n" +
        "普通人做AI副业，不是靠某个神奇工具，而是靠“需求到交付”的闭环。先锁定一个人群，比如知识博主、本地商家、课程老师；再定义一个交付物，比如30个选题、10个标题、3条口播稿；最后用AI生成初稿，你负责筛选、判断和包装。\n\n" +
        "客户买的不是你会用AI，客户买的是结果。想要这套流程模板，评论区打“流程”。",
      storyboard: [
        { scene: "误区开场", visual: "展示一屏AI工具收藏夹", narration: "收藏工具不等于会赚钱。", durationSeconds: 5 },
        { scene: "流程图", visual: "需求、交付物、AI提效、人工包装四段流程", narration: "真正能卖的是闭环。", durationSeconds: 18 },
        { scene: "案例演示", visual: "小红书博主选题表和标题库", narration: "客户买的是结果，不是工具名。", durationSeconds: 20 }
      ],
      callToAction: "评论区打“流程”，领取AI副业工作流模板。"
    },
    {
      id: "one-person-company",
      order: 2,
      title: "一人公司不是一个人硬扛，而是用AI搭一个迷你团队",
      angle: "把AI从工具升级为岗位分工",
      whyNow: "一人公司概念很热，但很多内容只停留在口号，缺少岗位化拆解。",
      targetUser: "自由职业者、小团队创始人、个人IP博主",
      hook: "一人公司最容易踩的坑，就是把自己活成整家公司。",
      script:
        "一人公司不是一个人硬扛所有事，而是你用AI给自己搭一个迷你团队。\n\n" +
        "真正的一人公司，要把AI当成岗位，而不是玩具。你可以有选题助理、文案助理、剪辑助理、客服助理和数据分析助理。AI负责初稿和整理，你保留判断、审美、成交这些高价值动作。\n\n" +
        "如果你每天很忙但没有增长，先别加班，先重做你的AI岗位表。",
      storyboard: [
        { scene: "身份反差", visual: "一个人被内容、客服、剪辑、数据包围", narration: "别把一人公司做成一个人加班。", durationSeconds: 6 },
        { scene: "岗位矩阵", visual: "AI选题助理、文案助理、客服助理、数据助理", narration: "AI要岗位化，不要玩具化。", durationSeconds: 18 },
        { scene: "落地动作", visual: "每周重复任务清单", narration: "从重复任务开始自动化。", durationSeconds: 20 }
      ],
      callToAction: "评论区打“一人公司”，领取AI岗位拆解表。"
    },
    {
      id: "content-radar",
      order: 3,
      title: "我用AI做小红书选题雷达，每天只看4个信号",
      angle: "展示方法论，建立运营专业感",
      whyNow: "内容创作者普遍缺选题判断标准，容易凭感觉发内容。",
      targetUser: "小红书博主、内容运营、个人IP创业者",
      hook: "选题不是靠灵感，我每天只看4个信号。",
      script:
        "小红书选题不是靠灵感，我每天只看4个信号：点赞、收藏、评论和发布时间。\n\n" +
        "点赞代表传播力，收藏代表长期价值，评论代表真实问题，发布时间代表是不是近期趋势。把同一关键词下的热门笔记放在一起看，你会发现用户正在焦虑什么、收藏什么、愿意讨论什么。\n\n" +
        "做内容不要只刷推荐页，要建立自己的选题雷达。这样你会比别人更早知道下一条该拍什么。",
      storyboard: [
        { scene: "数据看板", visual: "点赞、收藏、评论、发布时间四个指标", narration: "选题先看信号。", durationSeconds: 8 },
        { scene: "标题拆解", visual: "把爆款标题标出人群、结果、时间、情绪词", narration: "爆款标题背后有结构。", durationSeconds: 22 },
        { scene: "改写示范", visual: "从原始标题改成自己的选题", narration: "借结构，不抄内容。", durationSeconds: 18 }
      ],
      callToAction: "评论区打“雷达”，领取选题判断表。"
    },
    {
      id: "personal-ip",
      order: 4,
      title: "个人IP别急着做人设，先找到你的内容母题",
      angle: "纠正个人IP起号误区",
      whyNow: "个人IP赛道竞争激烈，单纯人设包装越来越难转化。",
      targetUser: "准备做个人IP但定位混乱的人",
      hook: "个人IP起不来，很多时候不是人设不鲜明，而是母题不稳定。",
      script:
        "个人IP起不来，很多时候不是你人设不够鲜明，而是你的内容母题不稳定。\n\n" +
        "不要一开始就纠结头像、简介和口号。先问自己：我能长期帮谁解决什么问题？比如你会AI工具，又懂内容运营，你的母题不是“分享AI工具”，而是“普通人如何用AI提升内容生产效率”。\n\n" +
        "母题稳定了，人设才会自然长出来。",
      storyboard: [
        { scene: "混乱账号", visual: "多个不相关选题铺满屏幕", narration: "内容乱，用户就记不住你。", durationSeconds: 7 },
        { scene: "母题公式", visual: "能力、痛点、人群三圆交叉", narration: "母题来自能力和需求的交叉。", durationSeconds: 20 },
        { scene: "定位示范", visual: "从AI工具分享改成AI内容效率", narration: "越具体，越容易被记住。", durationSeconds: 18 }
      ],
      callToAction: "评论区打“母题”，领取个人IP定位表。"
    },
    {
      id: "ai-money-risk",
      order: 5,
      title: "AI赚钱最大的误区：以为会提示词就能收钱",
      angle: "风险提醒，建立信任",
      whyNow: "AI赚钱内容容易夸大收益，理性拆解更容易获得高质量关注。",
      targetUser: "被AI赚钱信息吸引但缺少判断的人",
      hook: "会提示词不等于能赚钱，这句话可能会劝退很多人，但很重要。",
      script:
        "会提示词不等于能赚钱。这句话可能会劝退很多人，但很重要。\n\n" +
        "客户从来不是为提示词付费，而是为结果付费。你真正要建立的是需求理解、交付标准、质量判断和获客能力。提示词只是生产过程的一部分，不是商业模式。\n\n" +
        "如果你刚开始，不要急着卖课、卖社群、卖万能提示词。先选一个小场景，做出3个真实案例，证明你能交付结果。",
      storyboard: [
        { scene: "强提醒", visual: "大字：会提示词不等于能赚钱", narration: "客户为结果付费，不为提示词付费。", durationSeconds: 6 },
        { scene: "能力链路", visual: "需求、交付、AI生产、人工质检、获客", narration: "赚钱靠链路，不靠一句咒语。", durationSeconds: 24 },
        { scene: "新手建议", visual: "三个真实案例卡片", narration: "先做案例，再谈变现。", durationSeconds: 18 }
      ],
      callToAction: "评论区打“案例”，领取AI副业案例模板。"
    }
  ];
}
