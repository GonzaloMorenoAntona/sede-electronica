import React from 'react';

const FichaTramite = ({ tramite, volver, activeTab, setActiveTab }) => {
  if (!tramite) return null;

  // FUNCIÓN PARA SUSTITUIR {{id}} POR EL ENLACE REAL
  const renderizarContenidoEnriquecido = () => {
  // 1. Usamos los nombres EXACTOS que vienen en tu JSON
  let textoFinal = tramite.descripcion || "";
  const rawEnlaces = tramite.enlaces;

  if (rawEnlaces) {
    try {
      // 2. Parseamos el string JSON a un array de objetos
      const enlaces = typeof rawEnlaces === 'string' ? JSON.parse(rawEnlaces) : rawEnlaces;
      
      if (Array.isArray(enlaces)) {
        enlaces.forEach(enlace => {
          // 3. Definimos el HTML del enlace azul y negrita
          const htmlLink = `<a href="${enlace.url}" target="_blank" class="enlace-sede-dinamico">${enlace.label}</a>`;
          
          // 4. Creamos el marcador (ej: {{tramite_e}})
          const marcador = `{{${enlace.id}}}`;
          
          // 5. Reemplazo global: cambiamos todas las ocurrencias
          textoFinal = textoFinal.split(marcador).join(htmlLink);
        });
      }
    } catch (e) {
      console.error("Error al procesar el JSON de enlaces:", e);
    }
  }

  return { __html: textoFinal };
};
  return (
    <div style={{ fontFamily: '"Segoe UI", Roboto, sans-serif', backgroundColor: 'transparent', minHeight: '100vh', padding: '30px 20px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', backgroundColor: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
        
        {/* CABECERA */}
        <div style={{ padding: '40px', background: 'linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)', borderBottom: '1px solid #eee' }}>
          <button onClick={volver} style={{ background: 'none', border: 'none', color: '#af272f', cursor: 'pointer', fontWeight: 'bold', marginBottom: '20px' }}>← VOLVER AL BUSCADOR</button>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* El TÍTULO ahora es texto plano del campo tramite.titulo */}
            <h1 style={{ margin: 0, color: '#222' }}>{tramite.titulo}</h1>
            <button 
              onClick={() => tramite.urlExterna && window.open(tramite.urlExterna, '_blank')}
              style={{ backgroundColor: '#af272f', color: 'white', padding: '15px 35px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
            >
              TRAMITAR AHORA
            </button>
          </div>
        </div>

        {/* NAVEGACIÓN PESTAÑAS */}
        <div style={{ display: 'flex', borderBottom: '1px solid #eee' }}>
          {['información', 'documentación', 'normativa'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, padding: '20px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: '700', color: activeTab === tab ? '#af272f' : '#888', borderBottom: activeTab === tab ? '4px solid #af272f' : '4px solid transparent', transition: '0.3s' }}>
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