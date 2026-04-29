import { useState } from "react";

export default function Login({ onLogin }: { onLogin: (u: string, p: string) => Promise<void> }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onLogin(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-box" onSubmit={handleSubmit}>
        <div className="login-title">&lt;StrongPlay CRM/&gt;</div>
        {error && <div className="login-error">{error}</div>}
        <div className="crm-form-group">
          <label className="crm-label">Логин</label>
          <input
            className="crm-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </div>
        <div className="crm-form-group">
          <label className="crm-label">Пароль</label>
          <input
            className="crm-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        <button className="crm-btn" style={{ width: "100%", marginTop: "1rem" }} disabled={loading}>
          {loading ? "Входим..." : "Войти"}
        </button>
      </form>
    </div>
  );
}
