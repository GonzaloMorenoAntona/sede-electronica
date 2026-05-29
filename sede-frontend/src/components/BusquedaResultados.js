import React from 'react';
import IconoMuni from '../pages/IconoMuni'; // Asegúrate de que esta ruta coincida con tu estructura de carpetas


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
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

const IconoBuscar = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    <line x1="8" y1="11" x2="14" y2="11"/>
  </svg>
);

const BusquedaResultados = ({ q, results, isLoading, categorias = [], abrirTramite, volver }) => {
  // Agrupamos los resultados por categoría
  const grupos = results.reduce((acc, t) => {
    const cat = categorias.find(c => c.id === t.categoriaId)?.nombre || 'Otros servicios';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(t);
    return acc;
  }, {});

  return (
    <div className="home-content-wrapper">
      <div className="ficha-container">

        <header className="ficha-header busqueda-header">
          <button onClick={volver} className="btn-volver">← VOLVER</button>
          <div className="ficha-header-flex">
            <div>
              <h1 className="titulo-tramite-principal">
                {isLoading ? 'Buscando...' : `Resultados para «${q}»`}
              </h1>
              {!isLoading && results.length > 0 && (
                <p className="busqueda-meta-texto">
                  Se encontraron {results.length} trámite{results.length !== 1 ? 's' : ''} en {Object.keys(grupos).length} área{Object.keys(grupos).length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            {!isLoading && (
              <span className="listado-contador-badge">{results.length} resultados</span>
            )}
          </div>
        </header>

        <article className="ficha-body" style={{ padding: '24px 40px' }}>
          {isLoading && (
            <div className="busqueda-cargando">
              <div className="busqueda-spinner"/>
              <span>Buscando trámites...</span>
            </div>
          )}

          {!isLoading && results.length === 0 && q && (
            <div className="busqueda-sin-resultados">
              <IconoBuscar/>
              <h3>Sin resultados para «{q}»</h3>
              <p>Prueba con otras palabras clave o navega por las áreas temáticas.</p>
            </div>
          )}

          {!isLoading && Object.entries(grupos).map(([catNombre, items]) => (
            <div key={catNombre} className="listado-grupo-bloque">
              <div className="listado-subgrupo-header">
                <span>{catNombre}</span>
                <span className="listado-subgrupo-count">{items.length}</span>
              </div>
              <div className="listado-items-wrap">
                {items.map(t => {
                  // Buscamos la categoría real de este trámite para sacar su icono
                  const categoriaReal = categorias.find(c => c.id === t.categoriaId);
                  const iconoEspecifico = categoriaReal?.icono;

                  return (
                    <div key={t.id} className="listado-item-pro" onClick={() => abrirTramite(t)}>
                      <div className="listado-item-icono">
                        {/* LÓGICA CONDICIONAL: Si hay icono en BD, usa IconoMuni. Si no, usa IconoDoc */}
                        {iconoEspecifico
                            ? <IconoMuni icono={iconoEspecifico} size={22} /> 
                            : <IconoDoc />
                        }
                      </div>
                      <div className="listado-item-body">
                        <span className="listado-item-titulo">{t.titulo}</span>
                        {t.subgrupo && (
                          <span className="listado-item-unidad">{t.subgrupo}</span>
                        )}
                      </div>
                      <div className="listado-item-right">
                        {Number(t.esEnlaceExterno) === 1 && (
                          <span className="listado-badge-ext"><IconoExterno/> Externo</span>
                        )}
                        <span className="listado-flecha">›</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </article>

      </div>
    </div>
  );
};

export default BusquedaResultados;
