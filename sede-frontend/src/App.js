import React, { useState } from 'react';

function App() {
  const [view, setView] = useState('BUSCADOR');
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('info'); 
  const [tramiteDetalle, setTramiteDetalle] = useState(null);

  // --- LÓGICA DE BÚSQUEDA ---
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/tramites/buscar?q=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      setResults(data);
    } catch (error) { console.error("Error:", error); } 
    finally { setIsLoading(false); }
  };

  // --- NAVEGACIÓN Y CARGA ---
  const abrirTramite = async (id) => {
    setView('DETALLE');
    setActiveTab('info');
    try {
      const response = await fetch(`/api/tramites/${id}/detalle`);
      const data = await response.json();
      setTramiteDetalle(data);
    } catch (error) { alert("Error al cargar la ficha."); }
  };

  if (view === 'BUSCADOR') {
    return (
      <div style={{ fontFamily: '"Segoe UI", Tahoma, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '40px 20px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ color: '#af272f', fontSize: '2.8em', fontWeight: '800', marginBottom: '10px' }}>Buscador Global</h1>
          <p style={{ color: '#555', fontSize: '1.2em', marginBottom: '40px' }}>Ayuntamiento de Ciudad Real</p>
          
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '15px', marginBottom: '50px' }}>
            <input 
              type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="¿Qué trámite necesitas? (Ej: Obras, Padrón...)" 
              style={{ flexGrow: 1, padding: '18px 25px', borderRadius: '50px', border: '1px solid #ddd', fontSize: '1.1em', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', outline: 'none' }}
            />
            <button type="submit" style={{ padding: '0 45px', backgroundColor: '#af272f', color: 'white', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1em' }}>BUSCAR</button>
          </form>

          <div style={{ display: 'grid', gap: '20px' }}>
            {results.map(item => (
              <div key={item.id} onClick={() => abrirTramite(item.id)} style={{ backgroundColor: 'white', padding: '25px', borderRadius: '15px', textAlign: 'left', cursor: 'pointer', borderLeft: '8px solid #af272f', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform='scale(1.01)'} onMouseOut={e => e.currentTarget.style.transform='scale(1)'}>
                <h3 style={{ margin: '0 0 8px 0', color: '#af272f', fontSize: '1.4em' }}>{item.titulo}</h3>
                <p style={{ margin: 0, color: '#666', lineHeight: '1.5' }}>{item.descripcion?.substring(0, 160)}...</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- VISTA DETALLE (FICHA TÉCNICA PROFESIONAL) ---
  return (
    <div style={{ fontFamily: '"Segoe UI", Roboto, sans-serif', backgroundColor: '#eff2f5', minHeight: '100vh', padding: '30px 20px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', backgroundColor: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
        
        {/* CABECERA */}
        <div style={{ padding: '40px', background: 'linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)', borderBottom: '1px solid #eee' }}>
          <button onClick={() => setView('BUSCADOR')} style={{ background: 'none', border: 'none', color: '#af272f', cursor: 'pointer', fontWeight: 'bold', marginBottom: '20px', fontSize: '1em' }}>← VOLVER AL BUSCADOR</button>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
            <div>
              <h1 style={{ margin: 0, color: '#222', fontSize: '2.2em', lineHeight: '1.2' }}>{tramiteDetalle?.titulo}</h1>
              <div style={{ marginTop: '15px', display: 'flex', gap: '15px' }}>
                <span style={{ backgroundColor: '#fff', border: '1px solid #ddd', padding: '6px 15px', borderRadius: '20px', fontSize: '0.85em', color: '#666', fontWeight: 'bold' }}>📂 {tramiteDetalle?.unidadTramitadora || 'Urbanismo'}</span>
                <span style={{ backgroundColor: '#af272f15', color: '#af272f', padding: '6px 15px', borderRadius: '20px', fontSize: '0.85em', fontWeight: 'bold' }}>ID: {tramiteDetalle?.id}</span>
              </div>
            </div>
            <button style={{ backgroundColor: '#af272f', color: 'white', border: 'none', padding: '15px 35px', borderRadius: '10px', fontWeight: 'bold', fontSize: '1.1em', cursor: 'pointer', boxShadow: '0 4px 10px rgba(175, 39, 47, 0.3)' }}>TRAMITAR AHORA</button>
          </div>
        </div>

        {/* PESTAÑAS */}
        <div style={{ display: 'flex', backgroundColor: '#fcfcfc', borderBottom: '1px solid #eee' }}>
          {['info', 'docs', 'normas'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, padding: '20px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '1.05em', color: activeTab === tab ? '#af272f' : '#888', borderBottom: activeTab === tab ? '4px solid #af272f' : '4px solid transparent', transition: '0.3s' }}>
              {tab === 'info' ? 'INFORMACIÓN GENERAL' : tab === 'docs' ? 'DOCUMENTACIÓN' : 'NORMATIVA'}
            </button>
          ))}
        </div>

        {/* CONTENIDO DINÁMICO */}
        <div style={{ padding: '50px', lineHeight: '1.8', color: '#333', fontSize: '1.05em' }}>
          
          {activeTab === 'info' && (
            <div style={{ animation: 'fadeIn 0.5s' }}>
              <h3 style={{ color: '#af272f', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px', marginBottom: '20px' }}>Objeto del Procedimiento</h3>
              <p style={{ whiteSpace: 'pre-line', marginBottom: '40px' }}>{tramiteDetalle?.descripcion}</p>
              
              <div style={{ backgroundColor: '#fff9f9', borderLeft: '5px solid #af272f', padding: '25px', borderRadius: '0 10px 10px 0' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#af272f' }}>Notas Importantes</h4>
                <p style={{ margin: 0, fontSize: '0.95em' }}>
                  Una vez ejecutadas las nuevas obras, el interesado/a obtendrá junto con la declaración responsable de primera ocupación, la acometida definitiva de agua.<br/><br/>
                  <strong>Liquidación:</strong> Deberá liquidar el I.C.I.O. correspondiente (Ordenanza fiscal C-4).<br/><br/>
                  <strong>Archivos pesados:</strong> En caso de necesitar varios Registros telemáticos por volumen máximo (20MB), haga mención al primer número de Registro de Entrada para anexarlos al expediente.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'docs' && (
            <div style={{ animation: 'fadeIn 0.5s' }}>
              <h3 style={{ color: '#af272f', marginBottom: '25px' }}>Requisitos y Documentos a aportar</h3>
              {tramiteDetalle?.documentos?.length > 0 ? (
                tramiteDetalle.documentos.map((doc, i) => (
                  <div key={i} style={{ padding: '20px', border: '1px solid #eee', borderRadius: '10px', marginBottom: '15px' }}>
                    <div style={{ fontWeight: 'bold', color: '#222', marginBottom: '5px', fontSize: '1.1em' }}>📄 {doc.nombre}</div>
                    <div style={{ color: '#666', fontSize: '0.95em' }}>{doc.descripcion}</div>
                  </div>
                ))
              ) : <p>Cargando requisitos...</p>}
            </div>
          )}

          {activeTab === 'normas' && (
            <div style={{ animation: 'fadeIn 0.5s' }}>
              <h3 style={{ color: '#af272f', marginBottom: '25px' }}>Marco Jurídico</h3>
              {tramiteDetalle?.normativas?.map((norma, i) => (
                <div key={i} style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8fafd', borderRadius: '8px' }}>
                  <a href={norma.enlaceBoletin} target="_blank" rel="noreferrer" style={{ color: '#0056b3', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1em' }}>
                    🔗 {norma.referencia}
                  </a>
                  <p style={{ margin: '5px 0 0 0', color: '#555' }}>{norma.descripcionCorta}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

export default App;