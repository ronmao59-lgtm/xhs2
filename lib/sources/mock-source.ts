import type { ContentSourceAdapter } from "@/lib/sources/types";
import type { RadarNote } from "@/lib/types";

type MockNoteSeed = {
  id: string;
  title: string;
  authorName: string;
  content: string;
  likeCount: number;
  commentCount: number;
  collectCount: number;
  ageHours: number;
};

const seedByKeyword: Record<string, MockNoteSeed[]> = {
  AI副业: [
    {
      id: "ai-side-business-client-script",
      title: "下班后用AI接了3单文案：我只保留这套报价模板",
      authorName: "副业拆解员阿澈",
      content:
        "这篇把AI文案副业拆成获客入口、需求表、报价话术、交付清单和复购提醒。爆点不是工具清单，而是把普通人最怕的报价和交付标准化。",
      likeCount: 2360,
      commentCount: 184,
      collectCount: 612,
      ageHours: 7
    },
    {
      id: "ai-side-business-weekend-workflow",
      title: "周末2小时做AI副业，我只做这4种低门槛服务",
      authorName: "一人公司实验室",
      content:
        "内容重点是筛掉高难服务，只保留小红书封面、短视频脚本、直播切片标题和朋友圈海报。读者能立刻判断自己能不能做。",
      likeCount: 1842,
      commentCount: 97,
      collectCount: 438,
      ageHours: 14
    },
    {
      id: "ai-side-business-first-order",
      title: "第一笔AI副业收入，不是靠技术，是靠这张需求表",
      authorName: "普通人AI赚钱笔记",
      content:
        "笔记用一张表解释客户需求怎么问、怎么避坑、怎么交付。评论区集中在想要模板，收藏率高，适合拆成口播教程。",
      likeCount: 1625,
      commentCount: 156,
      collectCount: 520,
      ageHours: 22
    }
  ],
  AI赚钱: [
    {
      id: "ai-money-productized-service",
      title: "别再问AI怎么赚钱，先把一个服务打包成产品",
      authorName: "商业化观察员",
      content:
        "爆点在反常识：不是找神奇工具，而是把服务变成固定套餐。结构包含套餐名、交付物、价格锚点和成交话术。",
      likeCount: 2218,
      commentCount: 203,
      collectCount: 655,
      ageHours: 9
    },
    {
      id: "ai-money-three-paths",
      title: "普通人AI赚钱的3条路：卖时间、卖模板、卖结果",
      authorName: "增长长板",
      content:
        "内容把赚钱路径分层，降低焦虑。适合做成系列视频：第1条最快变现，第2条可复制，第3条适合长期个人IP。",
      likeCount: 1760,
      commentCount: 138,
      collectCount: 501,
      ageHours: 18
    },
    {
      id: "ai-money-no-course",
      title: "我不建议你一上来卖AI课，先卖这个小交付",
      authorName: "轻创业复盘局",
      content:
        "这条的讨论点很强：反对新手直接做课程，建议先做可验证的小交付。评论区容易出现争议和追问。",
      likeCount: 1519,
      commentCount: 241,
      collectCount: 366,
      ageHours: 28
    }
  ],
  AI工具: [
    {
      id: "ai-tools-workflow-not-list",
      title: "我删掉了80%的AI工具，只留下这5个工作流节点",
      authorName: "工具效率派",
      content:
        "收藏点在于从工具清单升级成工作流：找选题、写初稿、做封面、剪切片、复盘数据。适合拍屏幕实操。",
      likeCount: 1987,
      commentCount: 121,
      collectCount: 708,
      ageHours: 11
    },
    {
      id: "ai-tools-redbook-content",
      title: "做小红书内容，我现在只让AI负责这6件事",
      authorName: "内容中台小许",
      content:
        "内容具体到运营场景：标题变体、评论提炼、爆款拆解、分镜草稿、封面文案、选题库。比泛泛推荐工具更容易转化。",
      likeCount: 1733,
      commentCount: 88,
      collectCount: 590,
      ageHours: 16
    },
    {
      id: "ai-tools-bad-use",
      title: "AI工具越用越累？你可能把顺序搞反了",
      authorName: "效率系统研究员",
      content:
        "爆点是戳痛点：先定结果，再选工具。笔记用错误流程和正确流程对照，适合做强节奏口播。",
      likeCount: 1398,
      commentCount: 117,
      collectCount: 432,
      ageHours: 33
    }
  ],
  AI一人公司: [
    {
      id: "ai-one-person-company-system",
      title: "AI一人公司不是一个人硬扛，而是把5个岗位系统化",
      authorName: "一人公司航海家",
      content:
        "这条适合做高价值感内容：把老板、产品、销售、运营、客服拆成AI辅助流程，给人一种可以复制的经营框架。",
      likeCount: 2451,
      commentCount: 196,
      collectCount: 721,
      ageHours: 8
    },
    {
      id: "ai-one-person-company-dashboard",
      title: "我的一人公司看板：每天只盯这7个数字",
      authorName: "独立创业样本",
      content:
        "内容不是讲概念，而是讲看板：线索数、咨询数、成交数、交付中、复购、内容发布、现金流。适合做后台展示型视频。",
      likeCount: 1692,
      commentCount: 94,
      collectCount: 537,
      ageHours: 20
    },
    {
      id: "ai-one-person-company-no-team",
      title: "暂时别招人，我用AI把这些外包岗位先顶住了",
      authorName: "小公司自动化手册",
      content:
        "爆点是创业者成本焦虑。内容列出设计、客服、资料整理、销售跟进、内容复盘的AI替代边界。",
      likeCount: 1430,
      commentCount: 132,
      collectCount: 406,
      ageHours: 30
    }
  ],
  个人IP: [
    {
      id: "personal-ip-positioning",
      title: "个人IP起号别先想人设，先回答这3个问题",
      authorName: "IP定位诊断室",
      content:
        "内容把人设问题转成商业问题：服务谁、解决什么、凭什么信你。评论区容易引导用户发账号让作者诊断。",
      likeCount: 1874,
      commentCount: 224,
      collectCount: 489,
      ageHours: 12
    },
    {
      id: "personal-ip-content-pillars",
      title: "一个人做IP，我建议先搭4根内容柱，而不是天天追热点",
      authorName: "内容飞轮笔记",
      content:
        "笔记提供内容柱：观点、案例、教程、复盘。它的价值是让用户减少日更焦虑，适合延展成选题日历。",
      likeCount: 1596,
      commentCount: 109,
      collectCount: 552,
      ageHours: 24
    },
    {
      id: "personal-ip-comment-area",
      title: "我用评论区反推选题，账号终于不再自嗨",
      authorName: "小红书运营长板",
      content:
        "爆点在具体方法：把高频评论、质疑评论、求模板评论分别转成3类内容。非常适合做屏幕录制型教程。",
      likeCount: 1324,
      commentCount: 171,
      collectCount: 398,
      ageHours: 36
    }
  ],
  创业: [
    {
      id: "startup-small-offer",
      title: "创业早期别做大产品，先验证一个小报价",
      authorName: "轻创业复盘局",
      content:
        "内容强调先卖再做，用小报价验证需求。适合创业人群，因为它直接缓解投入大、回款慢的焦虑。",
      likeCount: 1910,
      commentCount: 186,
      collectCount: 501,
      ageHours: 10
    },
    {
      id: "startup-cashflow",
      title: "我踩过的坑：创业第一个月不要只看粉丝数",
      authorName: "现金流优先",
      content:
        "这条的爆点是反虚荣指标。它把粉丝、询单、成交、交付、复购按优先级排序，适合做成警醒型短视频。",
      likeCount: 1588,
      commentCount: 144,
      collectCount: 429,
      ageHours: 26
    },
    {
      id: "startup-ai-automation",
      title: "小团队创业，我最先自动化的不是写作，而是跟进",
      authorName: "创业自动化样本",
      content:
        "内容角度区别于AI写作，讲线索跟进、客户提醒、交付节点和复盘报告。更接近真实经营场景。",
      likeCount: 1347,
      commentCount: 102,
      collectCount: 392,
      ageHours: 40
    }
  ]
};

const fallbackSeeds = Object.values(seedByKeyword).flat();

export const mockSourceAdapter: ContentSourceAdapter = {
  name: "mock",
  async fetchRecentHotNotes({ keyword, since, limit }) {
    const now = Date.now();
    const seeds = seedByKeyword[keyword] || fallbackSeeds;
    const results: RadarNote[] = [];

    for (let index = 0; index < limit; index += 1) {
      const seed = seeds[index % seeds.length];
      const round = Math.floor(index / seeds.length);
      const ageHours = seed.ageHours + round * 18;
      const publishedAt = new Date(
        Math.max(since.getTime(), now - ageHours * 60 * 60 * 1000)
      );
      const decay = Math.max(0.62, 1 - round * 0.12);

      results.push({
        sourceNoteId: `mock-${keyword}-${seed.id}-${round}`,
        keyword,
        title: seed.title,
        authorName: seed.authorName,
        content: seed.content,
        noteUrl: null,
        coverUrl: null,
        likeCount: Math.round(seed.likeCount * decay),
        commentCount: Math.round(seed.commentCount * decay),
        collectCount: Math.round(seed.collectCount * decay),
        publishedAt: publishedAt.toISOString()
      });
    }

    return results;
  }
};
