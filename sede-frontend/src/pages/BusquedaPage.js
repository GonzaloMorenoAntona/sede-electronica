import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import BusquedaResultados from '../components/BusquedaResultados';
import { buscarTramites } from '../services/tramiteService';

const BusquedaPage = ({ categorias = [], onAbrirTramite }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const q = searchParams.get('q') || '';

  const [results, setResults]   = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (!q.trim()) return;
    setLoading(true);
    buscarTramites(q, [])
      .then(setResults)
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [q]);

  const manejarApertura = (item) => {
    if (Number(item.esEnlaceExterno) === 1 && item.urlExterna) {
      window.open(item.urlExterna, '_blank');
    } else {
      onAbrirTramite(item.id); 
    }
  };

  return (
    <BusquedaResultados
      q={q}
      results={results}
      isLoading={isLoading}
      categorias={categorias}
      abrirTramite={manejarApertura}
      volver={() => navigate(-1)}
    />
  );
};

export default BusquedaPage;
