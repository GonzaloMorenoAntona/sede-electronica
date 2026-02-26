import React from 'react';

const SubvencionesTable = ({ datos }) => {
  
  const parseAnexos = (json) => {
    try {
      return typeof json === 'string' ? JSON.parse(json) : json;
    } catch (e) { return []; }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {datos.map((sub) => (
        <div key={sub.id} className="area-card-simple">
          {/* LÍNEA 1: Título y Acciones */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
            <div>
              <small style={{ color: '#718096', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                FINALIZA EL: {new Date(sub.fechaFin).toLocaleDateString()}
              </small>
              <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#2d3748', lineHeight: '1.4' }}>
                {sub.titulo}
              </h4>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <a href={sub.url_convocatoria} target="_blank" rel="noreferrer" className="enlace-sede-dinamico" style={{ fontSize: '0.9rem' }}>
                BASES
              </a>
              <a href={sub.url_justificacion} target="_blank" rel="noreferrer" className="enlace-sede-dinamico" style={{ fontSize: '0.9rem' }}>
                ➜ TRAMITAR
              </a>
            </div>
          </div>

          {/* LÍNEA 2: Documentación / Anexos */}
          <div style={{ 
            borderTop: '1px solid var(--border-color)', 
            paddingTop: '12px', 
            display: 'flex', 
            gap: '15px', 
            flexWrap: 'wrap' 
          }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#4a5568' }}>ANEXOS:</span>
            {parseAnexos(sub.anexos).map((anexo, i) => (
              <a key={i} href={anexo.url} target="_blank" rel="noreferrer" className="enlace-sede-dinamico" style={{ fontSize: '0.85rem', textDecoration: 'none' }}>
                 {anexo.label}
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubvencionesTable;