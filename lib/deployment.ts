import { appConfig } from "@/lib/config";

export function getMissingProductionEnvVars() {
  if (process.env.NODE_ENV !== "production") return [];

  const required = {
    ADMIN_ACCESS_KEY: appConfig.adminAccessKey,
    NEXT_PUBLIC_SUPABASE_URL: appConfig.supabaseUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: appConfig.supabaseAnonKey,
    SUPABASE_SERVICE_ROLE_KEY: appConfig.supabaseServiceRoleKey,
    CRON_SECRET: appConfig.cronSecret
  };

  return Object.entries(required)
    .filter(([, value]) => !value)
    .map(([key]) => key);
}
