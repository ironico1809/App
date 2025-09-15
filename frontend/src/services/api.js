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
