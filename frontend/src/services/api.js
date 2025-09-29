// === TAREAS ===
// Obtener todas las tareas
export async function obtenerTareas() {
  const response = await fetch('http://127.0.0.1:8000/api/tareas/');
  if (!response.ok) throw new Error('Error al cargar tareas');
  return response.json();
}

// Crear una tarea
export async function crearTarea(data) {
  const response = await fetch('http://127.0.0.1:8000/api/tareas/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw response;
  }
  return response.json();
}

// Actualizar una tarea
export async function actualizarTarea(id, data) {
  const response = await fetch(`http://127.0.0.1:8000/api/tareas/${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Error al actualizar tarea');
  return response.json();
}

// Eliminar una tarea
export async function eliminarTarea(id) {
  const response = await fetch(`http://127.0.0.1:8000/api/tareas/${id}/`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Error al eliminar tarea');
  return true;
}
// Obtener cuotas generadas (cuotas y servicios por unidad)
export async function obtenerCuotasGeneradas() {
  const response = await fetch('http://127.0.0.1:8000/api/cuotas-generadas/');
  return response.json();
}
// Obtener lista de pagos (historial)
export async function obtenerPagos() {
  const response = await fetch('http://127.0.0.1:8000/api/pagos/');
  return response.json();
}
// Crear un pago con comprobante (file upload)
export async function crearPagoConComprobante({ usuario, cuota_servicio, monto_pagado, comprobante }) {
  const formData = new FormData();
  formData.append('usuario', usuario);
  formData.append('cuota_servicio', cuota_servicio);
  formData.append('monto_pagado', monto_pagado);
  if (comprobante) {
    formData.append('comprobante', comprobante);
  }
  const response = await fetch('http://127.0.0.1:8000/api/pagos/', {
    method: 'POST',
    body: formData
    // No se debe establecer 'Content-Type', el navegador lo hace automáticamente para FormData
  });
  return response.json();
}
// Servicio para registrar usuario desde el frontend React
export async function registrarUsuario(datos) {
  const response = await fetch('http://127.0.0.1:8000/api/registro/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datos)
  });
  return response.json();
}

// Obtener lista de usuarios
export async function obtenerUsuarios() {
  const response = await fetch('http://127.0.0.1:8000/api/usuarios/');
  return response.json();
}

// Obtener lista de usuarios SOLO PERSONAL
export async function obtenerUsuariosPersonal() {
  const response = await fetch('http://127.0.0.1:8000/api/personal/');
  return response.json();
}

// Obtener detalle de un usuario
export async function obtenerUsuario(id) {
  const response = await fetch(`http://127.0.0.1:8000/api/usuarios/${id}/`);
  return response.json();
}

// Editar usuario
export async function editarUsuario(id, datos) {
  const response = await fetch(`http://127.0.0.1:8000/api/usuarios/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datos)
  });
  return response.json();
}

// Eliminar usuario
export async function eliminarUsuario(id) {
  const response = await fetch(`http://127.0.0.1:8000/api/usuarios/${id}/`, {
    method: 'DELETE'
  });
	return response;
}

// === Cuotas de Servicio y Multas ===
export async function obtenerCuotasServicio() {
  const response = await fetch('http://127.0.0.1:8000/api/cuotas-servicio/');
  return response.json();
}

export async function crearCuotaServicio(data) {
  const response = await fetch('http://127.0.0.1:8000/api/cuotas-servicio/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

export async function obtenerMultas() {
  const response = await fetch('http://127.0.0.1:8000/api/multas/');
  return response.json();
}

export async function crearMulta(data) {
  const response = await fetch('http://127.0.0.1:8000/api/multas/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

export async function editarCuotaServicio(id, data) {
  const response = await fetch(`http://127.0.0.1:8000/api/cuotas-servicio/${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

export async function eliminarCuotaServicio(id) {
  const response = await fetch(`http://127.0.0.1:8000/api/cuotas-servicio/${id}/`, {
    method: 'DELETE'
  });
  return response;
}

export async function editarMulta(id, data) {
  const response = await fetch(`http://127.0.0.1:8000/api/multas/${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

export async function eliminarMulta(id) {
  const response = await fetch(`http://127.0.0.1:8000/api/multas/${id}/`, {
    method: 'DELETE'
  });
  return response;
}

// === Roles y Permisos ===
export async function obtenerRoles() {
  const response = await fetch('http://127.0.0.1:8000/api/roles/');
  return response.json();
}

export async function crearRol(data) {
  const response = await fetch('http://127.0.0.1:8000/api/roles/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

export async function editarRol(id, data) {
  const response = await fetch(`http://127.0.0.1:8000/api/roles/${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

export async function eliminarRol(id) {
  const response = await fetch(`http://127.0.0.1:8000/api/roles/${id}/`, {
    method: 'DELETE'
  });
  return response;
}

export async function obtenerPermisos() {
  const response = await fetch('http://127.0.0.1:8000/api/permisos/');
  return response.json();
}

export async function crearPermiso(data) {
  const response = await fetch('http://127.0.0.1:8000/api/permisos/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

export async function editarPermiso(id, data) {
  const response = await fetch(`http://127.0.0.1:8000/api/permisos/${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

export async function eliminarPermiso(id) {
  const response = await fetch(`http://127.0.0.1:8000/api/permisos/${id}/`, {
    method: 'DELETE'
  });
  return response;
}

export async function obtenerUsuarioRoles() {
  const response = await fetch('http://127.0.0.1:8000/api/usuario-roles/');
  return response.json();
}

export async function crearUsuarioRol(data) {
  const response = await fetch('http://127.0.0.1:8000/api/usuario-roles/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

export async function editarUsuarioRol(id, data) {
  const response = await fetch(`http://127.0.0.1:8000/api/usuario-roles/${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

export async function eliminarUsuarioRol(id) {
  const response = await fetch(`http://127.0.0.1:8000/api/usuario-roles/${id}/`, {
    method: 'DELETE'
  });
  return response;
}

export async function obtenerRolPermisos() {
  const response = await fetch('http://127.0.0.1:8000/api/rol-permisos/');
  return response.json();
}

export async function crearRolPermiso(data) {
  const response = await fetch('http://127.0.0.1:8000/api/rol-permisos/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

export async function editarRolPermiso(id, data) {
  const response = await fetch(`http://127.0.0.1:8000/api/rol-permisos/${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

export async function eliminarRolPermiso(id) {
  const response = await fetch(`http://127.0.0.1:8000/api/rol-permisos/${id}/`, {
    method: 'DELETE'
  });
  return response;
}

// Obtener avisos
export async function obtenerAvisos() {
  const response = await fetch('http://127.0.0.1:8000/api/avisos/');
  return response.json();
}

// Crear un aviso
export async function crearAviso(datos) {
  const response = await fetch('http://127.0.0.1:8000/api/avisos/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datos)
  });
  return response.json();
}

// Crear un aviso con adjuntos, pe
export async function crearAvisoConAdjuntos({ titulo, cuerpo, segmento, id_admin, adjuntos }) {
  const formData = new FormData();
  formData.append('titulo', titulo);
  formData.append('cuerpo', cuerpo);
  formData.append('segmento', segmento);
  formData.append('id_admin', id_admin);
  // Puedes agregar más campos si tu modelo los requiere

  // Primero creamos el aviso
  const response = await fetch('http://127.0.0.1:8000/api/avisos/', {
    method: 'POST',
    body: formData
  });
  const aviso = await response.json();

  // Si hay adjuntos, los subimos uno por uno
  if (adjuntos && adjuntos.length > 0 && aviso.id) {
    for (let file of adjuntos) {
      const adjForm = new FormData();
      adjForm.append('archivo', file);
      await fetch(`http://127.0.0.1:8000/api/avisos/${aviso.id}/subir_adjunto/`, {
        method: 'POST',
        body: adjForm
      });
    }
  }
  return aviso;
}

// Obtener notificaciones
export async function obtenerNotificaciones() {
  const response = await fetch('http://127.0.0.1:8000/api/notificaciones/');
  return response.json();
}

// Crear reserva de área común, pe
// Si isForm es true, espera un FormData y no pone headers
export async function crearReservaArea(data, isForm = false) {
  const response = await fetch('http://127.0.0.1:8000/api/reservas/', {
    method: 'POST',
    ...(isForm
      ? { body: data }
      : {
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }
    )
  });
  return response.json();
}

// Obtener lista de activos (áreas comunes)
export async function obtenerActivos() {
  const response = await fetch('http://127.0.0.1:8000/api/areas-comunes/');
  return response.json();
}

// Obtener planes de mantenimiento
export async function obtenerPlanesMantenimiento() {
  const response = await fetch('http://127.0.0.1:8000/api/planes-mantenimiento/');
  return response.json();
}

// Obtener órdenes de mantenimiento
export async function obtenerOrdenesMantenimiento() {
  const response = await fetch('http://127.0.0.1:8000/api/ordenes-mantenimiento/');
  return response.json();
}

// Obtener evidencias de mantenimiento
export async function obtenerEvidenciasMantenimiento() {
  const response = await fetch('http://127.0.0.1:8000/api/evidencias-mantenimiento/');
  return response.json();
}
