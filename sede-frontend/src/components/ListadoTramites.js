import React from 'react';
import './ListadoTramites.css';

const ListadoTramites = ({ tramites, categoriaNombre, abrirTramite, volver }) => {

  const manejarSeleccion = (tramite) => {
    if (Number(tramite.esEnlaceExterno) === 1 && tramite.urlExterna) {
      window.open(tramite.urlExterna, '_blank');
    } else {
      abrirTramite(tramite.id);
    }
  };

  // Agrupa los trámites por subgrupo
  const grupos = tramites.reduce((acc, tramite) => {
    const clave = tramite.subgrupo || 'General';
    if (!acc[clave]) acc[clave] = [];
    acc[clave].push(tramite);
    return acc;
  }, {});

  const TramiteItem = ({ tramite }) => (
    <div className="listado-item" onClick={() => manejarSeleccion(tramite)}>
      <span className="listado-item-titulo">{tramite.titulo}</span>
      <span className="listado-item-arrow">→</span>
    </div>
  );

  return (
    <div className="home-content-wrapper">
      <div className="ficha-container">

        <header className="ficha-header">
          <button onClick={volver} className="btn-volver">
            ← VOLVER
          </button>
          <div className="ficha-header-flex">
            <h1 className="titulo-tramite-principal">{categoriaNombre}</h1>
            <span className="listado-contador">{tramites.length} trámites</span>
          </div>
        </header>

        <article className="ficha-body">
          {tramites.length === 0 ? (
            <p className="listado-vacio">No hay trámites disponibles en esta categoría.</p>
          ) : (
            Object.entries(grupos).map(([subgrupo, items]) => (
              <div key={subgrupo} className="listado-grupo">
                <h3 className="titulo-guia-interno">{subgrupo}</h3>
                {items.map(t => <TramiteItem key={t.id} tramite={t} />)}
              </div>
            ))
          )}
        </article>

      </div>
    </div>
  );
};

export default ListadoTramites;