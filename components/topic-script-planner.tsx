"use client";

import { useMemo, useState } from "react";
import type { TopicPlan } from "@/lib/types";

type TopicScriptPlannerProps = {
  topics: TopicPlan[];
};

export function TopicScriptPlanner({ topics }: TopicScriptPlannerProps) {
  const orderedTopics = useMemo(
    () => [...topics].sort((a, b) => a.order - b.order),
    [topics]
  );
  const [selectedId, setSelectedId] = useState(orderedTopics[0]?.id);
  const selectedTopic =
    orderedTopics.find((topic) => topic.id === selectedId) || orderedTopics[0];

  if (!selectedTopic) return null;

  return (
    <section className="panel topic-planner">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">选题排期</p>
          <h2>爆款选题计划与口播生成</h2>
        </div>
        <span className="badge">建议按顺序连播 5 条</span>
      </div>

      <div className="topic-layout">
        <div className="topic-list" aria-label="推荐选题">
          {orderedTopics.map((topic) => (
            <button
              className={topic.id === selectedTopic.id ? "topic-item active" : "topic-item"}
              key={topic.id}
              onClick={() => setSelectedId(topic.id)}
              type="button"
            >
              <span>第 {topic.order} 条</span>
              <strong>{topic.title}</strong>
              <small>{topic.angle}</small>
            </button>
          ))}
        </div>

        <div className="topic-detail">
          <div className="topic-brief">
            <div>
              <span>为什么现在拍</span>
              <p>{selectedTopic.whyNow}</p>
            </div>
            <div>
              <span>目标人群</span>
              <p>{selectedTopic.targetUser}</p>
            </div>
            <div>
              <span>开场钩子</span>
              <p>{selectedTopic.hook}</p>
            </div>
          </div>

          <div className="generated-script">
            <div className="section-title">
              <p className="eyebrow">口播稿</p>
              <h3>{selectedTopic.title}</h3>
            </div>
            <p>{selectedTopic.script}</p>
          </div>

          <div className="mini-storyboard">
            {selectedTopic.storyboard.map((shot, index) => (
              <article key={`${shot.scene}-${index}`}>
                <span>{shot.durationSeconds}s</span>
                <strong>{shot.scene}</strong>
                <p>{shot.visual}</p>
              </article>
            ))}
          </div>

          <div className="cta-box">
            <span>结尾转化</span>
            <strong>{selectedTopic.callToAction}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
