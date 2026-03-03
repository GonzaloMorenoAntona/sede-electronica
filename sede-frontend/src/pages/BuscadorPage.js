import React, { useState, useEffect } from 'react';
import BuscadorUI from '../components/Buscador';
import { buscarTramites } from '../services/tramiteService';

const BuscadorPage = ({ abrirTramite, categorias }) => {
  const [searchTerm, setSearchTerm]       = useState('');
  const [results, setResults]             = useState([]);
  const [isLoading, setIsLoading]         = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState(null);
  const [filtroTipo, setFiltroTipo]       = useState(null);

  const handleSearch = async () => {
    if (!searchTerm.trim() && !filtroCategoria && !filtroTipo) {
      setResults([]);
      return;
    }
    setIsLoading(true);
    try {
      const data = await buscarTramites(searchTerm, filtroCategoria, filtroTipo);
      setResults(data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Live search automático
  useEffect(() => {
    handleSearch();
  }, [searchTerm, filtroCategoria, filtroTipo]);

  return (
    <BuscadorUI
      searchTerm={searchTerm}         setSearchTerm={setSearchTerm}
      results={results}               isLoading={isLoading}
      filtroCategoria={filtroCategoria} setFiltroCategoria={setFiltroCategoria}
      filtroTipo={filtroTipo}         setFiltroTipo={setFiltroTipo}
      categorias={categorias}
      abrirTramite={abrirTramite}
      handleSearch={(e) => { if (e) e.preventDefault(); handleSearch(); }}
    />
  );
};

export default BuscadorPage;