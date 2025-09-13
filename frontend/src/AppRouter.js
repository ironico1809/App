import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegistrarUsuario from './pages/RegistrarUsuario';

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/registrar" element={<RegistrarUsuario />} />
    </Routes>
  </Router>
);

export default AppRouter;
