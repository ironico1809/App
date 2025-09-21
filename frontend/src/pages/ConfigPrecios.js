import React, { useState, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import Modal from '../components/Modal';
import './ConfigPrecios.css';

// Catálogo unificado con campos del esquema: cuota_servicio y multa
// cuota_servicio: { id_cuota, nombre, descripcion, monto, tipo: 'EXPENSA'|'SERVICIO', fecha_creacion }
// multa: { id_multa, descripcion, monto, fecha_creacion }
const preciosMock = [
  { id: 1, tipo: 'EXPENSA', nombre: 'Expensa mensual', descripcion: 'Cuota base por unidad', monto: 350.00, fecha_creacion: '2025-01-01' },
  { id: 2, tipo: 'SERVICIO', nombre: 'Servicio de Agua', descripcion: 'Consumo estimado promedio', monto: 45.50, fecha_creacion: '2025-06-01' },
  { id: 3, tipo: 'MULTA', nombre: '', descripcion: 'Multa por ruido nocturno', monto: 120.00, fecha_creacion: '2025-07-01' },
];

const tipos = ['Todos', 'EXPENSA', 'SERVICIO', 'MULTA'];

const ConfigPrecios = () => {
  const [q, setQ] = useState('');
  const [tipo, setTipo] = useState('Todos');
  const [soloVigentes, setSoloVigentes] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ tipo: 'EXPENSA', nombre: '', descripcion: '', monto: '' });

  const filtrados = useMemo(() => preciosMock.filter(p => {
    const byQ = q === '' || `${p.nombre} ${p.descripcion}`.toLowerCase().includes(q.toLowerCase());
    const byTipo = tipo === 'Todos' || p.tipo === tipo;
    return byQ && byTipo;
  }), [q, tipo]);

  const limpiar = () => { setQ(''); setTipo('Todos'); setSoloVigentes(true); };

  const openNew = (tipoIni = 'EXPENSA') => { setEditing(null); setForm({ tipo: tipoIni, nombre: '', descripcion: '', monto: '' }); setOpenModal(true); };
  const openEdit = (p) => { setEditing(p); setForm({ tipo: p.tipo, nombre: p.nombre || '', descripcion: p.descripcion || '', monto: p.monto }); setOpenModal(true); };
  const save = (e) => { e.preventDefault(); if (!form.tipo || (!form.nombre && form.tipo !== 'MULTA') || !form.monto) { alert('Completa los campos obligatorios'); return; } setOpenModal(false); alert(editing ? 'Precio actualizado (mock)' : 'Precio creado (mock)'); };
  const remove = (p) => { if (window.confirm(`¿Eliminar ${p.tipo.toLowerCase()} "${p.nombre || p.descripcion}"?`)) { alert('Eliminado (mock)'); } };

  return (
    <div className="cp-bg" style={{display:'flex'}}>
      <Sidebar />
  <div className="app-content">
        <div className="cp-container">
          <div className="cp-header">
            <h1>Configurar precios de expensas y multas</h1>
            <p>Agrega, modifica o desactiva precios con fechas de vigencia.</p>
          </div>
          <div className="cp-filters">
            <input className="cp-input" placeholder="Buscar por nombre o descripción" value={q} onChange={e=>setQ(e.target.value)} />
            <select className="cp-select" value={tipo} onChange={e=>setTipo(e.target.value)}>
              {tipos.map(t => <option key={t} value={t}>{t === 'Todos' ? 'Tipo' : t}</option>)}
            </select>
            <label className="cp-checkbox"><input type="checkbox" checked={soloVigentes} onChange={e=>setSoloVigentes(e.target.checked)} /> Solo vigentes</label>
            <Button className="outline" onClick={limpiar}>Limpiar</Button>
            <Button onClick={() => openNew('EXPENSA')}>+ Nueva cuota/servicio</Button>
            <Button onClick={() => openNew('MULTA')}>+ Nueva multa</Button>
          </div>
          <div className="cp-table">
            <div className="cp-thead">
              <div>ID</div><div>Tipo</div><div>Nombre</div><div>Descripción</div><div>Monto</div><div>Fecha creación</div><div>Acciones</div>
            </div>
            {filtrados.map(p => (
              <div className="cp-row" key={p.id}>
                <div>{p.id}</div>
                <div>{p.tipo}</div>
                <div>{p.tipo === 'MULTA' ? '—' : p.nombre}</div>
                <div>{p.descripcion}</div>
                <div>Bs {Number(p.monto).toLocaleString('es-BO', {minimumFractionDigits:2})}</div>
                <div>{p.fecha_creacion}</div>
                <div className="cp-actions">
                  <Button className="outline small" onClick={() => openEdit(p)}>Editar</Button>
                  <Button className="danger small" onClick={() => remove(p)}>Eliminar</Button>
                </div>
              </div>
            ))}
          </div>
          <Modal open={openModal} title={editing ? 'Editar registro' : 'Nuevo registro'} onClose={() => setOpenModal(false)}>
            <form onSubmit={save}>
              <div className="form-grid">
                <div className="field">
                  <label>Tipo</label>
                  <select value={form.tipo} onChange={e=>setForm({...form, tipo: e.target.value})}>
                    <option value="EXPENSA">EXPENSA</option>
                    <option value="SERVICIO">SERVICIO</option>
                    <option value="MULTA">MULTA</option>
                  </select>
                </div>
                {form.tipo !== 'MULTA' && (
                  <div className="field full">
                    <label>Nombre</label>
                    <input value={form.nombre} onChange={e=>setForm({...form, nombre: e.target.value})} placeholder="Ej. Expensa mensual" />
                  </div>
                )}
                <div className="field full">
                  <label>Descripción</label>
                  <textarea value={form.descripcion} onChange={e=>setForm({...form, descripcion: e.target.value})} placeholder="Descripción breve" />
                </div>
                <div className="field">
                  <label>Monto</label>
                  <input type="number" step="0.01" value={form.monto} onChange={e=>setForm({...form, monto: e.target.value})} placeholder="0.00" />
                </div>
              </div>
              <div className="form-actions">
                <Button className="outline" type="button" onClick={() => setOpenModal(false)}>Cancelar</Button>
                <Button type="submit">{editing ? 'Guardar' : 'Crear'}</Button>
              </div>
            </form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default ConfigPrecios;

