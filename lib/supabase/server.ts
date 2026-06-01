import { createClient } from "@supabase/supabase-js";
import { appConfig } from "@/lib/config";

export function createSupabaseAdmin() {
  if (!appConfig.supabaseUrl || !appConfig.supabaseServiceRoleKey) {
    throw new Error("Missing Supabase admin environment variables.");
  }

  return createClient(appConfig.supabaseUrl, appConfig.supabaseServiceRoleKey, {
    auth: {
      persistSession: false
    }
  });
}

export function createSupabaseBrowser() {
  if (!appConfig.supabaseUrl || !appConfig.supabaseAnonKey) {
    return null;
  }

  return createClient(appConfig.supabaseUrl, appConfig.supabaseAnonKey);
}
