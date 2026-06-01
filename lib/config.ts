export const RADAR_KEYWORDS = [
  "AI副业",
  "AI赚钱",
  "AI工具",
  "AI一人公司",
  "个人IP",
  "创业"
] as const;

export type RadarKeyword = (typeof RADAR_KEYWORDS)[number];

export const appConfig = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  openaiApiKey: process.env.OPENAI_API_KEY,
  openaiModel: process.env.OPENAI_MODEL || "gpt-4o-mini",
  cronSecret: process.env.CRON_SECRET,
  adminAccessKey: process.env.ADMIN_ACCESS_KEY,
  dataSource: process.env.DATA_SOURCE || "mock"
};
