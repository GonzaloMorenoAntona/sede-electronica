const API_URL = '/api/plenos';

export const getPlenos = async () => {
  try {
    const res = await fetch(API_URL);
    return await res.json();
  } catch (e) {
    console.error('Error cargando plenos:', e);
    return [];
  }
};