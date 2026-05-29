import React from 'react';
import IconoMuni from '../pages/IconoMuni';
const IconoDoc = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);

const IconoExterno = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

const ListadoTramites = ({ tramites, categoriaNombre, categoriaIcono, abrirTramite, volver }) => {

  const manejarSeleccion = (tramite) => {
    if (Number(tramite.esEnlaceExterno) === 1 && tramite.urlExterna) {
      window.open(tramite.urlExterna, '_blank');
    } else {
      abrirTramite(tramite.id);
    }
  };

  const grupos = tramites.reduce((acc, tramite) => {
    const clave = tramite.subgrupo || '';
    if (!acc[clave]) acc[clave] = [];
    acc[clave].push(tramite);
    return acc;
  }, {});

  const tieneSubgrupos = Object.keys(grupos).some(k => k !== '');

  return (
    <div className="home-content-wrapper">
      <div className="ficha-container">

        <header className="ficha-header">
          <button onClick={volver} className="btn-volver">← VOLVER</button>
          <div className="ficha-header-flex">
            <h1 className="titulo-tramite-principal">{categoriaNombre}</h1>
            <span className="listado-contador-badge">{tramites.length} trámites</span>
          </div>
        </header>

        <article className="ficha-body" style={{ padding: '24px 40px' }}>
          {tramites.length === 0 ? (
            <p className="listado-vacio">No hay trámites disponibles en esta categoría.</p>
          ) : (
            Object.entries(grupos).map(([subgrupo, items]) => (
              <div key={subgrupo} className="listado-grupo-bloque">
                {tieneSubgrupos && subgrupo && (
                  <div className="listado-subgrupo-header">
                    <span>{subgrupo}</span>
                    <span className="listado-subgrupo-count">{items.length}</span>
                  </div>
                )}
                <div className="listado-items-wrap">
                  {items.map(t => (
                    <div key={t.id} className="listado-item-pro" onClick={() => manejarSeleccion(t)}>
                      <div className="listado-item-icono">
                        {categoriaIcono 
                          ? <IconoMuni icono={categoriaIcono} size={22} /> 
                          : <IconoDoc />
                        }
                      </div>
                      <div className="listado-item-body">
                        <span className="listado-item-titulo">{t.titulo}</span>
                        {t.unidadTramitadora && (
                          <span className="listado-item-unidad">{t.unidadTramitadora}</span>
                        )}
                      </div>
                      <div className="listado-item-right">
                        {Number(t.esEnlaceExterno) === 1 && (
                          <span className="listado-badge-ext"><IconoExterno/> Externo</span>
                        )}
                        <span className="listado-flecha">›</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </article>

      </div>
    </div>
  );
};

export default ListadoTramites;
