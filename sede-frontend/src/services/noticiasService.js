export const getNoticias = async (limit = 24) => {
  try {
    const res = await fetch(`/api/noticias?limit=${limit}`);
    return await res.json();
  } catch (e) {
    console.error('Error cargando noticias:', e);
    return [];
  }
};