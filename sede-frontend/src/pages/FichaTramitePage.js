import React, { useState, useEffect } from 'react';
import FichaTramiteUI from '../components/FichaTramite';
import { getDetalleTramite } from '../services/tramiteService';

const FichaTramitePage = ({ tramiteId, volver }) => {
  const [tramite, setTramite] = useState(null);
  const [activeTab, setActiveTab] = useState('información');
  const [loading, setLoading] = useState(true);

  // Cargamos el detalle del trámite al entrar en la página
  useEffect(() => {
    const cargarDetalle = async () => {
      setLoading(true);
      const data = await getDetalleTramite(tramiteId);
      setTramite(data);
      setLoading(false);
    };
    if (tramiteId) cargarDetalle();
  }, [tramiteId]);

  if (loading) return <div style={{ textAlign: 'center', padding: '50px', color: '#af272f' }}>Cargando detalles del trámite...</div>;
  if (!tramite) return <div style={{ textAlign: 'center', padding: '50px' }}>No se ha podido encontrar la información del trámite.</div>;
  
  return (
    <FichaTramiteUI 
      tramite={tramite} 
      volver={volver} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
    />
  );
};

export default FichaTramitePage;