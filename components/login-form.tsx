"use client";

import { useState } from "react";

type LoginFormProps = {
  hasSetupProblem: boolean;
  hasError: boolean;
};

export function LoginForm({ hasSetupProblem, hasError }: LoginFormProps) {
  const [accessKey, setAccessKey] = useState("");
  const canSubmit = accessKey.trim().length > 0;

  return (
    <form action="/api/auth/login" autoComplete="off" method="post" className="login-form">
      {hasSetupProblem ? (
        <div className="setup-warning">
          <strong>后台暂未完成初始化</strong>
          <p>如果无法进入后台，请检查部署配置后重新部署。</p>
        </div>
      ) : null}

      <label htmlFor="accessKeyInput">访问密钥</label>
      <input name="accessKey" type="hidden" value={accessKey} />
      <input
        aria-label="访问密钥"
        autoCapitalize="none"
        autoComplete="off"
        autoCorrect="off"
        autoFocus
        className="masked-access-key"
        data-1p-ignore="true"
        data-form-type="other"
        data-lpignore="true"
        id="accessKeyInput"
        inputMode="text"
        name="accessKeyDisplay"
        onChange={(event) => setAccessKey(event.target.value)}
        placeholder="请输入访问密钥"
        spellCheck={false}
        type="text"
        value={accessKey}
      />
      {hasError ? <span className="login-error">密钥不正确，请重新输入。</span> : null}
      <button disabled={!canSubmit} type="submit">
        进入后台
      </button>
    </form>
  );
}
