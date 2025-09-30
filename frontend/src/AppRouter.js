import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import RegistrarUsuario from './pages/RegistrarUsuario';
import RecuperarContrasena from './pages/RecuperarContrasena';
import Dashboard from './pages/Dashboard';
import GestionarUsuarios from './pages/GestionarUsuarios';
import GestionarRoles from './pages/GestionarRoles';
import CuotasServicios from './pages/CuotasServicios';
import Pagos from './pages/Pagos';
import HistorialPagos from './pages/HistorialPagos';
import ConfigPrecios from './pages/ConfigPrecios';
import PublicarAvisos from './pages/PublicarAvisos';
import ReservarAreas from './pages/ReservarAreas';
import ConfigurarDisponibilidad from './pages/ConfigurarDisponibilidad';
import GenerarReportes from './pages/GenerarReportes';
import AsignarTareas from './pages/AsignarTareas';
import SeguimientoMantenimiento from './pages/SeguimientoMantenimiento';
import ReportesCostos from './pages/ReportesCostos';
import ConsolaCamaras from './pages/ConsolaCamaras';
import ReconocimientoFacial from './pages/ReconocimientoFacial';
import DeteccionVisitantes from './pages/DeteccionVisitantes';
import IdentificacionVehiculos from './pages/IdentificacionVehiculos';
import ReportesFinancieros from './pages/ReportesFinancieros';
import EstadisticasSeguridad from './pages/EstadisticasSeguridad';

const AppRouter = () => (
  <Router>
    <Routes>
  <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
    <Route path="/registrar" element={<RegistrarUsuario />} />
    <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
    <Route path="/usuarios" element={<PrivateRoute><GestionarUsuarios /></PrivateRoute>} />
    <Route path="/roles" element={<PrivateRoute><GestionarRoles /></PrivateRoute>} />
    <Route path="/finanzas/cuotas-servicios" element={<PrivateRoute><CuotasServicios /></PrivateRoute>} />
    <Route path="/finanzas/pagos" element={<PrivateRoute><Pagos /></PrivateRoute>} />
    <Route path="/finanzas/historial" element={<PrivateRoute><HistorialPagos /></PrivateRoute>} />
    <Route path="/finanzas/config-precios" element={<PrivateRoute><ConfigPrecios /></PrivateRoute>} />
    <Route path="/comunicacion/anuncios" element={<PrivateRoute><PublicarAvisos /></PrivateRoute>} />
    <Route path="/areas-comunes/reservas" element={<PrivateRoute><ReservarAreas /></PrivateRoute>} />
    <Route path="/areas-comunes/configurar" element={<PrivateRoute><ConfigurarDisponibilidad /></PrivateRoute>} />
    <Route path="/areas-comunes/reportes" element={<PrivateRoute><GenerarReportes /></PrivateRoute>} />
    <Route path="/mantenimiento/asignar-tareas" element={<PrivateRoute><AsignarTareas /></PrivateRoute>} />
    <Route path="/mantenimiento/seguimiento-preventivo" element={<PrivateRoute><SeguimientoMantenimiento /></PrivateRoute>} />
    <Route path="/mantenimiento/reportes-costos" element={<PrivateRoute><ReportesCostos /></PrivateRoute>} />
    <Route path="/seguridad/consola-camaras" element={<PrivateRoute><ConsolaCamaras /></PrivateRoute>} />
    <Route path="/seguridad/reconocimiento-facial" element={<PrivateRoute><ReconocimientoFacial /></PrivateRoute>} />
    <Route path="/seguridad/deteccion-visitantes" element={<PrivateRoute><DeteccionVisitantes /></PrivateRoute>} />
    <Route path="/seguridad/identificacion-vehiculos" element={<PrivateRoute><IdentificacionVehiculos /></PrivateRoute>} />
    <Route path="/reportes/estadisticas" element={<PrivateRoute><EstadisticasSeguridad /></PrivateRoute>} />
    <Route path="/finanzas/reportes-financieros" element={<PrivateRoute><ReportesFinancieros /></PrivateRoute>} />
    <Route path="/reportes/generar-reportes" element={<PrivateRoute><GenerarReportes /></PrivateRoute>} />
    </Routes>
  </Router>
);

export default AppRouter;
