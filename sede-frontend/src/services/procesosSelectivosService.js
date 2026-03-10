const API_URL = '/api/procesos-selectivos';

export const getProcesosSelectivos = async () => {
  try {
    const res = await fetch(API_URL);
    return await res.json();
  } catch (e) {
    console.error('Error cargando procesos selectivos:', e);
    return [];
  }
};