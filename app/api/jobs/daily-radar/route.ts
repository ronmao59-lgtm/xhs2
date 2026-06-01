import { NextRequest, NextResponse } from "next/server";
import { DASHBOARD_AUTH_COOKIE, getAdminAccessKey } from "@/lib/auth";
import { appConfig } from "@/lib/config";
import { runDailyRadar } from "@/lib/radar/run-daily-radar";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function isAuthorized(request: NextRequest) {
  if (!appConfig.cronSecret) return process.env.NODE_ENV !== "production";

  const authHeader = request.headers.get("authorization");
  const dashboardCookie = request.cookies.get(DASHBOARD_AUTH_COOKIE)?.value;

  return (
    authHeader === `Bearer ${appConfig.cronSecret}` ||
    dashboardCookie === getAdminAccessKey()
  );
}

function getHelpfulError(error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error
        ? JSON.stringify(error)
        : String(error || "Unknown error");

  if (message.includes("run_id") || message.includes("onConflict")) {
    return {
      error: "Daily radar job failed",
      message,
      nextStep:
        "请先在 Supabase SQL Editor 运行 supabase/20260531_add_run_id_to_notes.sql，然后再触发任务。"
    };
  }

  return {
    error: "Daily radar job failed",
    message
  };
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      {
        error: "Unauthorized",
        message: "请先登录后台，或使用 Authorization: Bearer <CRON_SECRET> 调用。"
      },
      { status: 401 }
    );
  }

  try {
    const result = await runDailyRadar();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Daily radar job failed", error);
    return NextResponse.json(getHelpfulError(error), { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
