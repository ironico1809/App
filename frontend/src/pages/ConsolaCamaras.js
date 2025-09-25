import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Button from '../components/Button';
import Modal from '../components/Modal';
import './ConsolaCamaras.css';

// Datos simulados basados en la BD real
const camarasMock = [
  {
    id_camara: 1,
    ubicacion: 'Lobby Principal',
    descripcion: 'Entrada principal del condominio',
    estado: 'ACTIVA',
    streaming_url: '/api/stream/camera1',
    last_event: '2024-09-24 08:15:32',
    events_today: 12,
    alert_level: 'normal'
  },
  {
    id_camara: 2,
    ubicacion: 'Estacionamiento Norte',
    descripcion: 'Área de estacionamiento sector norte',
    estado: 'ACTIVA',
    streaming_url: '/api/stream/camera2',
    last_event: '2024-09-24 09:23:18',
    events_today: 8,
    alert_level: 'normal'
  },
  {
    id_camara: 3,
    ubicacion: 'Piscina',
    descripcion: 'Área de piscina y recreación',
    estado: 'ACTIVA',
    streaming_url: '/api/stream/camera3',
    last_event: '2024-09-24 10:45:12',
    events_today: 15,
    alert_level: 'warning'
  },
  {
    id_camara: 4,
    ubicacion: 'Salón de Eventos',
    descripcion: 'Salón de eventos y reuniones',
    estado: 'ACTIVA',
    streaming_url: '/api/stream/camera4',
    last_event: '2024-09-24 07:30:45',
    events_today: 3,
    alert_level: 'normal'
  },
  {
    id_camara: 5,
    ubicacion: 'Gimnasio',
    descripcion: 'Área de gimnasio y fitness',
    estado: 'INACTIVA',
    streaming_url: null,
    last_event: '2024-09-23 18:22:10',
    events_today: 0,
    alert_level: 'error'
  },
  {
    id_camara: 6,
    ubicacion: 'Acceso Trasero',
    descripcion: 'Puerta de acceso trasero',
    estado: 'ACTIVA',
    streaming_url: '/api/stream/camera6',
    last_event: '2024-09-24 09:55:33',
    events_today: 22,
    alert_level: 'high'
  },
  {
    id_camara: 7,
    ubicacion: 'Jardines',
    descripcion: 'Área de jardines y espacio verde',
    estado: 'ACTIVA',
    streaming_url: '/api/stream/camera7',
    last_event: '2024-09-24 10:12:05',
    events_today: 7,
    alert_level: 'normal'
  },
  {
    id_camara: 8,
    ubicacion: 'Ascensor Principal',
    descripcion: 'Interior del ascensor principal',
    estado: 'MANTENIMIENTO',
    streaming_url: null,
    last_event: '2024-09-24 06:45:18',
    events_today: 1,
    alert_level: 'warning'
  }
];

// Eventos recientes simulados
const eventosRecientes = [
  {
    id_evento: 1,
    id_camara: 6,
    tipo_evento: 'MOVIMIENTO_SOSPECHOSO',
    fecha_hora: '2024-09-24 10:55:33',
    descripcion: 'Movimiento detectado en área restringida',
    ubicacion: 'Acceso Trasero',
    confianza: 85.2,
    url_imagen: '/events/capture1.jpg'
  },
  {
    id_evento: 2,
    id_camara: 3,
    tipo_evento: 'PERSONA_DETECTADA',
    fecha_hora: '2024-09-24 10:45:12',
    descripcion: 'Persona detectada fuera del horario permitido',
    ubicacion: 'Piscina',
    confianza: 92.7,
    url_imagen: '/events/capture2.jpg'
  },
  {
    id_evento: 3,
    id_camara: 1,
    tipo_evento: 'VISITANTE_NUEVO',
    fecha_hora: '2024-09-24 10:30:15',
    descripcion: 'Visitante no registrado detectado',
    ubicacion: 'Lobby Principal',
    confianza: 78.9,
    url_imagen: '/events/capture3.jpg'
  },
  {
    id_evento: 4,
    id_camara: 2,
    tipo_evento: 'VEHICULO_DESCONOCIDO',
    fecha_hora: '2024-09-24 10:15:42',
    descripcion: 'Vehículo con placa no registrada',
    ubicacion: 'Estacionamiento Norte',
    confianza: 89.4,
    url_imagen: '/events/capture4.jpg'
  }
];

const tiposEvento = ['TODOS', 'MOVIMIENTO_SOSPECHOSO', 'PERSONA_DETECTADA', 'VISITANTE_NUEVO', 'VEHICULO_DESCONOCIDO'];
const estadosCamara = ['TODAS', 'ACTIVA', 'INACTIVA', 'MANTENIMIENTO'];

const ConsolaCamaras = () => {
  const [vistaActual, setVistaActual] = useState('mosaico');
  const [camaraSeleccionada, setCamaraSeleccionada] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('TODAS');
  const [filtroEvento, setFiltroEvento] = useState('TODOS');
  const [showStreamModal, setShowStreamModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [alertasActivas, setAlertasActivas] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Actualizar reloj cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Contar alertas activas
  useEffect(() => {
    const alertas = camarasMock.filter(camara => 
      camara.alert_level === 'warning' || camara.alert_level === 'high'
    ).length;
    setAlertasActivas(alertas);
  }, []);

  const camarasFiltradas = camarasMock.filter(camara => {
    const estadoMatch = filtroEstado === 'TODAS' || camara.estado === filtroEstado;
    return estadoMatch;
  });

  const eventosFiltrados = eventosRecientes.filter(evento => {
    return filtroEvento === 'TODOS' || evento.tipo_evento === filtroEvento;
  });

  const abrirStreaming = (camara) => {
    if (camara.estado !== 'ACTIVA') {
      alert('La cámara no está disponible para streaming');
      return;
    }
    setCamaraSeleccionada(camara);
    setShowStreamModal(true);
  };

  const verEvento = (evento) => {
    setEventoSeleccionado(evento);
    setShowEventModal(true);
  };

  const getAlertIcon = (level) => {
    switch (level) {
      case 'high': return '🚨';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return '✅';
    }
  };

  const getAlertColor = (level) => {
    switch (level) {
      case 'high': return 'alert-high';
      case 'warning': return 'alert-warning';
      case 'error': return 'alert-error';
      default: return 'alert-normal';
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'ACTIVA': return 'estado-activa';
      case 'INACTIVA': return 'estado-inactiva';
      case 'MANTENIMIENTO': return 'estado-mantenimiento';
      default: return 'estado-unknown';
    }
  };

  return (
    <DashboardLayout>
      <div className="consola-camaras-page">
        {/* Header */}
        <div className="consola-camaras-header">
          <div className="consola-header-content">
            <div className="consola-header-title">
              <h1>Consola de Cámaras de Seguridad</h1>
              <p>Monitoreo y administración en tiempo real del sistema de videovigilancia</p>
            </div>
            <div className="consola-header-time">
              <div className="time-display">
                <span className="time-label">Hora del Sistema:</span>
                <span className="time-value">{currentTime.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Panel de Control */}
        <div className="consola-control-panel">
          <div className="control-stats">
            <div className="control-stat-card">
              <div className="stat-icon">📹</div>
              <div className="stat-info">
                <h3>{camarasMock.filter(c => c.estado === 'ACTIVA').length}</h3>
                <span>Cámaras Activas</span>
              </div>
            </div>
            <div className="control-stat-card">
              <div className="stat-icon">🚨</div>
              <div className="stat-info">
                <h3>{alertasActivas}</h3>
                <span>Alertas Activas</span>
              </div>
            </div>
            <div className="control-stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <h3>{eventosRecientes.length}</h3>
                <span>Eventos Hoy</span>
              </div>
            </div>
            <div className="control-stat-card">
              <div className="stat-icon">⚡</div>
              <div className="stat-info">
                <h3>{camarasMock.filter(c => c.estado === 'INACTIVA').length}</h3>
                <span>Fuera de Línea</span>
              </div>
            </div>
          </div>

          <div className="control-filters">
            <div className="filter-group">
              <label className="filter-label">Estado:</label>
              <select
                className="filter-select"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                {estadosCamara.map(estado => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Vista:</label>
              <div className="vista-toggle">
                <button
                  className={`toggle-btn ${vistaActual === 'mosaico' ? 'active' : ''}`}
                  onClick={() => setVistaActual('mosaico')}
                >
                  🔳 Mosaico
                </button>
                <button
                  className={`toggle-btn ${vistaActual === 'lista' ? 'active' : ''}`}
                  onClick={() => setVistaActual('lista')}
                >
                  📋 Lista
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Vista Principal */}
        <div className="consola-main-content">
          {vistaActual === 'mosaico' ? (
            <div className="camaras-mosaico">
              {camarasFiltradas.map(camara => (
                <div key={camara.id_camara} className="camara-card">
                  <div className="camara-header">
                    <h4 className="camara-titulo">{camara.ubicacion}</h4>
                    <div className="camara-status">
                      <span className={`estado-badge ${getEstadoColor(camara.estado)}`}>
                        {camara.estado}
                      </span>
                      <span className={`alert-badge ${getAlertColor(camara.alert_level)}`}>
                        {getAlertIcon(camara.alert_level)}
                      </span>
                    </div>
                  </div>

                  <div className="camara-preview" onClick={() => abrirStreaming(camara)}>
                    {camara.estado === 'ACTIVA' ? (
                      <div className="streaming-placeholder">
                        <div className="streaming-icon">📹</div>
                        <p>Click para ver en vivo</p>
                      </div>
                    ) : (
                      <div className="streaming-offline">
                        <div className="offline-icon">📵</div>
                        <p>{camara.estado === 'MANTENIMIENTO' ? 'En Mantenimiento' : 'Fuera de Línea'}</p>
                      </div>
                    )}
                  </div>

                  <div className="camara-info">
                    <p className="camara-descripcion">{camara.descripcion}</p>
                    <div className="camara-stats">
                      <span className="stat-item">
                        🔔 {camara.events_today} eventos
                      </span>
                      <span className="stat-item">
                        🕐 {camara.last_event.split(' ')[1]}
                      </span>
                    </div>
                  </div>

                  <div className="camara-actions">
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => abrirStreaming(camara)}
                      disabled={camara.estado !== 'ACTIVA'}
                    >
                      📺 Ver Stream
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="camaras-lista">
              <div className="lista-header">
                <div>Ubicación</div>
                <div>Estado</div>
                <div>Eventos Hoy</div>
                <div>Último Evento</div>
                <div>Alert Level</div>
                <div>Acciones</div>
              </div>
              {camarasFiltradas.map(camara => (
                <div key={camara.id_camara} className="lista-row">
                  <div className="lista-ubicacion">
                    <strong>{camara.ubicacion}</strong>
                    <p>{camara.descripcion}</p>
                  </div>
                  <div>
                    <span className={`estado-badge ${getEstadoColor(camara.estado)}`}>
                      {camara.estado}
                    </span>
                  </div>
                  <div className="lista-eventos">{camara.events_today}</div>
                  <div className="lista-tiempo">{camara.last_event}</div>
                  <div>
                    <span className={`alert-badge ${getAlertColor(camara.alert_level)}`}>
                      {getAlertIcon(camara.alert_level)}
                    </span>
                  </div>
                  <div>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => abrirStreaming(camara)}
                      disabled={camara.estado !== 'ACTIVA'}
                    >
                      Ver
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Panel de Eventos */}
        <div className="eventos-panel">
          <div className="eventos-header">
            <h3>Eventos Recientes</h3>
            <div className="eventos-filter">
              <select
                className="filter-select"
                value={filtroEvento}
                onChange={(e) => setFiltroEvento(e.target.value)}
              >
                {tiposEvento.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="eventos-lista">
            {eventosFiltrados.map(evento => (
              <div key={evento.id_evento} className="evento-item" onClick={() => verEvento(evento)}>
                <div className="evento-tiempo">
                  {evento.fecha_hora.split(' ')[1]}
                </div>
                <div className="evento-info">
                  <h5>{evento.tipo_evento.replace('_', ' ')}</h5>
                  <p>{evento.descripcion}</p>
                  <span className="evento-ubicacion">📍 {evento.ubicacion}</span>
                </div>
                <div className="evento-confianza">
                  {evento.confianza}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de Streaming */}
      {showStreamModal && camaraSeleccionada && (
        <Modal
          title={`Streaming: ${camaraSeleccionada.ubicacion}`}
          onClose={() => setShowStreamModal(false)}
          size="large"
        >
          <div className="streaming-modal-content">
            <div className="streaming-video">
              <div className="video-placeholder">
                <div className="video-icon">📹</div>
                <p>Streaming en tiempo real</p>
                <p className="video-url">{camaraSeleccionada.streaming_url}</p>
              </div>
            </div>
            <div className="streaming-controls">
              <Button variant="primary">📸 Captura</Button>
              <Button variant="secondary">🔍 Zoom</Button>
              <Button variant="secondary">🎥 Grabar</Button>
            </div>
            <div className="streaming-info">
              <p><strong>Descripción:</strong> {camaraSeleccionada.descripcion}</p>
              <p><strong>Eventos hoy:</strong> {camaraSeleccionada.events_today}</p>
              <p><strong>Último evento:</strong> {camaraSeleccionada.last_event}</p>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de Evento */}
      {showEventModal && eventoSeleccionado && (
        <Modal
          title="Detalle del Evento"
          onClose={() => setShowEventModal(false)}
        >
          <div className="evento-modal-content">
            <div className="evento-imagen">
              <div className="imagen-placeholder">
                <div className="imagen-icon">🖼️</div>
                <p>Captura del evento</p>
                <p className="imagen-url">{eventoSeleccionado.url_imagen}</p>
              </div>
            </div>
            <div className="evento-detalles">
              <div className="detalle-field">
                <label>Tipo:</label>
                <span>{eventoSeleccionado.tipo_evento.replace('_', ' ')}</span>
              </div>
              <div className="detalle-field">
                <label>Fecha y Hora:</label>
                <span>{eventoSeleccionado.fecha_hora}</span>
              </div>
              <div className="detalle-field">
                <label>Ubicación:</label>
                <span>{eventoSeleccionado.ubicacion}</span>
              </div>
              <div className="detalle-field">
                <label>Descripción:</label>
                <span>{eventoSeleccionado.descripcion}</span>
              </div>
              <div className="detalle-field">
                <label>Confianza:</label>
                <span>{eventoSeleccionado.confianza}%</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default ConsolaCamaras;
// --- Ejemplo de contenido de ReservarAreas.css para referencia visual o de estilos ---
// Puedes copiar este bloque a un componente o mostrarlo en la UI si lo deseas
/*
@import '../styles/variables.css';

... (todo el contenido de ReservarAreas.css aquí, o referencia a la ruta del archivo) ...
*/