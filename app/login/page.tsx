import { getMissingProductionEnvVars } from "@/lib/deployment";
import { isDashboardAuthed } from "@/lib/auth";
import { redirect } from "next/navigation";

export default function LoginPage({
  searchParams
}: {
  searchParams?: { error?: string; setup?: string };
}) {
  if (isDashboardAuthed()) {
    redirect("/");
  }

  const missingEnvVars = getMissingProductionEnvVars();
  const hasSetupProblem = missingEnvVars.length > 0 || searchParams?.setup;

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

          <form action="/api/auth/login" method="post" className="login-form">
            {hasSetupProblem ? (
              <div className="setup-warning">
                <strong>线上部署还缺少环境变量</strong>
                <p>请先到 Vercel 项目的 Settings - Environment Variables 补齐：</p>
                <ul>
                  {missingEnvVars.length > 0 ? (
                    missingEnvVars.map((name) => <li key={name}>{name}</li>)
                  ) : (
                    <li>ADMIN_ACCESS_KEY</li>
                  )}
                </ul>
                <p>保存后需要重新 Redeploy，变量才会生效。</p>
              </div>
            ) : null}

            <label htmlFor="accessKey">访问密钥</label>
            <input
              autoComplete="current-password"
              autoFocus
              disabled={Boolean(hasSetupProblem)}
              id="accessKey"
              name="accessKey"
              placeholder="请输入访问密钥"
              type="password"
            />
            {searchParams?.error ? (
              <span className="login-error">密钥不正确，请重新输入。</span>
            ) : null}
            <button disabled={Boolean(hasSetupProblem)} type="submit">
              进入后台
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
