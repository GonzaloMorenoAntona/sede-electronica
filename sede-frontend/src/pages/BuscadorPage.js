import React, { useState, useEffect, useCallback } from 'react';
import BuscadorUI from '../components/Buscador';
import { buscarTramites } from '../services/tramiteService';

const BuscadorPage = ({ abrirTramite, categorias }) => {
  const [searchTerm, setSearchTerm]           = useState('');
  const [results, setResults]                 = useState([]);
  const [isLoading, setIsLoading]             = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState([]);

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim() && filtroCategoria.length === 0) {
      setResults([]);
      return;
    }
    setIsLoading(true);
    try {
      const data = await buscarTramites(searchTerm, filtroCategoria);
      setResults(data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, filtroCategoria]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  return (
    <BuscadorUI
      searchTerm={searchTerm}           setSearchTerm={setSearchTerm}
      results={results}                 isLoading={isLoading}
      filtroCategoria={filtroCategoria} setFiltroCategoria={setFiltroCategoria}
      categorias={categorias}
      abrirTramite={abrirTramite}
      handleSearch={(e) => { if (e) e.preventDefault(); handleSearch(); }}
    />
  );
};

export default BuscadorPage;
