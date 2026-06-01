import { isAdminAccessConfigured, isDashboardAuthed } from "@/lib/auth";
import { LoginForm } from "@/components/login-form";
import { redirect } from "next/navigation";

export default function LoginPage({
  searchParams
}: {
  searchParams?: { error?: string; setup?: string };
}) {
  if (isDashboardAuthed()) {
    redirect("/");
  }

  const hasSetupProblem =
    process.env.NODE_ENV === "production" && !isAdminAccessConfigured();

  return (
    <main className="login-shell">
      <section className="login-panel">
        <div className="login-brand">
          <span>RED</span>
          <div>
            <p className="eyebrow">Private Operations Console</p>
            <h1>小红书内容雷达后台</h1>
          </div>
        </div>

        <div className="login-grid">
          <div className="login-intro">
            <p>
              每天沉淀热门内容、爆款规律、选题计划、口播稿和分镜。这里是你的私有内容运营中台。
            </p>
            <div className="login-tags" aria-label="后台能力">
              <span>云端记忆</span>
              <span>选题排期</span>
              <span>口播生成</span>
            </div>
          </div>

          <LoginForm
            hasError={Boolean(searchParams?.error)}
            hasSetupProblem={Boolean(hasSetupProblem || searchParams?.setup)}
          />
        </div>
      </section>
    </main>
  );
}
