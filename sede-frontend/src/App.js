import React, { useState } from 'react';
import Buscador from './components/Buscador';
import FichaTramite from './components/FichaTramite';

import imagenFondo from './assets/fondo.jpg'; //imagen de fondo

function App() {
  const [view, setView] = useState('BUSCADOR');
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('info'); 
  const [tramiteDetalle, setTramiteDetalle] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/tramites/buscar?q=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      setResults(data);
    } catch (error) { console.error(error); } finally { setIsLoading(false); }
  };

  const abrirTramite = async (id) => {
    setActiveTab('información')
    try {
      const response = await fetch(`/api/tramites/${id}/detalle`);
      const data = await response.json();
      setTramiteDetalle(data);
      setView('DETALLE');
    } catch (error) { alert("Error al cargar."); }
  };

  return (
    // CAMBIO IMPORTANTE: Quitamos el style del div principal para manejarlo por capas
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      
      {/* --- CAPA DEL FONDO (DEFINITIVA) --- */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        backgroundImage: `url(${imagenFondo})`, 
        
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: 'contain',  // 'contain' ajusta la foto para que se vea entera
        opacity: 0.5,               // Ponemos 0.5 para asegurarnos de que se ve
        pointerEvents: 'none'
      }}></div>

      {/* --- CAPA DE CONTENIDO (APP) --- */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {view === 'BUSCADOR' ? (
          <Buscador 
            searchTerm={searchTerm} setSearchTerm={setSearchTerm}
            handleSearch={handleSearch} results={results}
            abrirTramite={abrirTramite} isLoading={isLoading}
          />
        ) : (
          <FichaTramite 
            tramite={tramiteDetalle} 
            volver={() => setView('BUSCADOR')} 
            activeTab={activeTab} setActiveTab={setActiveTab}
          />
        )}
      </div>

    </div>
  );
}

export default App;