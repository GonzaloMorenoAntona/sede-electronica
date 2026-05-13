import React, { useState } from 'react';
import './Buscador.css';

const Icon = ({ d, size = 18, color = "var(--primary-color)" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const Buscador = ({
  searchTerm, setSearchTerm,
  handleSearch, results,
  abrirTramite, isLoading,
  filtroCategoria = [], setFiltroCategoria,
  categorias = []
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const manejarSeleccion = (item) => {
    if (Number(item.esEnlaceExterno) === 1 && item.urlExterna) {
      window.open(item.urlExterna, '_blank');
    } else {
      abrirTramite(item.id);
    }
  };

  const toggleCategoria = (id) => {
    setFiltroCategoria(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const getNombreCategoria = (item) => {
  const cat = categorias.find(c => c.id === item.categoriaId);
  return cat ? cat.nombre : null;
};

  return (
    <div className="buscador-wrapper">

      <form onSubmit={handleSearch} className="buscador-form">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="¿Qué necesitas?"
          className="buscador-input"
        />
        <button type="submit" className="buscador-btn-buscar">
          {isLoading ? '...' : 'BUSCAR'}
        </button>
      </form>

      <button
        onClick={() => setShowFilters(!showFilters)}
        className="buscador-btn-filtros"
      >
        <Icon d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" size={14} color="var(--primary-color)" />
        {showFilters ? 'OCULTAR FILTROS' : 'FILTROS'}
        {filtroCategoria.length > 0 && (
          <span className="buscador-filtros-count">{filtroCategoria.length}</span>
        )}
      </button>

      {showFilters && (
        <div className="buscador-filter-panel">
          <h4 className="buscador-filter-title">ÁREAS MUNICIPALES</h4>
          <div className="buscador-filter-tags">
            {categorias.map(cat => {
              const activo = filtroCategoria.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategoria(cat.id)}
                  className={`buscador-tag ${activo ? 'buscador-tag--activo' : ''}`}
                >
                  {cat.nombre}
                </button>
              );
            })}
          </div>
          {filtroCategoria.length > 0 && (
            <button
              className="buscador-limpiar-filtros"
              onClick={() => setFiltroCategoria([])}
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      <div className="buscador-resultados">
        {results.map(item => {
          const nombreCat = getNombreCategoria(item);
          return (
            <div
            key={item.id}
            onClick={() => manejarSeleccion(item)}
            className="buscador-card"
          >
            <div className="buscador-card-meta">
              <span className="buscador-card-tipo">{item.tipo || 'TRÁMITE'}</span>
              {getNombreCategoria(item) && (
                <>
                  <span className="buscador-card-separador">·</span>
                  <span className="buscador-card-categoria">{getNombreCategoria(item)}</span>
                </>
              )}
            </div>
            <h3 className="buscador-card-titulo">{item.titulo}</h3>
          </div>
          );
        })}
      </div>

    </div>
  );
};

export default Buscador;