import React, { useState } from 'react';
// IMPORTANTE: Fíjate en los puntos y barras (./components/...)
import Buscador from './components/Buscador';
import FichaTramite from './components/FichaTramite';

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
    try {
      const response = await fetch(`/api/tramites/${id}/detalle`);
      const data = await response.json();
      setTramiteDetalle(data);
      setView('DETALLE');
    } catch (error) { alert("Error al cargar."); }
  };

  return (
    <>
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
    </>
  );
}

export default App;