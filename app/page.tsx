import { RunSelector } from "@/components/run-selector";
import { TopicScriptPlanner } from "@/components/topic-script-planner";
import { requireDashboardAuth } from "@/lib/auth";
import { RADAR_KEYWORDS } from "@/lib/config";
import { getSafeDashboardData } from "@/lib/radar/repository";
import { getTopicPlans } from "@/lib/radar/topic-plan";
import { formatDateTime } from "@/lib/utils/date";

export const dynamic = "force-dynamic";

function numberFormat(value: number | undefined) {
  return new Intl.NumberFormat("zh-CN").format(value || 0);
}

function statusText(status: string | null | undefined) {
  if (status === "succeeded") return "最近任务成功";
  if (status === "failed") return "最近任务失败";
  if (status === "running") return "任务运行中";
  if (status === "preview") return "本地预览模式";
  return "等待首次运行";
}

export default async function HomePage({
  searchParams
}: {
  searchParams?: { run?: string };
}) {
  requireDashboardAuth();

  const { notes, analysis, latestRun, selectedRun, runs, cloudStatus, dataError } =
    await getSafeDashboardData(searchParams?.run);
  const topNote = notes[0];
  const totalLikes = notes.reduce((sum, note) => sum + note.likeCount, 0);
  const totalComments = notes.reduce((sum, note) => sum + note.commentCount, 0);
  const totalCollects = notes.reduce((sum, note) => sum + note.collectCount, 0);
  const topicPlans = getTopicPlans();
  const isLatest = selectedRun?.id === latestRun?.id;

  return (
    <main className="page-shell">
      <section className="topbar">
        <div className="brand-block">
          <span className="brand-mark">RED</span>
          <div>
            <p className="eyebrow">小红书爆款内容雷达</p>
            <h1>{isLatest ? "今日雷达" : "历史雷达"}</h1>
            <p className="topbar-subtitle">
              按小红书运营节奏沉淀热门笔记、爆款规律、标题公式、拍摄建议、口播稿和分镜。
            </p>
          </div>
        </div>
        <div className="topbar-actions">
          <RunSelector runs={runs} selectedRunId={selectedRun?.id || null} />
          <div className="run-state">
            <span>{selectedRun?.status === "succeeded" ? "已更新" : "等待运行"}</span>
            <strong>{formatDateTime(selectedRun?.finishedAt || selectedRun?.startedAt)}</strong>
            <form action="/api/auth/logout" method="post">
              <button type="submit">退出</button>
            </form>
          </div>
        </div>
      </section>

      {dataError ? (
        <section className="notice error-notice">
          <strong>需要完成数据库升级</strong>
          <span>
            后台已切换到临时预览数据。请在 Supabase SQL Editor 运行
            `supabase/20260531_add_run_id_to_notes.sql`，然后重新触发每日任务。
            当前错误：{dataError}
          </span>
        </section>
      ) : null}

      <section className={cloudStatus.connected ? "cloud-status connected" : "cloud-status"}>
        <div>
          <span className="status-dot" />
          <div>
            <p className="eyebrow">云端记忆</p>
            <h2>{cloudStatus.connected ? "已连接 Supabase 数据库" : "当前为本地预览模式"}</h2>
          </div>
        </div>
        <div className="cloud-items">
          <article>
            <span>当前批次</span>
            <strong>{formatDateTime(selectedRun?.finishedAt || selectedRun?.startedAt)}</strong>
          </article>
          <article>
            <span>任务状态</span>
            <strong>{statusText(cloudStatus.latestRunStatus)}</strong>
          </article>
          <article>
            <span>云端内容</span>
            <strong>{numberFormat(cloudStatus.noteCount)} 条</strong>
          </article>
          <article>
            <span>AI 分析记录</span>
            <strong>{numberFormat(cloudStatus.analysisCount)} 条</strong>
          </article>
        </div>
      </section>

      <section className="metrics-grid">
        <div className="metric">
          <span>监控关键词</span>
          <strong>{RADAR_KEYWORDS.length}</strong>
        </div>
        <div className="metric">
          <span>本批入选笔记</span>
          <strong>{notes.length}</strong>
        </div>
        <div className="metric">
          <span>点赞总量</span>
          <strong>{numberFormat(totalLikes)}</strong>
        </div>
        <div className="metric">
          <span>评论 / 收藏</span>
          <strong>
            {numberFormat(totalComments)} / {numberFormat(totalCollects)}
          </strong>
        </div>
      </section>

      <section className="keyword-row" aria-label="关键词">
        {RADAR_KEYWORDS.map((keyword) => (
          <span key={keyword}>{keyword}</span>
        ))}
      </section>

      <TopicScriptPlanner topics={topicPlans} />

      <section className="main-grid">
        <div className="content-column">
          <section className="panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">热门笔记池</p>
                <h2>当前批次热门内容</h2>
              </div>
              {topNote ? <span className="badge">最高热度 {topNote.heatScore}</span> : null}
            </div>

            <div className="note-list">
              {notes.map((note, index) => (
                <article className="note-card" key={`${note.sourceNoteId}-${note.keyword}`}>
                  <div className="rank">{index + 1}</div>
                  <div className="note-body">
                    <div className="note-meta">
                      <span>{note.keyword}</span>
                      <span>{note.authorName}</span>
                      <span>{formatDateTime(note.publishedAt)}</span>
                    </div>
                    <h3>{note.title}</h3>
                    <p>{note.content}</p>
                    <div className="stat-row">
                      <span>赞 {numberFormat(note.likeCount)}</span>
                      <span>评 {numberFormat(note.commentCount)}</span>
                      <span>藏 {numberFormat(note.collectCount)}</span>
                      <span>热度 {note.heatScore}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="insight-column">
          <section className="panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">爆款洞察</p>
                <h2>本批规律总结</h2>
              </div>
            </div>
            <p className="summary">{analysis?.summary}</p>
            <ul className="clean-list">
              {analysis?.viralPatterns.map((pattern) => <li key={pattern}>{pattern}</li>)}
            </ul>
          </section>

          <section className="panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">标题公式</p>
                <h2>可复用标题结构</h2>
              </div>
            </div>
            <div className="formula-list">
              {analysis?.titleFormulas.map((formula) => (
                <article key={formula.name}>
                  <h3>{formula.name}</h3>
                  <p className="formula">{formula.formula}</p>
                  <p>{formula.whyItWorks}</p>
                </article>
              ))}
            </div>
          </section>
        </aside>
      </section>

      <section className="production-grid">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">拍摄建议</p>
              <h2>今天怎么拍</h2>
            </div>
          </div>
          <ul className="clean-list">
            {analysis?.shootingSuggestions.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>

        <section className="panel script-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">口播稿</p>
              <h2>可直接录制版本</h2>
            </div>
          </div>
          <p>{analysis?.talkingScript}</p>
        </section>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">短视频分镜</p>
            <h2>镜头节奏拆解</h2>
          </div>
        </div>
        <div className="storyboard">
          {analysis?.storyboard.map((shot, index) => (
            <article key={`${shot.scene}-${index}`}>
              <span>{shot.durationSeconds}s</span>
              <h3>{shot.scene}</h3>
              <p>{shot.visual}</p>
              <strong>{shot.narration}</strong>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
