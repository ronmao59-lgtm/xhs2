# 小红书爆款内容雷达系统

Next.js + TypeScript + Supabase + OpenAI API 的内容雷达后台。

## 本地启动

```bash
npm install
npm run dev
```

## 环境变量

复制 `.env.example` 为 `.env.local`，填写：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `CRON_SECRET`

没有 Supabase 和 OpenAI Key 时，系统会使用模拟数据展示后台。

## 数据库

在 Supabase SQL Editor 执行 `supabase/schema.sql`。

## 定时任务

`vercel.json` 已配置每天 UTC 01:00 调用：

```text
/api/jobs/daily-radar
```

生产环境请设置 `CRON_SECRET`，并让定时请求携带：

```text
Authorization: Bearer <CRON_SECRET>
```

## 数据源说明

默认 `DATA_SOURCE=mock`。真实小红书数据接入位于 `lib/sources/xhs-source.ts`，当前故意禁用。请在确认授权、平台条款和账号风控后，再接入授权 API、导出数据或合规第三方数据源。
