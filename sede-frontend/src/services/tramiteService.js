export const buscarTramites = async (query) => {
  try {
    const response = await fetch(`/api/tramites/buscar?q=${encodeURIComponent(query)}`);
    return await response.json();
  } catch (error) {
    console.error("Error buscando trámites:", error);
    return [];
  }
};

export const getDetalleTramite = async (id) => {
  try {
    const response = await fetch(`/api/tramites/${id}/detalle`);
    return await response.json();
  } catch (error) {
    console.error("Error cargando detalle:", error);
    return null;
  }
};