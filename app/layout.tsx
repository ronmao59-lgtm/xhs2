import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "小红书爆款内容雷达",
  description: "AI 方向小红书热门内容监控与创作建议后台"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
