import React, { useState, useEffect } from 'react';
import BuscadorUI from '../components/Buscador'; // Tu componente visual

const BuscadorPage = ({ abrirTramite, categorias }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState(null);

  const handleSearch = async () => {
    // Si no hay nada escrito ni filtros, no buscamos nada
    if (!searchTerm.trim() && !filtroCategoria && !filtroTipo) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    let url = `/api/tramites/buscar?q=${encodeURIComponent(searchTerm)}`;
    if (filtroCategoria) url += `&categoria=${filtroCategoria}`;
    if (filtroTipo) url += `&tipo=${filtroTipo}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Live Search automático
  useEffect(() => {
    handleSearch();
  }, [searchTerm, filtroCategoria, filtroTipo]);

  return (
    <BuscadorUI 
      searchTerm={searchTerm} setSearchTerm={setSearchTerm}
      results={results} isLoading={isLoading}
      filtroCategoria={filtroCategoria} setFiltroCategoria={setFiltroCategoria}
      filtroTipo={filtroTipo} setFiltroTipo={setFiltroTipo}
      categorias={categorias}
      abrirTramite={abrirTramite}
      handleSearch={(e) => { if(e) e.preventDefault(); handleSearch(); }}
    />
  );
};

export default BuscadorPage;