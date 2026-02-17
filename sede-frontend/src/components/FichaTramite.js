import React from 'react';

const FichaTramite = ({ tramite: tramiteRecibido, volver, activeTab, setActiveTab }) => {
  
  // 1. NORMALIZACIÓN: Sacamos el objeto del Array para poder leer sus propiedades
  const tramite = Array.isArray(tramiteRecibido) ? tramiteRecibido[0] : tramiteRecibido;

  // Si no hay trámite, no renderizamos nada
  if (!tramite) return null;

  const renderizarContenidoEnriquecido = () => {
  // Ahora usamos los nombres "de verdad" que vienen del Map corregido
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
    <div style={{ fontFamily: '"Segoe UI", Roboto, sans-serif', backgroundColor: 'transparent', minHeight: '100vh', padding: '30px 20px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', backgroundColor: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
        
        {/* CABECERA */}
<div style={{ padding: '40px', background: 'linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)', borderBottom: '1px solid #eee' }}>
  <button onClick={volver} style={{ background: 'none', border: 'none', color: '#af272f', cursor: 'pointer', fontWeight: 'bold', marginBottom: '20px' }}>
    ← VOLVER AL BUSCADOR
  </button>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
    <h1 style={{ margin: 0, color: '#222', flex: 1 }}>{tramite.titulo}</h1>
    
    {/* EL CAMBIO: Solo se muestra si hay URL */}
    {tramite.urlExterna && (
      <button 
        onClick={() => window.open(tramite.urlExterna, '_blank')}
        style={{ 
          backgroundColor: '#af272f', 
          color: 'white', 
          padding: '18px 40px', 
          borderRadius: '12px', 
          border: 'none', 
          fontWeight: 'bold', 
          cursor: 'pointer',
          fontSize: '1.1em',
          boxShadow: '0 4px 15px rgba(175, 39, 47, 0.2)',
          whiteSpace: 'nowrap' // Para que no se corte el texto
        }}
      >
        TRAMITAR AHORA 
      </button>
    )}
  </div>
</div>

        {/* NAVEGACIÓN PESTAÑAS DINÁMICA */}
<div style={{ display: 'flex', borderBottom: '1px solid #eee' }}>
  {['información', 'documentación', 'normativa']
    .filter(tab => {
      // Reglas de visibilidad:
      if (tab === 'información') return true; // Siempre visible
      if (tab === 'documentación') return tramite.documentos?.length > 0;
      if (tab === 'normativa') return tramite.normativas?.length > 0;
      return false;
    })
    .map(tab => (
      <button 
        key={tab} 
        onClick={() => setActiveTab(tab)} 
        style={{ flex: 1, padding: '20px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: '700', color: activeTab === tab ? '#af272f' : '#888', 
          borderBottom: activeTab === tab ? '4px solid #af272f' : '4px solid transparent', transition: '0.3s' 
        }}
      >
        {tab.toUpperCase()}
      </button>
    ))}
</div>

        {/* CONTENIDO */}
        <div style={{ padding: '50px' }}>
          {activeTab === 'información' && (
            <div>
              {tramite.fechaPublicacion && (
                <div style={{ textAlign: 'right', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.85em', color: '#666', fontStyle: 'italic' }}>
                    Última actualización: {new Date(tramite.fechaPublicacion).toLocaleDateString('es-ES')}
                  </span>
                </div>
              )}

              {/* El contenido completo (incluyendo títulos específicos) viene de aquí */}
              <div 
                style={{ lineHeight: '1.9', color: '#333' }} 
                dangerouslySetInnerHTML={renderizarContenidoEnriquecido()} 
              />
            </div>
          )}
                  
          {/* Pestañas de Documentación y Normativa se mantienen igual */}
          {activeTab === 'documentación' && (
             <div style={{ color: '#333' }}>
                <h3 style={{ color: '#af272f' }}>Documentación Requerida</h3>
                {tramite.documentos?.length > 0 ? tramite.documentos.map((doc, i) => (
                    <div key={i} style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
                        <strong>📄 {doc.nombre}</strong>
                        <div style={{ color: '#666', marginTop: '5px', fontSize: '0.95em' }} dangerouslySetInnerHTML={{ __html: doc.descripcion }} />
                    </div>
                )) : <p>No se requiere documentación adicional.</p>}
             </div>
          )}

          {activeTab === 'normativa' && (
            <div>
              <h3 style={{ color: '#af272f' }}>Normativa Aplicable</h3>
              {tramite.normativas?.length > 0 ? tramite.normativas.map((norma, i) => (
                <div key={i} style={{ marginBottom: '15px' }}>
                  {norma.enlaceBoletin ? (
                      <a href={norma.enlaceBoletin} target="_blank" rel="noopener noreferrer" style={{ color: '#0056b3', fontWeight: 'bold', textDecoration: 'none' }}>
                        🔗 {norma.referencia}
                      </a>
                  ) : (
                      <span style={{ color: '#333', fontWeight: 'bold' }}>⚖️ {norma.referencia}</span>
                  )}
                </div>
              )) : <p>No hay normativa registrada.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FichaTramite;