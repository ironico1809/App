import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar_fixed.css';

const Sidebar = () => {
  const location = useLocation();
  const asideRef = useRef(null);
  const [collapsed, setCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Start with sidebar hidden by default
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showHint, setShowHint] = useState(true);
  const [openUsers, setOpenUsers] = useState(
    location.pathname === '/usuarios' || location.pathname === '/roles'
  );
  const [openFinance, setOpenFinance] = useState(location.pathname.startsWith('/finanzas'));

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      // No auto-open sidebar on resize - let user control it
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Hide hint after a few seconds
  useEffect(() => {
    if (!isMobile && !isOpen && showHint) {
      const timer = setTimeout(() => {
        setShowHint(false);
      }, 5000); // Hide after 5 seconds
      
      return () => clearTimeout(timer);
    }
  }, [isMobile, isOpen, showHint]);

  useEffect(() => {
    if (collapsed) {
      setOpenUsers(false);
      setOpenFinance(false);
    }
  }, [collapsed]);

  // Update app content margin based on sidebar state
  useEffect(() => {
    const appContent = document.querySelector('.app-content');
    if (appContent) {
      appContent.className = 'app-content';
      
      if (!isMobile && isOpen) {
        if (collapsed) {
          appContent.classList.add('sidebar-collapsed');
        } else {
          appContent.classList.add('sidebar-open');
        }
      }
    }
  }, [isOpen, collapsed, isMobile]);

  const toggleSidebar = () => {
    setShowHint(false); // Hide hint when user interacts

    if (isMobile) {
      setIsOpen(!isOpen);
    } else {
      setIsOpen(!isOpen); // Ensure full toggle without partial collapse
      setCollapsed(false); // Always reset collapsed state when toggling
    }
  };

  const hideSidebar = () => {
    if (!isMobile) {
      setIsOpen(false);
      setCollapsed(false);
    } else {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!asideRef.current) return;
      if (!asideRef.current.contains(e.target)) {
        setOpenUsers(false);
        setOpenFinance(false);
        // Close sidebar on mobile when clicking outside
        if (isMobile && isOpen) {
          setIsOpen(false);
        }
      }
    };
    
    // Close sidebar on escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        if (isMobile) {
          setIsOpen(false);
        } else {
          hideSidebar();
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, isMobile]);

  const icons = {
    dashboard: <span className="sidebar-link-icon" role="img" aria-label="Dashboard">🏠</span>,
    users: <span className="sidebar-link-icon" role="img" aria-label="Usuarios">👥</span>,
    user: <span className="sidebar-link-icon" role="img" aria-label="Gestionar Usuarios">👤</span>,
    roles: <span className="sidebar-link-icon" role="img" aria-label="Roles">🛡️</span>,
    finance: <span className="sidebar-link-icon" role="img" aria-label="Finanzas">💰</span>,
    pay: <span className="sidebar-link-icon" role="img" aria-label="Pago">💳</span>,
    history: <span className="sidebar-link-icon" role="img" aria-label="Historial">🗾</span>,
    config: <span className="sidebar-link-icon" role="img" aria-label="Config">⚙️</span>,
    services: <span className="sidebar-link-icon" role="img" aria-label="Servicios">🛠️</span>,
  };

  // Determine sidebar CSS classes
  const sidebarClasses = [
    'sidebar',
    isOpen ? 'open' : '', // Use 'open' class for both mobile and desktop
    collapsed && isOpen ? 'collapsed' : '' // Only collapse if open
  ].filter(Boolean).join(' ');

  return (
    <>
      {/* Hamburger toggle button - siempre visible */}
      <button
        className={`sidebar-mobile-toggle ${isOpen ? 'active' : ''}`}
        onClick={toggleSidebar}
        aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
        title={isOpen ? 'Cerrar menú' : 'Abrir menú de navegación'}
      >
        <div className="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      {/* Hint for desktop users when sidebar is hidden */}
      {!isMobile && !isOpen && showHint && (
        <div className="sidebar-hint">
          👆 Haz clic para abrir el menú
        </div>
      )}

      {/* Overlay for mobile */}
      {isMobile && (
        <div 
          className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside ref={asideRef} className={sidebarClasses}>
        <nav className="sidebar-nav">
        <Link
          to="/dashboard"
          className={`sidebar-link${location.pathname === '/dashboard' ? ' active' : ''}`}
        >
          {icons.dashboard}
          <span className="sidebar-link-label">Dashboard</span>
        </Link>

        <div
          className={`sidebar-link sidebar-link-dropdown${openUsers ? ' open' : ''}${['/usuarios', '/roles'].includes(location.pathname) ? ' active' : ''}`}
          onClick={() => {
            if (collapsed) return;
            setOpenUsers((prev) => {
              const next = !prev;
              if (next) setOpenFinance(false);
              return next;
            });
          }}
          tabIndex={0}
          role="button"
          aria-expanded={openUsers}
          onKeyDown={(e) => {
            if (collapsed) return;
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setOpenUsers((prev) => {
                const next = !prev;
                if (next) setOpenFinance(false);
                return next;
              });
            }
          }}
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

        <div
          className={`sidebar-link sidebar-link-dropdown${openFinance ? ' open' : ''}${location.pathname.startsWith('/finanzas') ? ' active' : ''}`}
          onClick={() => {
            if (collapsed) return;
            setOpenFinance((prev) => {
              const next = !prev;
              if (next) setOpenUsers(false);
              return next;
            });
          }}
          tabIndex={0}
          role="button"
          aria-expanded={openFinance}
          onKeyDown={(e) => {
            if (collapsed) return;
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setOpenFinance((prev) => {
                const next = !prev;
                if (next) setOpenUsers(false);
                return next;
              });
            }
          }}
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
    </>
  );
};

export default Sidebar;