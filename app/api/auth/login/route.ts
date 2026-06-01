import { NextResponse } from "next/server";
import {
  DASHBOARD_AUTH_COOKIE,
  getAdminAccessKey,
  isAdminAccessConfigured
} from "@/lib/auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const accessKey = String(formData.get("accessKey") || "").trim();
  const hasAccessKey =
    isAdminAccessConfigured() || process.env.NODE_ENV !== "production";
  if (!hasAccessKey) {
    return NextResponse.redirect(new URL("/login?setup=1", request.url), {
      status: 303
    });
  }

  const isValid = accessKey === getAdminAccessKey();
  const redirectUrl = new URL(isValid ? "/" : "/login?error=1", request.url);
  const response = NextResponse.redirect(redirectUrl, { status: 303 });

  if (isValid) {
    response.cookies.set(DASHBOARD_AUTH_COOKIE, accessKey, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
      path: "/"
    });
  }

  return response;
}
