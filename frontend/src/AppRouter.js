import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} />
  <Route path="/registrar" element={<RegistrarUsuario />} />
  <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/usuarios" element={<GestionarUsuarios />} />
  <Route path="/roles" element={<GestionarRoles />} />
  <Route path="/finanzas/cuotas-servicios" element={<CuotasServicios />} />
  <Route path="/finanzas/pagos" element={<Pagos />} />
  <Route path="/finanzas/historial" element={<HistorialPagos />} />
  <Route path="/finanzas/config-precios" element={<ConfigPrecios />} />
    </Routes>
  </Router>
);

export default AppRouter;
