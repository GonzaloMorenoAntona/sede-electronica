const API_URL = '/api/convenios';

export const getConvenios = async () => {
  try {
    const res = await fetch(API_URL);
    return await res.json();
  } catch (e) {
    console.error('Error cargando convenios:', e);
    return [];
  }
};