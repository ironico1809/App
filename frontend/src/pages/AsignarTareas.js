import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import Modal from '../components/Modal';
import './AsignarTareas.css';

// Datos simulados basados en la BD real - tabla activo
const activosMock = [
  { id_activo: 1, nombre: 'Sistema de Climatización Central', tipo: 'HVAC', ubicacion: 'Edificio Principal', estado: 'OPERATIVO' },
  { id_activo: 2, nombre: 'Bomba de Agua Principal', tipo: 'Bomba', ubicacion: 'Cuarto de Máquinas', estado: 'OPERATIVO' },
  { id_activo: 3, nombre: 'Ascensor Torre A', tipo: 'Ascensor', ubicacion: 'Torre A', estado: 'MANTENIMIENTO' },
  { id_activo: 4, nombre: 'Sistema de Seguridad CCTV', tipo: 'Seguridad', ubicacion: 'Perímetro', estado: 'OPERATIVO' },
  { id_activo: 5, nombre: 'Iluminación Áreas Comunes', tipo: 'Eléctrico', ubicacion: 'Lobby', estado: 'OPERATIVO' },
  { id_activo: 6, nombre: 'Sistema de Riego Jardines', tipo: 'Riego', ubicacion: 'Jardines', estado: 'OPERATIVO' }
];

// Datos simulados del personal de mantenimiento - tabla usuario con rol mantenimiento
const personalMock = [
  { id_usuario: 10, nombre: 'Carlos Méndez', especialidad: 'Eléctrico', carga_actual: 2, disponible: true },
  { id_usuario: 11, nombre: 'Ana Torres', especialidad: 'Plomería', carga_actual: 1, disponible: true },
  { id_usuario: 12, nombre: 'Roberto Silva', especialidad: 'HVAC', carga_actual: 3, disponible: true },
  { id_usuario: 13, nombre: 'María González', especialidad: 'General', carga_actual: 4, disponible: false },
  { id_usuario: 14, nombre: 'Diego Morales', especialidad: 'Jardinería', carga_actual: 1, disponible: true },
  { id_usuario: 15, nombre: 'Laura Jiménez', especialidad: 'Limpieza', carga_actual: 2, disponible: true }
];

// Tareas de mantenimiento existentes - tabla tarea_mantenimiento
const tareasMock = [
  { 
    id_tarea: 1, 
    titulo: 'Mantenimiento preventivo HVAC',
    descripcion: 'Revisión y limpieza del sistema de climatización',
    id_activo: 1,
    activo_nombre: 'Sistema de Climatización Central',
    prioridad: 'MEDIA',
    fecha_programada: '2024-02-15',
    fecha_limite: '2024-02-20',
    estado: 'PENDIENTE',
    id_responsable: null,
    responsable_nombre: null
  },
  { 
    id_tarea: 2, 
    titulo: 'Reparación bomba de agua',
    descripcion: 'Cambio de sellos y revisión general',
    id_activo: 2,
    activo_nombre: 'Bomba de Agua Principal',
    prioridad: 'ALTA',
    fecha_programada: '2024-02-10',
    fecha_limite: '2024-02-12',
    estado: 'ASIGNADA',
    id_responsable: 11,
    responsable_nombre: 'Ana Torres'
  },
  { 
    id_tarea: 3, 
    titulo: 'Inspección ascensor',
    descripcion: 'Revisión mensual de seguridad y funcionamiento',
    id_activo: 3,
    activo_nombre: 'Ascensor Torre A',
    prioridad: 'ALTA',
    fecha_programada: '2024-02-08',
    fecha_limite: '2024-02-10',
    estado: 'EN_PROGRESO',
    id_responsable: 10,
    responsable_nombre: 'Carlos Méndez'
  }
];

const prioridades = ['BAJA', 'MEDIA', 'ALTA', 'URGENTE'];
const estados = ['PENDIENTE', 'ASIGNADA', 'EN_PROGRESO', 'COMPLETADA', 'CANCELADA'];

const AsignarTareas = () => {
  const [tareas, setTareas] = useState(tareasMock);
  const [filtroEstado, setFiltroEstado] = useState('TODAS');
  const [filtroPrioridad, setFiltroPrioridad] = useState('TODAS');
  const [filtroPersonal, setFiltroPersonal] = useState('TODOS');
  const [busqueda, setBusqueda] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [modalAsignar, setModalAsignar] = useState(false);
  const [editingTarea, setEditingTarea] = useState(null);
  const [tareaParaAsignar, setTareaParaAsignar] = useState(null);
  
  const [formTarea, setFormTarea] = useState({
    titulo: '',
    descripcion: '',
    id_activo: '',
    prioridad: 'MEDIA',
    fecha_programada: '',
    fecha_limite: ''
  });

  const [formAsignacion, setFormAsignacion] = useState({
    id_responsable: '',
    notas: ''
  });

  const limpiarFiltros = () => {
    setFiltroEstado('TODAS');
    setFiltroPrioridad('TODAS');
    setFiltroPersonal('TODOS');
    setBusqueda('');
  };

  const tareasFiltradas = tareas.filter(tarea => {
    const cumpleBusqueda = !busqueda || 
      tarea.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      tarea.activo_nombre.toLowerCase().includes(busqueda.toLowerCase());
    
    const cumpleEstado = filtroEstado === 'TODAS' || tarea.estado === filtroEstado;
    const cumplePrioridad = filtroPrioridad === 'TODAS' || tarea.prioridad === filtroPrioridad;
    const cumplePersonal = filtroPersonal === 'TODOS' || 
      (filtroPersonal === 'SIN_ASIGNAR' && !tarea.id_responsable) ||
      (filtroPersonal !== 'SIN_ASIGNAR' && tarea.id_responsable === parseInt(filtroPersonal));

    return cumpleBusqueda && cumpleEstado && cumplePrioridad && cumplePersonal;
  });

  const abrirModalTarea = (tarea = null) => {
    if (tarea) {
      setEditingTarea(tarea);
      setFormTarea({
        titulo: tarea.titulo,
        descripcion: tarea.descripcion,
        id_activo: tarea.id_activo,
        prioridad: tarea.prioridad,
        fecha_programada: tarea.fecha_programada,
        fecha_limite: tarea.fecha_limite
      });
    } else {
      setEditingTarea(null);
      setFormTarea({
        titulo: '',
        descripcion: '',
        id_activo: '',
        prioridad: 'MEDIA',
        fecha_programada: '',
        fecha_limite: ''
      });
    }
    setOpenModal(true);
  };

  const abrirModalAsignar = (tarea) => {
    setTareaParaAsignar(tarea);
    setFormAsignacion({
      id_responsable: tarea.id_responsable || '',
      notas: ''
    });
    setModalAsignar(true);
  };

  const guardarTarea = () => {
    const activoSeleccionado = activosMock.find(a => a.id_activo === parseInt(formTarea.id_activo));
    
    if (editingTarea) {
      // Editar tarea existente
      setTareas(prev => prev.map(t => 
        t.id_tarea === editingTarea.id_tarea 
          ? {
              ...t,
              ...formTarea,
              activo_nombre: activoSeleccionado?.nombre || t.activo_nombre
            }
          : t
      ));
    } else {
      // Crear nueva tarea
      const nuevaTarea = {
        id_tarea: Math.max(...tareas.map(t => t.id_tarea)) + 1,
        ...formTarea,
        activo_nombre: activoSeleccionado?.nombre || 'Activo no encontrado',
        estado: 'PENDIENTE',
        id_responsable: null,
        responsable_nombre: null
      };
      setTareas(prev => [nuevaTarea, ...prev]);
    }
    
    setOpenModal(false);
    alert(editingTarea ? 'Tarea actualizada exitosamente' : 'Tarea creada exitosamente');
  };

  const asignarTarea = () => {
    const personalSeleccionado = personalMock.find(p => p.id_usuario === parseInt(formAsignacion.id_responsable));
    
    if (!personalSeleccionado) {
      alert('Debe seleccionar un responsable');
      return;
    }

    if (!personalSeleccionado.disponible) {
      alert('El personal seleccionado no está disponible. Carga actual: ' + personalSeleccionado.carga_actual + ' tareas');
      return;
    }

    // Actualizar tarea
    setTareas(prev => prev.map(t => 
      t.id_tarea === tareaParaAsignar.id_tarea 
        ? {
            ...t,
            id_responsable: parseInt(formAsignacion.id_responsable),
            responsable_nombre: personalSeleccionado.nombre,
            estado: 'ASIGNADA'
          }
        : t
    ));

    setModalAsignar(false);
    alert(`Tarea asignada a ${personalSeleccionado.nombre}. Notificación enviada.`);
  };

  const cambiarEstadoTarea = (id_tarea, nuevoEstado) => {
    setTareas(prev => prev.map(t => 
      t.id_tarea === id_tarea ? { ...t, estado: nuevoEstado } : t
    ));
    alert(`Estado de tarea cambiado a: ${nuevoEstado}`);
  };

  const getPrioridadClass = (prioridad) => {
    switch(prioridad) {
      case 'BAJA': return 'prioridad-baja';
      case 'MEDIA': return 'prioridad-media';
      case 'ALTA': return 'prioridad-alta';
      case 'URGENTE': return 'prioridad-urgente';
      default: return 'prioridad-media';
    }
  };

  const getEstadoClass = (estado) => {
    switch(estado) {
      case 'PENDIENTE': return 'estado-pendiente';
      case 'ASIGNADA': return 'estado-asignada';
      case 'EN_PROGRESO': return 'estado-progreso';
      case 'COMPLETADA': return 'estado-completada';
      case 'CANCELADA': return 'estado-cancelada';
      default: return 'estado-pendiente';
    }
  };

  return (
    <DashboardLayout>
      <div className="tareas-card">
        <div className="page-header">
          <div className="header-content">
            <div>
              <h1>Asignar Tareas de Mantenimiento</h1>
              <p className="tareas-subtitle">
                Crear y asignar tareas de mantenimiento a personal designado
              </p>
            </div>
            <div className="header-actions">
              <Button 
                onClick={() => abrirModalTarea()}
                className="btn-primary"
              >
                ➕ Nueva Tarea
              </Button>
            </div>
          </div>
        </div>

        {/* Panel de filtros */}
        <div className="filtros-panel">
          <div className="filtros-grid">
            <div className="filtro-group">
              <label>Buscar tarea o activo</label>
              <Input
                type="text"
                placeholder="Buscar por título o activo..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            <div className="filtro-group">
              <label>Estado</label>
              <select 
                value={filtroEstado} 
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="filtro-select"
              >
                <option value="TODAS">Todos los estados</option>
                {estados.map(estado => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </div>

            <div className="filtro-group">
              <label>Prioridad</label>
              <select 
                value={filtroPrioridad} 
                onChange={(e) => setFiltroPrioridad(e.target.value)}
                className="filtro-select"
              >
                <option value="TODAS">Todas las prioridades</option>
                {prioridades.map(prioridad => (
                  <option key={prioridad} value={prioridad}>{prioridad}</option>
                ))}
              </select>
            </div>

            <div className="filtro-group">
              <label>Personal</label>
              <select 
                value={filtroPersonal} 
                onChange={(e) => setFiltroPersonal(e.target.value)}
                className="filtro-select"
              >
                <option value="TODOS">Todo el personal</option>
                <option value="SIN_ASIGNAR">Sin asignar</option>
                {personalMock.map(personal => (
                  <option key={personal.id_usuario} value={personal.id_usuario}>
                    {personal.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="filtros-actions">
            <span className="resultados-count">
              {tareasFiltradas.length} tarea{tareasFiltradas.length !== 1 ? 's' : ''} encontrada{tareasFiltradas.length !== 1 ? 's' : ''}
            </span>
            <Button onClick={limpiarFiltros} className="btn-secondary">
              Limpiar Filtros
            </Button>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="stats-grid">
          <div className="stat-card stat-pendientes">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>{tareas.filter(t => t.estado === 'PENDIENTE').length}</h3>
              <span>Pendientes</span>
            </div>
          </div>
          <div className="stat-card stat-asignadas">
            <div className="stat-icon">👤</div>
            <div className="stat-info">
              <h3>{tareas.filter(t => t.estado === 'ASIGNADA').length}</h3>
              <span>Asignadas</span>
            </div>
          </div>
          <div className="stat-card stat-progreso">
            <div className="stat-icon">🔧</div>
            <div className="stat-info">
              <h3>{tareas.filter(t => t.estado === 'EN_PROGRESO').length}</h3>
              <span>En Progreso</span>
            </div>
          </div>
          <div className="stat-card stat-urgentes">
            <div className="stat-icon">🚨</div>
            <div className="stat-info">
              <h3>{tareas.filter(t => t.prioridad === 'URGENTE').length}</h3>
              <span>Urgentes</span>
            </div>
          </div>
        </div>

        {/* Lista de tareas */}
        <div className="tareas-lista">
          <div className="lista-header">
            <h2>Tareas de Mantenimiento</h2>
          </div>

          <div className="tabla-container">
            <table className="tabla-tareas">
              <thead>
                <tr>
                  <th>Tarea</th>
                  <th>Activo</th>
                  <th>Prioridad</th>
                  <th>Estado</th>
                  <th>Responsable</th>
                  <th>Fecha Límite</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tareasFiltradas.map(tarea => (
                  <tr key={tarea.id_tarea}>
                    <td>
                      <div className="tarea-info">
                        <strong>{tarea.titulo}</strong>
                        <div className="tarea-descripcion">{tarea.descripcion}</div>
                      </div>
                    </td>
                    <td className="activo-nombre">{tarea.activo_nombre}</td>
                    <td>
                      <span className={`badge-prioridad ${getPrioridadClass(tarea.prioridad)}`}>
                        {tarea.prioridad}
                      </span>
                    </td>
                    <td>
                      <span className={`badge-estado ${getEstadoClass(tarea.estado)}`}>
                        {tarea.estado}
                      </span>
                    </td>
                    <td>
                      {tarea.responsable_nombre || (
                        <span className="sin-asignar">Sin asignar</span>
                      )}
                    </td>
                    <td className="fecha-limite">{tarea.fecha_limite}</td>
                    <td>
                      <div className="acciones-tarea">
                        {!tarea.id_responsable && (
                          <Button 
                            onClick={() => abrirModalAsignar(tarea)}
                            className="btn-asignar"
                            size="small"
                          >
                            Asignar
                          </Button>
                        )}
                        <Button 
                          onClick={() => abrirModalTarea(tarea)}
                          className="btn-editar"
                          size="small"
                        >
                          Editar
                        </Button>
                        {tarea.estado === 'ASIGNADA' && (
                          <Button 
                            onClick={() => cambiarEstadoTarea(tarea.id_tarea, 'EN_PROGRESO')}
                            className="btn-iniciar"
                            size="small"
                          >
                            Iniciar
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Nueva/Editar Tarea */}
        <Modal 
          isOpen={openModal} 
          onClose={() => setOpenModal(false)}
          title={editingTarea ? 'Editar Tarea' : 'Nueva Tarea de Mantenimiento'}
        >
          <div className="modal-form">
            <div className="form-group">
              <label>Título de la tarea *</label>
              <Input
                type="text"
                placeholder="Ej: Mantenimiento preventivo..."
                value={formTarea.titulo}
                onChange={(e) => setFormTarea({...formTarea, titulo: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Descripción *</label>
              <textarea
                placeholder="Descripción detallada de la tarea..."
                value={formTarea.descripcion}
                onChange={(e) => setFormTarea({...formTarea, descripcion: e.target.value})}
                className="form-textarea"
                rows="3"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Activo *</label>
                <select
                  value={formTarea.id_activo}
                  onChange={(e) => setFormTarea({...formTarea, id_activo: e.target.value})}
                  className="form-select"
                  required
                >
                  <option value="">Seleccionar activo</option>
                  {activosMock.map(activo => (
                    <option key={activo.id_activo} value={activo.id_activo}>
                      {activo.nombre} - {activo.ubicacion}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Prioridad *</label>
                <select
                  value={formTarea.prioridad}
                  onChange={(e) => setFormTarea({...formTarea, prioridad: e.target.value})}
                  className="form-select"
                >
                  {prioridades.map(prioridad => (
                    <option key={prioridad} value={prioridad}>{prioridad}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Fecha Programada *</label>
                <Input
                  type="date"
                  value={formTarea.fecha_programada}
                  onChange={(e) => setFormTarea({...formTarea, fecha_programada: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Fecha Límite *</label>
                <Input
                  type="date"
                  value={formTarea.fecha_limite}
                  onChange={(e) => setFormTarea({...formTarea, fecha_limite: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="modal-actions">
              <Button onClick={() => setOpenModal(false)} className="btn-secondary">
                Cancelar
              </Button>
              <Button onClick={guardarTarea} className="btn-primary">
                {editingTarea ? 'Actualizar' : 'Crear'} Tarea
              </Button>
            </div>
          </div>
        </Modal>

        {/* Modal Asignar Tarea */}
        <Modal 
          isOpen={modalAsignar} 
          onClose={() => setModalAsignar(false)}
          title="Asignar Tarea de Mantenimiento"
        >
          <div className="modal-form">
            {tareaParaAsignar && (
              <div className="tarea-asignar-info">
                <h3>{tareaParaAsignar.titulo}</h3>
                <p><strong>Activo:</strong> {tareaParaAsignar.activo_nombre}</p>
                <p><strong>Prioridad:</strong> <span className={`badge-prioridad ${getPrioridadClass(tareaParaAsignar.prioridad)}`}>
                  {tareaParaAsignar.prioridad}
                </span></p>
              </div>
            )}

            <div className="form-group">
              <label>Personal Responsable *</label>
              <select
                value={formAsignacion.id_responsable}
                onChange={(e) => setFormAsignacion({...formAsignacion, id_responsable: e.target.value})}
                className="form-select"
                required
              >
                <option value="">Seleccionar responsable</option>
                {personalMock.map(personal => (
                  <option 
                    key={personal.id_usuario} 
                    value={personal.id_usuario}
                    disabled={!personal.disponible}
                  >
                    {personal.nombre} - {personal.especialidad} 
                    {personal.disponible 
                      ? ` (${personal.carga_actual} tareas)` 
                      : ' (No disponible)'
                    }
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Notas adicionales</label>
              <textarea
                placeholder="Instrucciones especiales o comentarios..."
                value={formAsignacion.notas}
                onChange={(e) => setFormAsignacion({...formAsignacion, notas: e.target.value})}
                className="form-textarea"
                rows="3"
              />
            </div>

            <div className="modal-actions">
              <Button onClick={() => setModalAsignar(false)} className="btn-secondary">
                Cancelar
              </Button>
              <Button onClick={asignarTarea} className="btn-primary">
                Asignar Tarea
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default AsignarTareas;