export const buscarTramites = async (keyword, categorias = []) => {
  try {
    const params = new URLSearchParams();
    if (keyword) params.append('q', keyword);
    categorias.forEach(id => params.append('categoriaId', id));
    const res = await fetch(`/api/tramites/buscar?${params.toString()}`);
    return await res.json();
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
export const getTramitesPorCategoria = async (categoriaId) => {
  try {
    const response = await fetch(`/api/tramites?categoriaId=${categoriaId}`);
    return await response.json();
  } catch (error) {
    console.error('Error cargando trámites por categoría:', error);
    return [];
  }
};