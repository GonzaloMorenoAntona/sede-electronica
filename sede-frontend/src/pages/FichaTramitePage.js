import React, { useState, useEffect } from 'react';
import FichaTramiteUI from '../components/FichaTramite';
import { getDetalleTramite } from '../services/tramiteService';

const FichaTramitePage = ({ tramiteId, volver }) => {
  const [tramite, setTramite] = useState(null);
  const [activeTab, setActiveTab] = useState('información');
  const [loading, setLoading] = useState(true);

  // Cargamos el detalle del trámite al entrar en la página
  useEffect(() => {
    setActiveTab('información');
    const cargarDetalle = async () => {
      setLoading(true);
      try {
        const data = await getDetalleTramite(tramiteId);
        setTramite(data);
      } catch (err) {
        console.error('Error cargando trámite:', err);
      } finally {
        setLoading(false);  // setLoading(false) siempre se ejecuta, haya error o no
      }
    };
    if (tramiteId) cargarDetalle();
  }, [tramiteId]);

  if (loading) return <div style={{ textAlign: 'center', padding: '50px', color: 'var(--primary-color)' }}>Cargando detalles del trámite...</div>;
  if (!tramite) return <div style={{ textAlign: 'center', padding: '50px', color: 'var(--primary-color)' }}>No se ha podido encontrar la información del trámite.</div>;
  
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