import React, { useState, useEffect } from 'react';
import ListadoTramitesUI from '../components/ListadoTramites';
import { getTramitesPorCategoria } from '../services/tramiteService';

const ListadoTramitesPage = ({ categoriaId, categoriaNombre, abrirTramite, volver }) => {
  const [tramites, setTramites] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      const data = await getTramitesPorCategoria(categoriaId);
      setTramites(data);
      setLoading(false);
    };
    if (categoriaId) cargar();
  }, [categoriaId]);

  if (loading) return <div style={{ textAlign: 'center', padding: '50px', color: 'var(--primary-color)' }}>Cargando trámites...</div>;

  return (
    <ListadoTramitesUI
      tramites={tramites}
      categoriaNombre={categoriaNombre}
      abrirTramite={abrirTramite}
      volver={volver}
    />
  );
};

export default ListadoTramitesPage;