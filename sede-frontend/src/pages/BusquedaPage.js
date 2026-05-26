import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { buscarTramites } from '../services/tramiteService';


const BusquedaPage = ({ categorias = [] }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const q = searchParams.get('q') || '';

  const [results, setResults] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (!q.trim()) return;
    setLoading(true);
    buscarTramites(q, [])
      .then(setResults)
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [q]);

  const abrirTramite = (item) => {
    if (Number(item.esEnlaceExterno) === 1 && item.urlExterna) {
      window.open(item.urlExterna, '_blank');
    } else if (item.id === 16) navigate('/subvenciones');
    else if (item.id === 14 || item.id === 59) navigate('/procesos-selectivos');
    else if (item.id === 115) navigate('/plenos');
    else if (item.id === 116) navigate('/convenios');
    else if (item.id === 117) navigate('/expedientes-info-publica');
    else if (item.id === 118) navigate('/participacion-normativa');
    else navigate(`/tramite/${item.id}`);
  };

  const grupos = results.reduce((acc, t) => {
    const cat = categorias.find(c => c.id === t.categoriaId)?.nombre || 'Otros';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(t);
    return acc;
  }, {});

  return (
    <div className="home-content-wrapper">
      <div className="ficha-container">

        <header className="ficha-header">
          <button onClick={() => navigate(-1)} className="btn-volver">← VOLVER</button>
          <div className="ficha-header-flex">
            <h1 className="titulo-tramite-principal">
              {isLoading ? 'Buscando...' : `Resultados para «${q}»`}
            </h1>
            {!isLoading && (
              <span className="listado-contador">{results.length} resultados</span>
            )}
          </div>
        </header>

        <article className="ficha-body">
          {isLoading && <p className="listado-vacio">Cargando...</p>}

          {!isLoading && results.length === 0 && (
            <p className="listado-vacio">No se encontraron resultados para «{q}».</p>
          )}

          {!isLoading && Object.entries(grupos).map(([cat, items]) => (
            <div key={cat} className="listado-grupo">
              <h3 className="titulo-guia-interno">{cat}</h3>
              {items.map(t => (
                <div key={t.id} className="listado-item" onClick={() => abrirTramite(t)}>
                  <span className="listado-item-titulo">{t.titulo}</span>
                  <span className="listado-item-arrow">→</span>
                </div>
              ))}
            </div>
          ))}
        </article>

      </div>
    </div>
  );
};

export default BusquedaPage;
