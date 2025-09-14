import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const [openUsers, setOpenUsers] = useState(
    location.pathname === '/usuarios' || location.pathname === '/roles'
  );
  const [openFinance, setOpenFinance] = useState(location.pathname.startsWith('/finanzas'));
  const [collapsed, setCollapsed] = useState(false);

  // Icon set (puedes cambiar los emojis por SVG si lo prefieres)
  const icons = {
    dashboard: <span className="sidebar-link-icon" role="img" aria-label="Dashboard">🏠</span>,
    users: <span className="sidebar-link-icon" role="img" aria-label="Usuarios">👥</span>,
    user: <span className="sidebar-link-icon" role="img" aria-label="Gestionar Usuarios">👤</span>,
    roles: <span className="sidebar-link-icon" role="img" aria-label="Roles">🛡️</span>,
    finance: <span className="sidebar-link-icon" role="img" aria-label="Finanzas">💰</span>,
    pay: <span className="sidebar-link-icon" role="img" aria-label="Pago">💳</span>,
    history: <span className="sidebar-link-icon" role="img" aria-label="Historial">🧾</span>,
    config: <span className="sidebar-link-icon" role="img" aria-label="Config">⚙️</span>,
    services: <span className="sidebar-link-icon" role="img" aria-label="Servicios">🛠️</span>,
  };

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      <div className="sidebar-logo">
        <img
          src={process.env.PUBLIC_URL + '/logo.png'}
          alt="Logo"
          className="sidebar-logo-img"
        />
        {!collapsed && (
          <span className="sidebar-title">
            Smart <span className="accent">Condominium</span>
          </span>
        )}
        <button
          className="sidebar-toggle-btn"
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral'}
        >
          {/* Ícono hamburguesa (3 líneas) */}
          <span className="sidebar-hamburger">
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>
      <nav className="sidebar-nav">
        <Link
          to="/dashboard"
          className={`sidebar-link${location.pathname === '/dashboard' ? ' active' : ''}`}
        >
          {icons.dashboard}
          <span className="sidebar-link-label">Dashboard</span>
        </Link>

        {/* USUARIOS DROPDOWN */}
        <div
          className={`sidebar-link sidebar-link-dropdown${openUsers ? ' open' : ''}${['/usuarios', '/roles'].includes(location.pathname) ? ' active' : ''}`}
          onClick={() => setOpenUsers((v) => !v)}
          tabIndex={0}
          role="button"
          aria-expanded={openUsers}
        >
          {icons.users}
          <span className="sidebar-link-label">Administración de Usuarios</span>
          <span className={`sidebar-dropdown-arrow${openUsers ? ' open' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        <div className={`sidebar-dropdown-menu${openUsers ? ' open' : ''}`}>
          <Link
            to="/usuarios"
            className={`sidebar-sublink${location.pathname === '/usuarios' ? ' active' : ''}`}
            tabIndex={openUsers ? 0 : -1}
          >
            {icons.user}
            <span className="sidebar-link-label">Gestionar Usuarios</span>
          </Link>
          <Link
            to="/roles"
            className={`sidebar-sublink${location.pathname === '/roles' ? ' active' : ''}`}
            tabIndex={openUsers ? 0 : -1}
          >
            {icons.roles}
            <span className="sidebar-link-label">Roles y Permisos</span>
          </Link>
        </div>

        {/* FINANZAS DROPDOWN */}
        <div
          className={`sidebar-link sidebar-link-dropdown${openFinance ? ' open' : ''}${location.pathname.startsWith('/finanzas') ? ' active' : ''}`}
          onClick={() => setOpenFinance((v) => !v)}
          tabIndex={0}
          role="button"
          aria-expanded={openFinance}
        >
          {icons.finance}
          <span className="sidebar-link-label">Gestión Financiera</span>
          <span className={`sidebar-dropdown-arrow${openFinance ? ' open' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        <div className={`sidebar-dropdown-menu${openFinance ? ' open' : ''}`}>
          <Link
            to="/finanzas/pagos"
            className={`sidebar-sublink${location.pathname === '/finanzas/pagos' ? ' active' : ''}`}
            tabIndex={openFinance ? 0 : -1}
          >
            {icons.pay}
            <span className="sidebar-link-label">Pago en línea</span>
          </Link>
          <Link
            to="/finanzas/historial"
            className={`sidebar-sublink${location.pathname === '/finanzas/historial' ? ' active' : ''}`}
            tabIndex={openFinance ? 0 : -1}
          >
            {icons.history}
            <span className="sidebar-link-label">Historial &amp; comprobantes</span>
          </Link>
          <Link
            to="/finanzas/config-precios"
            className={`sidebar-sublink${location.pathname === '/finanzas/config-precios' ? ' active' : ''}`}
            tabIndex={openFinance ? 0 : -1}
          >
            {icons.config}
            <span className="sidebar-link-label">Configurar precios</span>
          </Link>
          <Link
            to="/finanzas/cuotas-servicios"
            className={`sidebar-sublink${location.pathname === '/finanzas/cuotas-servicios' ? ' active' : ''}`}
            tabIndex={openFinance ? 0 : -1}
          >
            {icons.services}
            <span className="sidebar-link-label">Cuotas y servicios</span>
          </Link>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;