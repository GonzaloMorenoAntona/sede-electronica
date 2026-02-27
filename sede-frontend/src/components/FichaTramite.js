import React from 'react';
import './FichaTramite.css'; 

const IconoPro = ({ nombre }) => {
  const rutas = {
    expediente: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z",
    descarga: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
  };
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
      <path d={rutas[nombre]} />
    </svg>
  );
};

const FichaTramite = ({ tramite: tramiteRecibido, volver, activeTab, setActiveTab }) => {
  const tramite = Array.isArray(tramiteRecibido) ? tramiteRecibido[0] : tramiteRecibido; 
  if (!tramite) return null;

  // Lógica de filtrado de enlaces (se mantiene igual)
  const getLinkCabecera = () => {
    if (!tramite.enlacesJson) return null;
    const enlaces = typeof tramite.enlacesJson === 'string' ? JSON.parse(tramite.enlacesJson) : tramite.enlacesJson;
    return enlaces.find(e => e.id === 'cabecera_solicitud');
  };

  const renderizarContenidoEnriquecido = () => {
    let textoFinal = tramite.descripcionHtml || ""; 
    if (tramite.enlacesJson) {
      const enlaces = typeof tramite.enlacesJson === 'string' ? JSON.parse(tramite.enlacesJson) : tramite.enlacesJson;
      enlaces.forEach(enlace => {
        const htmlLink = `<a href="${enlace.url}" target="_blank" class="enlace-sede-dinamico">${enlace.label}</a>`;
        textoFinal = textoFinal.split(`{{${enlace.id}}}`).join(htmlLink);
      });
    }
    return { __html: textoFinal };
  };

  const linkCabecera = getLinkCabecera();

  return (
    <div className="home-content-wrapper">
      <div className="ficha-container">
        
        {/* CABECERA */}
        <header className="ficha-header">
          <button onClick={volver} className="enlace-sede-dinamico" style={{border:'none', background:'none', cursor:'pointer', marginBottom:'20px', display:'block'}}>
            ← VOLVER AL BUSCADOR
          </button>

          <div className="ficha-header-flex">
            <h1 style={{ margin: 0, color: '#222', flex: 1 }}>{tramite.titulo}</h1>
            
            <div className="acciones-wrapper">
              {tramite.estado === 'VIGENTE' ? (
                <>
                  <button className="btn-tramitar-principal" onClick={() => window.open(tramite.urlExterna, '_blank')}>
                    TRAMITAR AHORA
                  </button>
                  {linkCabecera && (
                    <a href={linkCabecera.url} className="enlace-sede-dinamico" style={{textAlign:'center', display:'flex', justifyContent:'center', alignItems:'center'}}>
                      <IconoPro nombre="descarga" /> {linkCabecera.label} (PDF)
                    </a>
                  )}
                </>
              ) : (
                <div className="plazo-cerrado-badge">PLAZO CERRADO</div>
              )}
            </div>
          </div>
        </header>

        {/* NAVEGACIÓN PESTAÑAS - Solo muestra lo que tiene contenido */}
        <nav className="tab-nav">
          {['información', 'documentación', 'normativa']
            .filter(tab => {
              if (tab === 'información') return true; // Siempre se muestra
              if (tab === 'documentación') return tramite.documentos?.length > 0;
              if (tab === 'normativa') return tramite.normativas?.length > 0;
              return false;
            })
            .map(tab => (
              <button 
                key={tab} 
                className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
        </nav>

        {/* CUERPO */}
        <article className="ficha-body">
          {activeTab === 'información' && (
            <div dangerouslySetInnerHTML={renderizarContenidoEnriquecido()} />
          )}

          {activeTab === 'documentación' && (
            <div>
              <h3 className="titulo-guia-interno"><IconoPro nombre="expediente" /> Documentación</h3>
              {tramite.documentos?.map((doc, i) => (
                <div key={i} className="doc-item">
                  <strong>{doc.nombre}</strong>
                  <div className="descripcion-tramite-container" dangerouslySetInnerHTML={{ __html: doc.descripcion }} />
                </div>
              ))}
            </div>
          )}
          {/* CONTENIDO DE NORMATIVA (RECUPERADO) */}
            {activeTab === 'normativa' && (
              <div>
                <h3 className="titulo-guia-interno">Normativa Aplicable</h3>
                
                {tramite.normativas?.length > 0 ? (
                  tramite.normativas.map((norma, i) => (
                    <div key={i} className="norma-item">
                      <a 
                        href={norma.enlaceBoletin} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="norma-referencia"
                      >
                        <IconoPro nombre="descarga" /> 
                        {norma.referencia}
                      </a>
                      <p style={{ margin: '0 0 0 28px', fontSize: '0.95rem', color: '#666' }}>
                        {norma.descripcionCorta}
                      </p>
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