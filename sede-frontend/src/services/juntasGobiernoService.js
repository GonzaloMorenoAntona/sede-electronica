const API_URL = '/api/juntas-gobierno';

export const getJuntasGobierno = async () => {
  try {
    const res = await fetch(API_URL);
    return await res.json();
  } catch (e) {
    console.error('Error cargando juntas de gobierno:', e);
    return [];
  }
};