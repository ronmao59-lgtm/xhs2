import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { appConfig } from "@/lib/config";

export const DASHBOARD_AUTH_COOKIE = "xhs_radar_access";

export function isAdminAccessConfigured() {
  return Boolean(appConfig.adminAccessKey);
}

export function getAdminAccessKey() {
  return appConfig.adminAccessKey || "dev-local-access-key";
}

export function isDashboardAuthed() {
  if (!isAdminAccessConfigured() && process.env.NODE_ENV === "production") {
    return false;
  }

  return cookies().get(DASHBOARD_AUTH_COOKIE)?.value === getAdminAccessKey();
}

export function requireDashboardAuth() {
  if (!isDashboardAuthed()) {
    redirect("/login");
  }
}
