import { NavLink } from "react-router-dom";

export default function Layout({ children, onLogout }: { children: React.ReactNode; onLogout: () => void }) {
  return (
    <div className="crm-layout">
      <aside className="crm-sidebar">
        <div className="crm-sidebar-logo">&lt;StrongPlay CRM/&gt;</div>
        <nav className="crm-sidebar-nav">
          <NavLink to="/" end className={({ isActive }) => `crm-nav-link ${isActive ? "active" : ""}`}>
            Дашборд
          </NavLink>
          <NavLink to="/teams" className={({ isActive }) => `crm-nav-link ${isActive ? "active" : ""}`}>
            Команды
          </NavLink>
          <NavLink to="/players" className={({ isActive }) => `crm-nav-link ${isActive ? "active" : ""}`}>
            Игроки
          </NavLink>
          <NavLink to="/games" className={({ isActive }) => `crm-nav-link ${isActive ? "active" : ""}`}>
            Игры
          </NavLink>
          <NavLink to="/gallery" className={({ isActive }) => `crm-nav-link ${isActive ? "active" : ""}`}>
            Галерея
          </NavLink>
          <NavLink to="/news" className={({ isActive }) => `crm-nav-link ${isActive ? "active" : ""}`}>
            Новости
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => `crm-nav-link ${isActive ? "active" : ""}`}>
            Настройки
          </NavLink>
        </nav>
        <div style={{ marginTop: "auto", paddingTop: "2rem", paddingLeft: "0.75rem" }}>
          <button className="logout-btn" onClick={onLogout}>Выйти</button>
        </div>
      </aside>
      <main className="crm-main">{children}</main>
    </div>
  );
}
