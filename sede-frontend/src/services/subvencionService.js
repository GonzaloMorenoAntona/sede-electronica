export const getSubvenciones = async () => {
  try {
    const response = await fetch('/api/subvenciones');
    return await response.json();
  } catch (error) {
    console.error('Error cargando subvenciones:', error);
    return [];
  }
};