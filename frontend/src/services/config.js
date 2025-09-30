// Central API configuration for frontend services
// Uses REACT_APP_API_URL if provided (e.g., http://backend:8000/api)
// Falls back to http://localhost:8000/api for local development
export const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:8000/api').replace(/\/+$/, '');

export const apiUrl = (path = '') => {
  const cleanPath = String(path).replace(/^\/+/, '');
  return `${API_BASE}/${cleanPath}`;
};
