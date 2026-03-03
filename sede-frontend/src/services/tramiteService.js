export const buscarTramites = async (query, categoria, tipo) => {
  try {
    let url = `/api/tramites/buscar?q=${encodeURIComponent(query || '')}`;
    if (categoria) url += `&categoria=${categoria}`;
    if (tipo) url += `&tipo=${encodeURIComponent(tipo)}`;
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error('Error buscando trámites:', error);
    return [];
  }
};

export const getDetalleTramite = async (id) => {
  try {
    const response = await fetch(`/api/tramites/${id}/detalle`);
    return await response.json();
  } catch (error) {
    console.error('Error cargando detalle:', error);
    return null;
  }
};