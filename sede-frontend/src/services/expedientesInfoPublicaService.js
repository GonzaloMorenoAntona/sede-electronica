const API_URL = '/api/expedientes-info-publica';

export const getExpedientesInfoPublica = async () => {
  try {
    const res = await fetch(API_URL);
    return await res.json();
  } catch (e) {
    console.error('Error cargando expedientes:', e);
    return [];
  }
};