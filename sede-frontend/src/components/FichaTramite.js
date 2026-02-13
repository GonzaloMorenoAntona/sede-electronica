import React from 'react';

const FichaTramite = ({ tramite, volver, activeTab, setActiveTab }) => {
  if (!tramite) return null;

  return (
    <div style={{ fontFamily: '"Segoe UI", Roboto, sans-serif', backgroundColor: '#eff2f5', minHeight: '100vh', padding: '30px 20px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', backgroundColor: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
        
        <div style={{ padding: '40px', background: 'linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)', borderBottom: '1px solid #eee' }}>
          <button onClick={volver} style={{ background: 'none', border: 'none', color: '#af272f', cursor: 'pointer', fontWeight: 'bold', marginBottom: '20px' }}>← VOLVER</button>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ margin: 0, color: '#222' }}>{tramite.titulo}</h1>
            <button style={{ backgroundColor: '#af272f', color: 'white', padding: '15px 35px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>TRAMITAR AHORA</button>
          </div>
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid #eee' }}>
          {['información', 'documentacion', 'normativa'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, padding: '20px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: '700', color: activeTab === tab ? '#af272f' : '#888', borderBottom: activeTab === tab ? '4px solid #af272f' : '4px solid transparent' }}>
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        <div style={{ padding: '50px' }}>
          {activeTab === 'info' && (
            <div>
              <h3 style={{ color: '#af272f' }}>Objeto del Procedimiento</h3>
              <p style={{ whiteSpace: 'pre-line' }}>{tramite.descripcion}</p>
            </div>
          )}
          {activeTab === 'docs' && (
            <div>
              <h3 style={{ color: '#af272f' }}>Documentación</h3>
              {tramite.documentos?.map((doc, i) => (
                <div key={i} style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
                  <strong>📄 {doc.nombre}</strong>
                  <p>{doc.descripcion}</p>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'normas' && (
            <div>
              <h3 style={{ color: '#af272f' }}>Normativa</h3>
              {tramite.normativas?.map((norma, i) => (
                <div key={i} style={{ marginBottom: '15px' }}>
                  <a href={norma.enlaceBoletin} target="_blank" rel="noreferrer" style={{ color: '#0056b3', fontWeight: 'bold' }}>🔗 {norma.referencia}</a>
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