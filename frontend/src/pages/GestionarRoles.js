import React, { useMemo, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Input from '../components/Input';
import Checkbox from '../components/Checkbox';
import Button from '../components/Button';
import './GestionarRoles.css';

const usuariosMock = [
  { id: 1, nombre: 'Juan Pérez', correo: 'juanp@example.com', rol: 'Administrador' },
  { id: 2, nombre: 'María López', correo: 'maria@example.com', rol: 'Propietario' },
  { id: 3, nombre: 'Carlos Gutiérrez', correo: 'carlos@example.com', rol: 'Inquilino' },
  { id: 4, nombre: 'Ana Gómez', correo: 'ana@example.com', rol: 'Personal' },
];

const roles = ['Administrador','Propietario','Inquilino','Personal'];
const permisosBasePorRol = {
  Administrador: 'FULL_ACCESS',
  Propietario: 'REPORTS_VIEW, RESERVAS_MANAGE',
  Inquilino: 'REPORTS_VIEW, RESERVAS_MANAGE',
  Personal: 'REPORTS_VIEW',
};

const permisosAdicionales = [
  { key: 'USERS_READ', label: 'Ver usuarios' },
  { key: 'USERS_WRITE', label: 'Crear/editar usuarios' },
  { key: 'ROLES_MANAGE', label: 'Gestionar roles y permisos' },
  { key: 'FINANCE_READ', label: 'Ver finanzas' },
  { key: 'FINANCE_WRITE', label: 'Registrar pagos' },
  { key: 'RESERVAS_MANAGE', label: 'Gestionar reservas' },
  { key: 'REPORTS_VIEW', label: 'Ver reportes' },
  { key: 'ANNOUNCEMENTS_MANAGE', label: 'Publicar avisos' },
];

const GestionarRoles = () => {
  const [filtro, setFiltro] = useState('');
  const [seleccionado, setSeleccionado] = useState(usuariosMock[2]);
  const [rol, setRol] = useState(seleccionado.rol);
  const [overrides, setOverrides] = useState([]);

  const lista = useMemo(() => {
    return usuariosMock.filter(u =>
      `${u.nombre} ${u.correo}`.toLowerCase().includes(filtro.toLowerCase())
    );
  }, [filtro]);

  const toggleOverride = (key) => {
    setOverrides(arr => arr.includes(key) ? arr.filter(k => k !== key) : [...arr, key]);
  };

  const guardar = () => {
    // Aquí iría la llamada al backend
    console.log('guardar', { userId: seleccionado.id, rol, overrides });
    alert('Cambios guardados (mock)');
  };

  return (
    <DashboardLayout>
      <div className="roles-container">
        <div className="roles-card">
          <div className="page-header">
            <h1>Gestionar Roles y Permisos</h1>
            <p className="roles-subtitle">Selecciona un usuario, asigna un rol y ajusta permisos adicionales si es necesario.</p>
          </div>

          <div className="roles-grid">
            <section className="roles-panel users-list">
              <h2>Usuarios</h2>
              <p className="panel-subtitle">Buscar y seleccionar</p>
              <Input placeholder="Buscar por nombre o correo" value={filtro} onChange={e => setFiltro(e.target.value)} />
              <div className="users-scroll">
                {lista.map(u => (
                  <div
                    key={u.id}
                    className={`user-item${seleccionado.id === u.id ? ' selected' : ''}`}
                    onClick={() => { setSeleccionado(u); setRol(u.rol); setOverrides([]); }}
                  >
                    <div className="user-name">{u.nombre}</div>
                    <div className="user-email">{u.correo}</div>
                    <div className="user-role">Rol: {u.rol}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="roles-panel assignment">
              <h2>Asignación</h2>
              <div className="two-cols">
                <div>
                  <label className="field-label">Usuario seleccionado:</label>
                  <div className="pill">{seleccionado?.nombre || '—'}</div>
                </div>
                <div>
                  <label className="field-label">Permisos base del rol</label>
                  <div className="pill">{permisosBasePorRol[rol] || '—'}</div>
                </div>
              </div>

              <div className="field">
                <label className="field-label">Rol</label>
                <select className="select" value={rol} onChange={e => setRol(e.target.value)}>
                  {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <p className="hint">Permisos efectivos = Permisos del rol + Permisos adicionales asignados al usuario (overrides).</p>
              </div>

              <div className="permissions-grid">
                {permisosAdicionales.map(p => (
                  <div className="perm-item" key={p.key}>
                    <Checkbox
                      checked={overrides.includes(p.key)}
                      onChange={() => toggleOverride(p.key)}
                      label={<span className="perm-label">{p.label} <span className="perm-code">({p.key})</span></span>}
                    />
                  </div>
                ))}
              </div>

              <div className="actions-row">
                <Button className="outline" onClick={() => { setRol(seleccionado.rol); setOverrides([]); }}>Cancelar</Button>
                <Button onClick={guardar}>Guardar cambios</Button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GestionarRoles;
