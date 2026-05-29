import React from 'react';
import './FichaTramite.css';
import IconoPro from './IconoPro';

const FichaTramite = ({ tramite: tramiteRecibido, volver, activeTab, setActiveTab }) => {
  const tramite = Array.isArray(tramiteRecibido) ? tramiteRecibido[0] : tramiteRecibido;
  if (!tramite) return null;

  const getLinkCabecera = () => {
    if (!tramite.enlacesJson) return null;
    const enlaces = typeof tramite.enlacesJson === 'string'
      ? JSON.parse(tramite.enlacesJson) : tramite.enlacesJson;
    return enlaces.find(e => e.id === 'cabecera_solicitud');
  };

  const renderizarContenidoEnriquecido = () => {
    let textoFinal = tramite.descripcionHtml || '';
    if (tramite.enlacesJson) {
      const enlaces = typeof tramite.enlacesJson === 'string'
        ? JSON.parse(tramite.enlacesJson) : tramite.enlacesJson;
      enlaces.forEach(enlace => {
        const htmlLink = `<a href="${enlace.url}" target="_blank" class="enlace-sede-dinamico">${enlace.label}</a>`;
        textoFinal = textoFinal.split(`{{${enlace.id}}}`).join(htmlLink);
      });
    }
    return { __html: textoFinal };
  };

  const linkCabecera = getLinkCabecera();
  
  // 1. Definimos los 3 posibles estados reales
  const esVigente = tramite.estado === 'VIGENTE';
  const esCerrado = tramite.estado === 'CERRADO';
  const sinEstado = !esVigente && !esCerrado; // Para los que tienen estado NULL o vacío

  const tabs = ['información', 'documentación', 'normativa'].filter(tab => {
    if (tab === 'información')   return true;
    if (tab === 'documentación') return tramite.documentos?.length > 0;
    if (tab === 'normativa')     return tramite.normativas?.length > 0;
    return false;
  });

  return (
    <div className="home-content-wrapper">
      {/* Si es cerrado, rojo. Si es vigente o no tiene estado (null), azul/normal */}
      <div className={`ficha-container ${esCerrado ? 'ficha-cerrada' : 'ficha-vigente'}`}>

        <header className="ficha-header">
          <button onClick={volver} className="btn-volver">← VOLVER</button>
          <div className="ficha-header-flex">
            <div className="ficha-header-main">
              <div className="ficha-meta-row">
                
                {/* 2. La pastilla pequeña SOLO sale si es VIGENTE o CERRADO */}
                {!sinEstado && (
                  <span className={`ficha-estado-pill ${esVigente ? 'vigente' : 'cerrado'}`}>
                    <span className="ficha-estado-dot"/>
                    {esVigente ? 'Trámite vigente' : 'Plazo cerrado'}
                  </span>
                )}

                {tramite.tipo && (
                  <span className="ficha-tipo-pill">{tramite.tipo}</span>
                )}
              </div>
              <h1 className="titulo-tramite-principal">{tramite.titulo}</h1>
              {tramite.unidadTramitadora && (
                <p className="ficha-unidad">
                  <IconoPro nombre="expediente"/> {tramite.unidadTramitadora}
                </p>
              )}
            </div>

            <div className="acciones-wrapper">
              {/* 3. Si está CERRADO, mostramos la etiqueta gigante. Si no (VIGENTE o NULL), mostramos botones */}
              {esCerrado ? (
                <div className="plazo-cerrado-badge">PLAZO CERRADO</div>
              ) : (
                <>
                  {tramite.urlExterna && (
                    <button
                      className="btn-tramitar-principal"
                      onClick={() => window.open(tramite.urlExterna, '_blank')}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:6}}>
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                      TRAMITAR AHORA
                    </button>
                  )}
                  {linkCabecera && (
                    <a href={linkCabecera.url} target="_blank" rel="noopener noreferrer"
                       className="enlace-sede-dinamico" style={{display:'flex',alignItems:'center',gap:6}}>
                      <IconoPro nombre="descarga"/> {linkCabecera.label} (PDF)
                    </a>
                  )}
                </>
              )}
            </div>
          </div>
        </header>

        {tabs.length > 1 && (
          <nav className="tab-nav">
            {tabs.map(tab => (
              <button
                key={tab}
                className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        )}

        <article className="ficha-body">
          {activeTab === 'información' && (
            <div
              className="descripcion-tramite-container"
              dangerouslySetInnerHTML={renderizarContenidoEnriquecido()}
            />
          )}

          {activeTab === 'documentación' && (
            <div>
              <h3 className="titulo-guia-interno">
                <IconoPro nombre="expediente"/> Documentación requerida
              </h3>
              {tramite.documentos?.map((doc, i) => (
                <div key={i} className="doc-item">
                  <strong>{doc.nombre}</strong>
                  <div className="descripcion-tramite-container"
                    dangerouslySetInnerHTML={{ __html: doc.descripcion }}/>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'normativa' && (
            <div>
              <h3 className="titulo-guia-interno">Normativa Aplicable</h3>
              {tramite.normativas?.length > 0 ? (
                tramite.normativas.map((norma, i) => (
                  <div key={i} className="norma-item">
                    <a href={norma.enlaceBoletin} target="_blank" rel="noopener noreferrer"
                       className="norma-referencia">
                      <IconoPro nombre="descarga"/> {norma.referencia}
                    </a>
                    <p className="norma-descripcion">{norma.descripcionCorta}</p>
                  </div>
                ))
              ) : (
                <p>No hay normativa específica registrada para este trámite.</p>
              )}
            </div>
          )}
        </article>

      </div>
    </div>
  );
};

export default FichaTramite;
