import React from 'react';

// Icono Profesional (SVG) - Definido fuera para mayor limpieza
const IconoPro = ({ nombre }) => {
  const rutas = {
    expediente: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z",
    descarga: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
  };
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '10px' }}>
      <path d={rutas[nombre]} />
    </svg>
  );
};

const FichaTramite = ({ tramite: tramiteRecibido, volver, activeTab, setActiveTab }) => {
  /* A veces el servicio devuelve un array con un solo trámite, a veces el objeto directamente. 
  Aquí lo normalizamos para evitar errores. */
  const tramite = Array.isArray(tramiteRecibido) ? tramiteRecibido[0] : tramiteRecibido; 
  if (!tramite) return null;

  // LÓGICA DE FILTRADO
  let linkCabecera = null;
  if (tramite.enlacesJson) {
    try {
      const enlaces = typeof tramite.enlacesJson === 'string' 
        ? JSON.parse(tramite.enlacesJson) 
        : tramite.enlacesJson;
      linkCabecera = enlaces.find(e => e.id === 'cabecera_solicitud');// Buscamos el enlace específico para la cabecera
    } catch (e) {
      console.error("Error al buscar link de cabecera:", e);
    }
  }

  const renderizarContenidoEnriquecido = () => {
    let textoFinal = tramite.descripcionHtml || ""; 
    const rawEnlaces = tramite.enlacesJson;

    if (rawEnlaces) {
      try {
        const enlaces = typeof rawEnlaces === 'string' ? JSON.parse(rawEnlaces) : rawEnlaces;
        if (Array.isArray(enlaces)) {
          enlaces.forEach(enlace => {
            const htmlLink = `<a href="${enlace.url}" target="_blank" class="enlace-sede-dinamico">${enlace.label}</a>`;
            const marcador = `{{${enlace.id}}}`;
            textoFinal = textoFinal.split(marcador).join(htmlLink);
          });
        }
      } catch (e) {
        console.error("Error al procesar enlacesJson:", e);
      }
    }
    return { __html: textoFinal };
  };

  return (
    <div style={{ padding: '30px 20px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', backgroundColor: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
        
        {/* CABECERA */}
        <div style={{ padding: '40px', background: 'linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)', borderBottom: '1px solid #eee' }}>
          <button onClick={volver} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 'bold', marginBottom: '20px' }}>
            ← VOLVER AL BUSCADOR
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
            <h1 style={{ margin: 0, color: '#222', flex: 1, fontSize: '2rem', letterSpacing: '-0.02em' }}>{tramite.titulo}</h1>
            
            {/* BLOQUE DE ACCIONES */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '220px' }}>
              {tramite.estado === 'CERRADO' ? (
                <div style={{ color: 'white', backgroundColor: '#999', padding: '15px', borderRadius: '8px', fontWeight: '700', textAlign: 'center' }}>
                  PLAZO CERRADO
                </div>
              ) : (
                /* Aquí ya no preguntamos si es 0, porque si estamos en la FICHA, sabemos que lo es */
                tramite.estado === 'VIGENTE' && (
                  <>
                    {tramite.urlExterna && (
                      <button 
                        /* Cambiado a window.open para abrir pestaña nueva */
                        onClick={() => window.open(tramite.urlExterna, '_blank')}
                        style={{ 
                          backgroundColor: 'var(--primary-color)', color: 'white', padding: '16px', borderRadius: '8px', 
                          border: 'none', fontWeight: '600', cursor: 'pointer', fontSize: '1rem',
                          boxShadow: '0 4px 12px rgba(0, 115, 171, 0.15)' 
                        }}>
                        TRAMITAR AHORA
                      </button>
                    )}
                    
                    {/* Enlace al PDF de la cabecera (si existe) */}
                    {linkCabecera && (
                      <a href={linkCabecera.url} target="_blank" rel="noreferrer"
                        style={{ 
                          color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '600', 
                          textAlign: 'center', fontSize: '0.9rem', display: 'flex', 
                          justifyContent: 'center', alignItems: 'center', marginTop: '5px' 
                        }}>
                        <IconoPro nombre="descarga" /> {linkCabecera.label} (PDF)
                      </a>
                    )}
                  </>
                )
              )}
            </div>
          </div>
        </div>

        {/* NAVEGACIÓN PESTAÑAS */}
        <div style={{ display: 'flex', borderBottom: '1px solid #eee' }}>
          {['información', 'documentación', 'normativa']
            .filter(tab => {
              if (tab === 'información') return true;
              if (tab === 'documentación') return tramite.documentos?.length > 0;
              if (tab === 'normativa') return tramite.normativas?.length > 0;
              return false;
            })
            .map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)} 
                style={{ 
                  flex: 1, padding: '20px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: '700', 
                  color: activeTab === tab ? 'var(--primary-color)' : '#888', 
                  borderBottom: activeTab === tab ? '4px solid var(--primary-color)' : '4px solid transparent', transition: '0.3s' 
                }}
              >
                {tab.toUpperCase()}
              </button>
            ))}
        </div>

        {/* CONTENIDO DINÁMICO */}
        <div style={{ padding: '50px' }}>
          {activeTab === 'información' && (
            <div>
              {tramite.fechaPublicacion && (
                <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                  <span style={{ fontSize: '0.85em', color: '#666', fontStyle: 'italic' }}>
                    Última actualización: {new Date(tramite.fechaPublicacion).toLocaleDateString('es-ES')}
                  </span>
                </div>
              )}
              <div 
                style={{ lineHeight: '1.8', color: '#333', fontSize: '1.05rem' }} 
                dangerouslySetInnerHTML={renderizarContenidoEnriquecido()} 
              />
            </div>
          )}

          {activeTab === 'documentación' && (
          <div style={{ color: '#333' }}>
            <h3 style={{ color: 'var(--primary-color)', marginBottom: '25px', display: 'flex', alignItems: 'center' }}>
              <IconoPro nombre="expediente" /> Documentación Requerida
            </h3>
            
            {tramite.documentos.map((doc, i) => (
              <div key={i} style={{ padding: '20px', borderBottom: '1px solid #eee', backgroundColor: i % 2 === 0 ? '#fcfcfc' : 'white' }}>
                <strong style={{ fontSize: '1.1rem', color: '#222' }}>{doc.nombre}</strong>
                <div 
                  className="descripcion-tramite-container" 
                  style={{ color: '#555', marginTop: '8px', fontSize: '0.95rem' }} 
                  dangerouslySetInnerHTML={{ __html: doc.descripcion }} 
                />
              </div>
            ))}
          </div>
        )}

          {activeTab === 'normativa' && (
            <div>
              <h3 style={{ color: 'var(--primary-color)', marginBottom: '25px' }}>Normativa Aplicable</h3>
              {tramite.normativas.map((norma, i) => (
                <div key={i} style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                  <a href={norma.enlaceBoletin} target="_blank" rel="noopener noreferrer" 
                     style={{ color: 'var(--primary-hover)', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                    {norma.referencia}
                  </a>
                  <p style={{ margin: '5px 0 0 24px', fontSize: '0.9rem', color: '#666' }}>{norma.descripcionCorta}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FichaTramite;