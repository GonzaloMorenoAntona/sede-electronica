export const getConsultasPublicas = async () => {
  try {
    const res = await fetch('/api/consultas-publicas');
    return await res.json();
  } catch (e) {
    console.error('Error cargando consultas públicas:', e);
    return [];
  }
};

export const getInformacionPublica = async () => {
  try {
    const res = await fetch('/api/informacion-publica');
    return await res.json();
  } catch (e) {
    console.error('Error cargando información pública:', e);
    return [];
  }
};