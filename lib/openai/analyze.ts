import OpenAI from "openai";
import { z } from "zod";
import { appConfig } from "@/lib/config";
import type { RadarAnalysis, RadarNote } from "@/lib/types";

const analysisSchema = z.object({
  summary: z.string(),
  viralPatterns: z.array(z.string()),
  titleFormulas: z.array(
    z.object({
      name: z.string(),
      formula: z.string(),
      examples: z.array(z.string()),
      whyItWorks: z.string()
    })
  ),
  shootingSuggestions: z.array(z.string()),
  talkingScript: z.string(),
  storyboard: z.array(
    z.object({
      scene: z.string(),
      visual: z.string(),
      narration: z.string(),
      durationSeconds: z.number()
    })
  ),
  risks: z.array(z.string())
});

export function createFallbackAnalysis(notes: RadarNote[]): RadarAnalysis {
  const topTitles = notes.slice(0, 5).map((note) => note.title).join("；");

  return {
    summary: `本轮共筛出 ${notes.length} 条高热内容。高频爆点集中在普通人低门槛变现、AI工作流、一人公司降本增效、个人IP定位和创业现金流。代表标题：${topTitles}`,
    viralPatterns: [
      "把抽象概念改成具体场景，比如从“AI工具”改成“用AI省下一个岗位”或“下班后接3单文案”。",
      "标题里同时出现人群、动作、结果和时间窗口，读者能在2秒内判断这条内容和自己有关。",
      "正文更容易爆的结构是：先反常识，再给流程，再展示案例，最后用评论关键词承接转化。"
    ],
    titleFormulas: [
      {
        name: "人群 + 时间 + 结果",
        formula: "普通人/新手 + 用AI + 时间窗口 + 达成结果",
        examples: ["普通人用AI做副业，7天跑出第一单", "新手做小红书，第一周只盯这4个数据"],
        whyItWorks: "直接给读者一个可代入的身份和结果预期，点击成本低。"
      },
      {
        name: "反常识提醒",
        formula: "别再X了，真正有用的是Y",
        examples: ["别再收藏AI工具清单了，真正赚钱的是工作流"],
        whyItWorks: "制造轻微冲突，适合引出更具体的方法论。"
      }
    ],
    shootingSuggestions: [
      "开头3秒直接展示结果截图、流程图或数据看板，不要先自我介绍。",
      "画面用电脑实操、白板拆解、数据卡片交替出现，增强真实感和专业感。",
      "结尾引导评论关键词，比如“流程”“一人公司”“选题表”，方便后续做系列内容。"
    ],
    talkingScript:
      "开头：\n" +
      "如果你还在收藏AI工具清单，先停一下。真正能变现的不是某一个工具，而是你能不能把AI放进一个可交付的流程里。\n\n" +
      "痛点：\n" +
      "很多人学AI副业，第一步就走偏了。今天试绘图，明天试写作，后天又换剪辑软件。看起来很努力，但最后只有收藏夹，没有作品、客户和收入。\n\n" +
      "核心观点：\n" +
      "AI副业不是从工具开始，而是从需求开始。你先找到一个别人愿意付费解决的问题，再反过来选择工具提效。\n\n" +
      "方法：\n" +
      "第一，锁定一个具体人群，比如知识博主、本地商家、课程老师。第二，定义一个明确交付物，比如选题表、标题库、口播稿、分镜脚本。第三，用AI批量生成初稿，再由你筛选、判断、修改和包装。\n\n" +
      "结尾：\n" +
      "所以别再问哪个AI工具最赚钱。真正的问题是：你准备用AI帮谁解决什么问题。评论区打“AI流程”，我下一条把这套流程拆成模板。",
    storyboard: [
      {
        scene: "开场钩子",
        visual: "展示热门笔记数据和关键词热度卡片",
        narration: "最近AI副业内容为什么又爆了？核心不是工具，而是流程。",
        durationSeconds: 4
      },
      {
        scene: "问题放大",
        visual: "左侧是工具收藏夹，右侧是空白交付清单",
        narration: "多数人卡在收藏和试用，缺少可交付场景。",
        durationSeconds: 8
      },
      {
        scene: "方法拆解",
        visual: "三步流程图：需求、交付、反馈",
        narration: "把AI放进这三个环节，副业才会从灵感变成系统。",
        durationSeconds: 16
      }
    ],
    risks: [
      "样例数据仅用于验证系统，不代表真实平台趋势。",
      "真实小红书数据接入需要确认平台条款和授权边界。"
    ]
  };
}

export async function analyzeHotNotes(notes: RadarNote[]): Promise<RadarAnalysis> {
  if (!appConfig.openaiApiKey) return createFallbackAnalysis(notes);

  try {
    const openai = new OpenAI({ apiKey: appConfig.openaiApiKey });
    const compactNotes = notes.slice(0, 30).map((note) => ({
      keyword: note.keyword,
      title: note.title,
      content: note.content.slice(0, 500),
      likeCount: note.likeCount,
      commentCount: note.commentCount,
      collectCount: note.collectCount,
      heatScore: note.heatScore
    }));

    const response = await openai.chat.completions.create({
      model: appConfig.openaiModel,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "你是资深小红书内容策略师和短视频编导。只输出严格 JSON，不要 Markdown。字段必须包含 summary, viralPatterns, titleFormulas, shootingSuggestions, talkingScript, storyboard, risks。"
        },
        {
          role: "user",
          content:
            "基于以下最近7天热门内容，提炼爆款规律、标题公式、拍摄建议、口播稿和短视频分镜。要求具体、可执行，避免空话。\n" +
            JSON.stringify(compactNotes, null, 2)
        }
      ]
    });

    const content = response.choices[0]?.message.content;
    if (!content) return createFallbackAnalysis(notes);

    return analysisSchema.parse(JSON.parse(content));
  } catch (error) {
    console.error("OpenAI analysis failed, using fallback analysis.", error);
    return createFallbackAnalysis(notes);
  }
}
