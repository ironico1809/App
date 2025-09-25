import React, { useState, useMemo } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Button from '../components/Button';
import Modal from '../components/Modal';
import './ConfigPrecios.css';

// Catálogo unificado con campos del esquema: cuota_servicio y multa
const preciosMock = [
  { id: 1, tipo: 'EXPENSA', nombre: 'Expensa mensual', descripcion: 'Cuota base por unidad habitacional - Incluye mantenimiento de áreas comunes', monto: 350.00, fecha_creacion: '2025-01-01', vigente: true },
  { id: 2, tipo: 'SERVICIO', nombre: 'Servicio de Agua', descripcion: 'Consumo estimado promedio mensual por unidad', monto: 45.50, fecha_creacion: '2025-06-01', vigente: true },
  { id: 3, tipo: 'MULTA', nombre: '', descripcion: 'Multa por ruido nocturno después de las 22:00 hrs', monto: 120.00, fecha_creacion: '2025-07-01', vigente: true },
  { id: 4, tipo: 'SERVICIO', nombre: 'Internet y Cable', descripcion: 'Servicio de internet fibra óptica 100MB + TV cable básico', monto: 85.00, fecha_creacion: '2025-01-15', vigente: true },
  { id: 5, tipo: 'EXPENSA', nombre: 'Seguridad', descripcion: 'Servicio de seguridad 24/7 y monitoreo IA', monto: 180.00, fecha_creacion: '2025-02-01', vigente: true },
  { id: 6, tipo: 'MULTA', nombre: '', descripcion: 'Multa por mascotas sin correa en áreas comunes', monto: 80.00, fecha_creacion: '2025-03-01', vigente: false },
  { id: 7, tipo: 'SERVICIO', nombre: 'Mantenimiento', descripcion: 'Servicio de limpieza y mantenimiento de pasillos', monto: 65.00, fecha_creacion: '2025-04-01', vigente: true },
  { id: 8, tipo: 'MULTA', nombre: '', descripcion: 'Multa por estacionamiento en lugar no autorizado', monto: 150.00, fecha_creacion: '2025-05-01', vigente: true },
];

const tipos = ['Todos', 'EXPENSA', 'SERVICIO', 'MULTA'];

const ConfigPrecios = () => {
  const [q, setQ] = useState('');
  const [tipo, setTipo] = useState('Todos');
  const [soloVigentes, setSoloVigentes] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ tipo: 'EXPENSA', nombre: '', descripcion: '', monto: '', vigente: true });

  const filtrados = useMemo(() => preciosMock.filter(p => {
    const byQ = q === '' || `${p.nombre} ${p.descripcion}`.toLowerCase().includes(q.toLowerCase());
    const byTipo = tipo === 'Todos' || p.tipo === tipo;
    const byVigente = !soloVigentes || p.vigente;
    return byQ && byTipo && byVigente;
  }), [q, tipo, soloVigentes]);

  const limpiar = () => { 
    setQ(''); 
    setTipo('Todos'); 
    setSoloVigentes(true); 
  };

  const openNew = (tipoIni = 'EXPENSA') => { 
    setEditing(null); 
    setForm({ tipo: tipoIni, nombre: '', descripcion: '', monto: '', vigente: true }); 
    setOpenModal(true); 
  };

  const openEdit = (p) => { 
    setEditing(p); 
    setForm({ 
      tipo: p.tipo, 
      nombre: p.nombre || '', 
      descripcion: p.descripcion || '', 
      monto: p.monto,
      vigente: p.vigente 
    }); 
    setOpenModal(true); 
  };

  const save = (e) => { 
    e.preventDefault(); 
    if (!form.tipo || (!form.nombre && form.tipo !== 'MULTA') || !form.monto || !form.descripcion) { 
      alert('Completa todos los campos obligatorios'); 
      return; 
    } 
    setOpenModal(false); 
    alert(editing ? 'Precio actualizado correctamente' : 'Nuevo precio creado exitosamente'); 
  };

  const remove = (p) => { 
    if (window.confirm(`¿Estás seguro de eliminar ${p.tipo.toLowerCase()} "${p.nombre || p.descripcion}"?`)) { 
      alert('Registro eliminado correctamente'); 
    } 
  };

  const toggleVigencia = (p) => {
    alert(`${p.vigente ? 'Desactivando' : 'Activando'} registro: ${p.nombre || p.descripcion}`);
  };

  const getTipoIcon = (tipo) => {
    switch(tipo) {
      case 'EXPENSA': return '🏢';
      case 'SERVICIO': return '⚙️';
      case 'MULTA': return '⚠️';
      default: return '📄';
    }
  };

  const getTipoBadgeClass = (tipo) => {
    switch(tipo) {
      case 'EXPENSA': return 'badge-expensa';
      case 'SERVICIO': return 'badge-servicio';
      case 'MULTA': return 'badge-multa';
      default: return 'badge-default';
    }
  };

  return (
    <DashboardLayout>
      <div className="cp-container">
        {/* Header mejorado */}
        <div className="cp-header">
          <div className="cp-header-content">
            <div className="cp-header-title">
              <h1>Configuración de Precios</h1>
              <p>Gestiona expensas, servicios y multas del condominio de manera inteligente</p>
            </div>
            <div className="cp-header-stats">
              <div className="cp-stat-card">
                <span className="cp-stat-number">{filtrados.filter(p => p.tipo === 'EXPENSA').length}</span>
                <span className="cp-stat-label">Expensas</span>
              </div>
              <div className="cp-stat-card">
                <span className="cp-stat-number">{filtrados.filter(p => p.tipo === 'SERVICIO').length}</span>
                <span className="cp-stat-label">Servicios</span>
              </div>
              <div className="cp-stat-card">
                <span className="cp-stat-number">{filtrados.filter(p => p.tipo === 'MULTA').length}</span>
                <span className="cp-stat-label">Multas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros mejorados */}
        <div className="cp-filters-section">
          <div className="cp-filters-row">
            <div className="cp-search-container">
              <span className="cp-search-icon">🔍</span>
              <input 
                className="cp-input cp-search" 
                placeholder="Buscar por nombre o descripción..." 
                value={q} 
                onChange={e => setQ(e.target.value)} 
              />
            </div>
            
            <div className="cp-filter-controls">
              <select className="cp-select" value={tipo} onChange={e => setTipo(e.target.value)}>
                {tipos.map(t => (
                  <option key={t} value={t}>
                    {t === 'Todos' ? '📋 Todos los tipos' : `${getTipoIcon(t)} ${t}`}
                  </option>
                ))}
              </select>
              
              <label className="cp-checkbox-modern">
                <input 
                  type="checkbox" 
                  checked={soloVigentes} 
                  onChange={e => setSoloVigentes(e.target.checked)} 
                />
                <span className="checkmark">✓</span>
                Solo vigentes
              </label>
              
              <Button className="cp-btn-clear" onClick={limpiar}>
                🗑️ Limpiar filtros
              </Button>
            </div>
          </div>
          
          <div className="cp-action-buttons">
            <Button className="cp-btn-new cp-btn-expensa" onClick={() => openNew('EXPENSA')}>
              + Nueva Expensa
            </Button>
            <Button className="cp-btn-new cp-btn-servicio" onClick={() => openNew('SERVICIO')}>
              + Nuevo Servicio
            </Button>
            <Button className="cp-btn-new cp-btn-multa" onClick={() => openNew('MULTA')}>
              + Nueva Multa
            </Button>
          </div>
        </div>

        {/* Tabla mejorada */}
        <div className="cp-table-container">
          <div className="cp-table-header">
            <h3>📊 Listado de Precios ({filtrados.length} registros)</h3>
            <div className="cp-table-info">
              Total: <span className="cp-total-amount">
                Bs {filtrados.reduce((sum, p) => sum + Number(p.monto), 0).toLocaleString('es-BO', {minimumFractionDigits: 2})}
              </span>
            </div>
          </div>
          
          <div className="cp-table">
            <div className="cp-thead">
              <div className="cp-th-id">ID</div>
              <div className="cp-th-tipo">Tipo</div>
              <div className="cp-th-nombre">Nombre</div>
              <div className="cp-th-descripcion">Descripción</div>
              <div className="cp-th-monto">Monto</div>
              <div className="cp-th-fecha">Fecha</div>
              <div className="cp-th-estado">Estado</div>
              <div className="cp-th-acciones">Acciones</div>
            </div>
            
            {filtrados.length === 0 ? (
              <div className="cp-empty-state">
                <div className="cp-empty-icon">📋</div>
                <h4>No se encontraron registros</h4>
                <p>Intenta modificar los filtros o crear un nuevo registro</p>
              </div>
            ) : (
              filtrados.map(p => (
                <div className={`cp-row ${!p.vigente ? 'cp-row-inactive' : ''}`} key={p.id}>
                  <div className="cp-cell-id">#{p.id}</div>
                  
                  <div className="cp-cell-tipo">
                    <span className={`cp-badge ${getTipoBadgeClass(p.tipo)}`}>
                      {getTipoIcon(p.tipo)} {p.tipo}
                    </span>
                  </div>
                  
                  <div className="cp-cell-nombre">
                    {p.tipo === 'MULTA' ? (
                      <span className="cp-no-name">Sin nombre</span>
                    ) : (
                      <span className="cp-name">{p.nombre}</span>
                    )}
                  </div>
                  
                  <div className="cp-cell-descripcion">
                    <span className="cp-description" title={p.descripcion}>
                      {p.descripcion}
                    </span>
                  </div>
                  
                  <div className="cp-cell-monto">
                    <span className="cp-amount">
                      Bs {Number(p.monto).toLocaleString('es-BO', {minimumFractionDigits: 2})}
                    </span>
                  </div>
                  
                  <div className="cp-cell-fecha">
                    <span className="cp-date">{new Date(p.fecha_creacion).toLocaleDateString('es-BO')}</span>
                  </div>
                  
                  <div className="cp-cell-estado">
                    <button 
                      className={`cp-status-btn ${p.vigente ? 'cp-status-active' : 'cp-status-inactive'}`}
                      onClick={() => toggleVigencia(p)}
                      title={`Click para ${p.vigente ? 'desactivar' : 'activar'}`}
                    >
                      {p.vigente ? '✅ Vigente' : '❌ Inactivo'}
                    </button>
                  </div>
                  
                  <div className="cp-cell-acciones">
                    <div className="cp-actions">
                      <Button 
                        className="cp-btn-edit" 
                        onClick={() => openEdit(p)}
                        title="Editar registro"
                      >
                        ✏️
                      </Button>
                      <Button 
                        className="cp-btn-delete" 
                        onClick={() => remove(p)}
                        title="Eliminar registro"
                      >
                        🗑️
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modal mejorado */}
        <Modal 
          open={openModal} 
          title={
            <div className="cp-modal-title">
              {editing ? '✏️ Editar Registro' : '➕ Nuevo Registro'}
              <span className="cp-modal-subtitle">
                {editing ? `Modificando ${editing.tipo.toLowerCase()}` : 'Creando nuevo precio'}
              </span>
            </div>
          } 
          onClose={() => setOpenModal(false)}
          className="cp-modal"
        >
          <form onSubmit={save} className="cp-form">
            <div className="cp-form-grid">
              <div className="cp-field">
                <label className="cp-label">
                  <span className="cp-label-icon">📂</span>
                  Tipo de registro <span className="cp-required">*</span>
                </label>
                <select 
                  className="cp-input"
                  value={form.tipo} 
                  onChange={e => setForm({...form, tipo: e.target.value})}
                >
                  <option value="EXPENSA">{getTipoIcon('EXPENSA')} EXPENSA</option>
                  <option value="SERVICIO">{getTipoIcon('SERVICIO')} SERVICIO</option>
                  <option value="MULTA">{getTipoIcon('MULTA')} MULTA</option>
                </select>
              </div>

              {form.tipo !== 'MULTA' && (
                <div className="cp-field">
                  <label className="cp-label">
                    <span className="cp-label-icon">📝</span>
                    Nombre <span className="cp-required">*</span>
                  </label>
                  <input 
                    className="cp-input"
                    value={form.nombre} 
                    onChange={e => setForm({...form, nombre: e.target.value})} 
                    placeholder="Ej. Expensa mensual, Servicio de agua..."
                  />
                </div>
              )}

              <div className="cp-field cp-field-full">
                <label className="cp-label">
                  <span className="cp-label-icon">📄</span>
                  Descripción <span className="cp-required">*</span>
                </label>
                <textarea 
                  className="cp-textarea"
                  value={form.descripcion} 
                  onChange={e => setForm({...form, descripcion: e.target.value})} 
                  placeholder="Descripción detallada del concepto..."
                  rows="3"
                />
              </div>

              <div className="cp-field">
                <label className="cp-label">
                  <span className="cp-label-icon">💰</span>
                  Monto (Bs) <span className="cp-required">*</span>
                </label>
                <input 
                  className="cp-input"
                  type="number" 
                  step="0.01" 
                  min="0"
                  value={form.monto} 
                  onChange={e => setForm({...form, monto: e.target.value})} 
                  placeholder="0.00"
                />
              </div>

              <div className="cp-field">
                <label className="cp-label">
                  <span className="cp-label-icon">⚡</span>
                  Estado inicial
                </label>
                <div className="cp-toggle-container">
                  <label className="cp-toggle">
                    <input 
                      type="checkbox" 
                      checked={form.vigente} 
                      onChange={e => setForm({...form, vigente: e.target.checked})}
                    />
                    <span className="cp-toggle-slider"></span>
                    <span className="cp-toggle-label">
                      {form.vigente ? '✅ Vigente' : '❌ Inactivo'}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="cp-form-actions">
              <Button 
                className="cp-btn-cancel" 
                type="button" 
                onClick={() => setOpenModal(false)}
              >
                ❌ Cancelar
              </Button>
              <Button 
                className="cp-btn-save" 
                type="submit"
              >
                {editing ? '💾 Guardar cambios' : '➕ Crear registro'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default ConfigPrecios;