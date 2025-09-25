import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import Modal from '../components/Modal';
import './ConfigurarDisponibilidad.css';

const diasSemana = [
  { id: 'lunes', nombre: 'Lunes' },
  { id: 'martes', nombre: 'Martes' },
  { id: 'miercoles', nombre: 'Miércoles' },
  { id: 'jueves', nombre: 'Jueves' },
  { id: 'viernes', nombre: 'Viernes' },
  { id: 'sabado', nombre: 'Sábado' },
  { id: 'domingo', nombre: 'Domingo' }
];

const horariosBase = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
];

const ConfigurarDisponibilidad = () => {
  const [activeTab, setActiveTab] = useState('areas');
  const [areas, setAreas] = useState([
    {
      id: 1,
      nombre: 'Salón de Eventos',
      descripcion: 'Espacio amplio ideal para celebraciones',
      aforoMaximo: 50,
      tarifa: 150.00,
      estado: 'ACTIVO',
      reglas: 'No se permite música después de las 22:00. Limpieza incluida.',
      horarios: {
        lunes: { activo: true, apertura: '08:00', cierre: '22:00', slots: 2 },
        martes: { activo: true, apertura: '08:00', cierre: '22:00', slots: 2 },
        miercoles: { activo: true, apertura: '08:00', cierre: '22:00', slots: 2 },
        jueves: { activo: true, apertura: '08:00', cierre: '22:00', slots: 2 },
        viernes: { activo: true, apertura: '08:00', cierre: '22:00', slots: 2 },
        sabado: { activo: true, apertura: '08:00', cierre: '23:00', slots: 2 },
        domingo: { activo: false, apertura: '', cierre: '', slots: 2 }
      }
    },
    {
      id: 2,
      nombre: 'Cancha de Tenis',
      descripcion: 'Cancha profesional con iluminación',
      aforoMaximo: 4,
      tarifa: 25.00,
      estado: 'ACTIVO',
      reglas: 'Máximo 2 horas por reserva. Traer raquetas propias.',
      horarios: {
        lunes: { activo: true, apertura: '06:00', cierre: '20:00', slots: 1 },
        martes: { activo: true, apertura: '06:00', cierre: '20:00', slots: 1 },
        miercoles: { activo: true, apertura: '06:00', cierre: '20:00', slots: 1 },
        jueves: { activo: true, apertura: '06:00', cierre: '20:00', slots: 1 },
        viernes: { activo: true, apertura: '06:00', cierre: '20:00', slots: 1 },
        sabado: { activo: true, apertura: '06:00', cierre: '21:00', slots: 1 },
        domingo: { activo: true, apertura: '08:00', cierre: '18:00', slots: 1 }
      }
    }
  ]);

  const [fechasEspeciales, setFechasEspeciales] = useState([
    {
      id: 1,
      fecha: '2025-12-25',
      tipo: 'FERIADO',
      descripcion: 'Navidad - Todas las áreas cerradas',
      afectaAreas: 'TODAS'
    },
    {
      id: 2,
      fecha: '2025-10-15',
      tipo: 'MANTENIMIENTO',
      descripcion: 'Mantenimiento de piscina',
      afectaAreas: [3]
    }
  ]);

  const [selectedArea, setSelectedArea] = useState(null);
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [showSpecialModal, setShowSpecialModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [editingArea, setEditingArea] = useState(null);
  const [editingSpecial, setEditingSpecial] = useState(null);
  const [loading, setLoading] = useState(false);

  const [areaForm, setAreaForm] = useState({
    nombre: '',
    descripcion: '',
    aforoMaximo: 1,
    tarifa: 0,
    reglas: '',
    estado: 'ACTIVO'
  });

  const [specialForm, setSpecialForm] = useState({
    fecha: '',
    tipo: 'FERIADO',
    descripcion: '',
    afectaAreas: 'TODAS',
    areasSeleccionadas: []
  });

  const resetAreaForm = () => {
    setAreaForm({
      nombre: '',
      descripcion: '',
      aforoMaximo: 1,
      tarifa: 0,
      reglas: '',
      estado: 'ACTIVO'
    });
    setEditingArea(null);
  };

  const resetSpecialForm = () => {
    setSpecialForm({
      fecha: '',
      tipo: 'FERIADO',
      descripcion: '',
      afectaAreas: 'TODAS',
      areasSeleccionadas: []
    });
    setEditingSpecial(null);
  };

  const showConfirmation = (message, action) => {
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setShowConfirmModal(true);
  };

  const handleConfirm = async () => {
    if (confirmAction) {
      await confirmAction();
    }
    setShowConfirmModal(false);
    setConfirmAction(null);
    setConfirmMessage('');
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
    setConfirmAction(null);
    setConfirmMessage('');
  };

  const handleAreaChange = (field, value) => {
    setAreaForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSpecialChange = (field, value) => {
    setSpecialForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleHorarioChange = (areaId, dia, field, value) => {
    setAreas(prev => prev.map(area => {
      if (area.id === areaId) {
        return {
          ...area,
          horarios: {
            ...area.horarios,
            [dia]: {
              ...area.horarios[dia],
              [field]: value
            }
          }
        };
      }
      return area;
    }));
  };

  const saveArea = async () => {
    if (!areaForm.nombre.trim()) {
      alert('El nombre del área es obligatorio');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (editingArea) {
        // Editar área existente
        setAreas(prev => prev.map(area => {
          if (area.id === editingArea.id) {
            return { ...area, ...areaForm };
          }
          return area;
        }));
      } else {
        // Crear nueva área
        const newArea = {
          ...areaForm,
          id: Date.now(),
          horarios: diasSemana.reduce((acc, dia) => {
            acc[dia.id] = { activo: true, apertura: '08:00', cierre: '20:00', slots: 1 };
            return acc;
          }, {})
        };
        setAreas(prev => [...prev, newArea]);
      }

      setShowAreaModal(false);
      resetAreaForm();
    } catch (error) {
      console.error('Error guardando área:', error);
      alert('Error al guardar el área');
    } finally {
      setLoading(false);
    }
  };

  const editArea = (area) => {
    setAreaForm({
      nombre: area.nombre,
      descripcion: area.descripcion,
      aforoMaximo: area.aforoMaximo,
      tarifa: area.tarifa,
      reglas: area.reglas,
      estado: area.estado
    });
    setEditingArea(area);
    setShowAreaModal(true);
  };

  const deleteArea = async (areaId) => {
    const deleteAction = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setAreas(prev => prev.filter(area => area.id !== areaId));
      } catch (error) {
        console.error('Error eliminando área:', error);
        alert('Error al eliminar el área');
      } finally {
        setLoading(false);
      }
    };

    showConfirmation('¿Está seguro de eliminar esta área?', deleteAction);
  };

  const saveSpecialDate = async () => {
    if (!specialForm.fecha || !specialForm.descripcion.trim()) {
      alert('Fecha y descripción son obligatorias');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (editingSpecial) {
        setFechasEspeciales(prev => prev.map(fecha => {
          if (fecha.id === editingSpecial.id) {
            return { ...fecha, ...specialForm };
          }
          return fecha;
        }));
      } else {
        const newSpecial = {
          ...specialForm,
          id: Date.now()
        };
        setFechasEspeciales(prev => [...prev, newSpecial]);
      }

      setShowSpecialModal(false);
      resetSpecialForm();
    } catch (error) {
      console.error('Error guardando fecha especial:', error);
      alert('Error al guardar la fecha especial');
    } finally {
      setLoading(false);
    }
  };

  const editSpecialDate = (fecha) => {
    setSpecialForm({
      fecha: fecha.fecha,
      tipo: fecha.tipo,
      descripcion: fecha.descripcion,
      afectaAreas: Array.isArray(fecha.afectaAreas) ? 'SELECCIONADAS' : fecha.afectaAreas,
      areasSeleccionadas: Array.isArray(fecha.afectaAreas) ? fecha.afectaAreas : []
    });
    setEditingSpecial(fecha);
    setShowSpecialModal(true);
  };

  const deleteSpecialDate = async (fechaId) => {
    const deleteAction = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setFechasEspeciales(prev => prev.filter(fecha => fecha.id !== fechaId));
      } catch (error) {
        console.error('Error eliminando fecha especial:', error);
        alert('Error al eliminar la fecha especial');
      } finally {
        setLoading(false);
      }
    };

    showConfirmation('¿Está seguro de eliminar esta fecha especial?', deleteAction);
  };

  const saveConfiguration = async () => {
    setLoading(true);
    try {
      const config = {
        areas,
        fechasEspeciales
      };
      
      console.log('Guardando configuración:', config);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Configuración guardada exitosamente');
    } catch (error) {
      console.error('Error guardando configuración:', error);
      alert('Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="config-container">
        <div className="config-card">
          <div className="page-header">
            <h1>Configurar Disponibilidad y Horarios</h1>
            <p className="config-subtitle">
              Gestione áreas comunes, horarios de funcionamiento y fechas especiales
            </p>
          </div>

          {/* Tabs de navegación */}
          <div className="config-tabs">
            <button 
              className={`tab ${activeTab === 'areas' ? 'active' : ''}`}
              onClick={() => setActiveTab('areas')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Gestión de Áreas
            </button>
            <button 
              className={`tab ${activeTab === 'horarios' ? 'active' : ''}`}
              onClick={() => setActiveTab('horarios')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Horarios y Slots
            </button>
            <button 
              className={`tab ${activeTab === 'especiales' ? 'active' : ''}`}
              onClick={() => setActiveTab('especiales')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Fechas Especiales
            </button>
          </div>

          {/* Tab 1: Gestión de Áreas */}
          {activeTab === 'areas' && (
            <div className="tab-content">
              <div className="section-header">
                <h2>Áreas Comunes</h2>
                <Button onClick={() => setShowAreaModal(true)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5V19M5 12L19 12" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Nueva Área
                </Button>
              </div>

              <div className="areas-list">
                {areas.map(area => (
                  <div key={area.id} className="area-item">
                    <div className="area-info">
                      <div className="area-header">
                        <h3>{area.nombre}</h3>
                        <span className={`status ${area.estado.toLowerCase()}`}>
                          {area.estado}
                        </span>
                      </div>
                      <p className="area-description">{area.descripcion}</p>
                      <div className="area-stats">
                        <span className="stat">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2"/>
                            <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                          {area.aforoMaximo} personas
                        </span>
                        <span className="stat">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="2"/>
                            <path d="M17 5H9.5C8.11929 5 7 6.11929 7 7.5V7.5C7 8.88071 8.11929 10 9.5 10H14.5C15.8807 10 17 11.1193 17 12.5V12.5C17 13.8807 15.8807 15 14.5 15H6" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                          ${area.tarifa}/hora
                        </span>
                      </div>
                    </div>
                    <div className="area-actions">
                      <Button variant="outline" onClick={() => editArea(area)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2"/>
                          <path d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        Editar
                      </Button>
                      <Button variant="outline" onClick={() => deleteArea(area.id)} className="delete">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2"/>
                          <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Horarios y Slots */}
          {activeTab === 'horarios' && (
            <div className="tab-content">
              <div className="section-header">
                <h2>Configuración de Horarios</h2>
                <p className="section-subtitle">Configure los horarios de funcionamiento por área y día de la semana</p>
              </div>

              <div className="area-selector">
                <select
                  value={selectedArea?.id || ''}
                  onChange={(e) => setSelectedArea(areas.find(a => a.id === parseInt(e.target.value)))}
                  className="area-select"
                >
                  <option value="">Seleccione un área</option>
                  {areas.map(area => (
                    <option key={area.id} value={area.id}>{area.nombre}</option>
                  ))}
                </select>
              </div>

              {selectedArea && (
                <div className="horarios-config">
                  <div className="area-info-card">
                    <h3>{selectedArea.nombre}</h3>
                    <p>{selectedArea.descripcion}</p>
                  </div>

                  <div className="horarios-grid">
                    {diasSemana.map(dia => (
                      <div key={dia.id} className="dia-config">
                        <div className="dia-header">
                          <label className="checkbox-label">
                            <input
                              type="checkbox"
                              checked={selectedArea.horarios[dia.id]?.activo || false}
                              onChange={(e) => handleHorarioChange(selectedArea.id, dia.id, 'activo', e.target.checked)}
                            />
                            <span className="dia-nombre">{dia.nombre}</span>
                          </label>
                        </div>

                        {selectedArea.horarios[dia.id]?.activo && (
                          <div className="horario-inputs">
                            <div className="input-group">
                              <label>Apertura</label>
                              <select
                                value={selectedArea.horarios[dia.id]?.apertura || '08:00'}
                                onChange={(e) => handleHorarioChange(selectedArea.id, dia.id, 'apertura', e.target.value)}
                                className="time-select"
                              >
                                {horariosBase.map(hora => (
                                  <option key={hora} value={hora}>{hora}</option>
                                ))}
                              </select>
                            </div>

                            <div className="input-group">
                              <label>Cierre</label>
                              <select
                                value={selectedArea.horarios[dia.id]?.cierre || '20:00'}
                                onChange={(e) => handleHorarioChange(selectedArea.id, dia.id, 'cierre', e.target.value)}
                                className="time-select"
                              >
                                {horariosBase.map(hora => (
                                  <option key={hora} value={hora}>{hora}</option>
                                ))}
                              </select>
                            </div>

                            <div className="input-group">
                              <label>Slots (horas)</label>
                              <Input
                                type="number"
                                value={selectedArea.horarios[dia.id]?.slots || 1}
                                onChange={(e) => handleHorarioChange(selectedArea.id, dia.id, 'slots', parseInt(e.target.value))}
                                min={1}
                                max={12}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Fechas Especiales */}
          {activeTab === 'especiales' && (
            <div className="tab-content">
              <div className="section-header">
                <h2>Fechas Especiales</h2>
                <Button onClick={() => setShowSpecialModal(true)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5V19M5 12L19 12" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Nueva Fecha
                </Button>
              </div>

              <div className="especiales-list">
                {fechasEspeciales.map(fecha => (
                  <div key={fecha.id} className="especial-item">
                    <div className="especial-info">
                      <div className="especial-header">
                        <h3>{fecha.descripcion}</h3>
                        <span className={`tipo ${fecha.tipo.toLowerCase()}`}>
                          {fecha.tipo}
                        </span>
                      </div>
                      <div className="especial-details">
                        <span className="fecha">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                            <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                            <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                            <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                          {new Date(fecha.fecha).toLocaleDateString('es-ES')}
                        </span>
                        <span className="areas-afectadas">
                          Afecta: {fecha.afectaAreas === 'TODAS' ? 'Todas las áreas' : `${fecha.afectaAreas.length} área(s)`}
                        </span>
                      </div>
                    </div>
                    <div className="especial-actions">
                      <Button variant="outline" onClick={() => editSpecialDate(fecha)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2"/>
                          <path d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        Editar
                      </Button>
                      <Button variant="outline" onClick={() => deleteSpecialDate(fecha.id)} className="delete">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2"/>
                          <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botón de guardar configuración */}
          <div className="config-actions">
            <Button 
              onClick={saveConfiguration}
              disabled={loading}
              className={`save-config ${loading ? 'loading' : ''}`}
            >
              {loading ? 'Guardando...' : 'Guardar Configuración'}
            </Button>
          </div>
        </div>

        {/* Modal para áreas */}
        {showAreaModal && (
          <Modal onClose={() => { setShowAreaModal(false); resetAreaForm(); }}>
            <div className="modal-content">
              <h2>{editingArea ? 'Editar Área' : 'Nueva Área'}</h2>
              
              <div className="modal-form">
                <div className="form-group">
                  <label>Nombre del área</label>
                  <Input
                    value={areaForm.nombre}
                    onChange={(e) => handleAreaChange('nombre', e.target.value)}
                    placeholder="Nombre del área"
                  />
                </div>

                <div className="form-group">
                  <label>Descripción</label>
                  <textarea
                    value={areaForm.descripcion}
                    onChange={(e) => handleAreaChange('descripcion', e.target.value)}
                    placeholder="Descripción del área"
                    className="form-textarea"
                    rows={3}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Aforo máximo</label>
                    <Input
                      type="number"
                      value={areaForm.aforoMaximo}
                      onChange={(e) => handleAreaChange('aforoMaximo', parseInt(e.target.value))}
                      min={1}
                    />
                  </div>
                  <div className="form-group">
                    <label>Tarifa por hora ($)</label>
                    <Input
                      type="number"
                      value={areaForm.tarifa}
                      onChange={(e) => handleAreaChange('tarifa', parseFloat(e.target.value))}
                      min={0}
                      step={0.01}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Estado</label>
                  <select
                    value={areaForm.estado}
                    onChange={(e) => handleAreaChange('estado', e.target.value)}
                    className="form-select"
                  >
                    <option value="ACTIVO">Activo</option>
                    <option value="INACTIVO">Inactivo</option>
                    <option value="MANTENIMIENTO">En mantenimiento</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Reglas y restricciones</label>
                  <textarea
                    value={areaForm.reglas}
                    onChange={(e) => handleAreaChange('reglas', e.target.value)}
                    placeholder="Reglas y restricciones del área"
                    className="form-textarea"
                    rows={4}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <Button variant="outline" onClick={() => { setShowAreaModal(false); resetAreaForm(); }}>
                  Cancelar
                </Button>
                <Button onClick={saveArea} disabled={loading}>
                  {loading ? 'Guardando...' : (editingArea ? 'Actualizar' : 'Crear')}
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Modal para fechas especiales */}
        {showSpecialModal && (
          <Modal onClose={() => { setShowSpecialModal(false); resetSpecialForm(); }}>
            <div className="modal-content">
              <h2>{editingSpecial ? 'Editar Fecha Especial' : 'Nueva Fecha Especial'}</h2>
              
              <div className="modal-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Fecha</label>
                    <Input
                      type="date"
                      value={specialForm.fecha}
                      onChange={(e) => handleSpecialChange('fecha', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="form-group">
                    <label>Tipo</label>
                    <select
                      value={specialForm.tipo}
                      onChange={(e) => handleSpecialChange('tipo', e.target.value)}
                      className="form-select"
                    >
                      <option value="FERIADO">Feriado</option>
                      <option value="MANTENIMIENTO">Mantenimiento</option>
                      <option value="EVENTO_ESPECIAL">Evento Especial</option>
                      <option value="CIERRE_TEMPORAL">Cierre Temporal</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Descripción</label>
                  <Input
                    value={specialForm.descripcion}
                    onChange={(e) => handleSpecialChange('descripcion', e.target.value)}
                    placeholder="Descripción de la fecha especial"
                  />
                </div>

                <div className="form-group">
                  <label>Áreas afectadas</label>
                  <select
                    value={specialForm.afectaAreas}
                    onChange={(e) => handleSpecialChange('afectaAreas', e.target.value)}
                    className="form-select"
                  >
                    <option value="TODAS">Todas las áreas</option>
                    <option value="SELECCIONADAS">Áreas específicas</option>
                  </select>
                </div>

                {specialForm.afectaAreas === 'SELECCIONADAS' && (
                  <div className="form-group">
                    <label>Seleccione las áreas</label>
                    <div className="areas-checkboxes">
                      {areas.map(area => (
                        <label key={area.id} className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={specialForm.areasSeleccionadas.includes(area.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleSpecialChange('areasSeleccionadas', [...specialForm.areasSeleccionadas, area.id]);
                              } else {
                                handleSpecialChange('areasSeleccionadas', specialForm.areasSeleccionadas.filter(id => id !== area.id));
                              }
                            }}
                          />
                          <span>{area.nombre}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <Button variant="outline" onClick={() => { setShowSpecialModal(false); resetSpecialForm(); }}>
                  Cancelar
                </Button>
                <Button onClick={saveSpecialDate} disabled={loading}>
                  {loading ? 'Guardando...' : (editingSpecial ? 'Actualizar' : 'Crear')}
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Modal de confirmación */}
        {showConfirmModal && (
          <Modal onClose={handleCancel}>
            <div className="modal-content">
              <div className="confirm-modal">
                <div className="confirm-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2"/>
                    <line x1="15" y1="9" x2="9" y2="15" stroke="#ef4444" strokeWidth="2"/>
                    <line x1="9" y1="9" x2="15" y2="15" stroke="#ef4444" strokeWidth="2"/>
                  </svg>
                </div>
                <h2>Confirmar acción</h2>
                <p className="confirm-message">{confirmMessage}</p>
                
                <div className="confirm-actions">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancelar
                  </Button>
                  <Button onClick={handleConfirm} disabled={loading} className="delete">
                    {loading ? 'Eliminando...' : 'Eliminar'}
                  </Button>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ConfigurarDisponibilidad;