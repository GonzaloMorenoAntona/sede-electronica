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
  filtroCategoria, setFiltroCategoria,
  filtroTipo, setFiltroTipo,
  categorias
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const manejarSeleccion = (item) => {
    if (Number(item.esEnlaceExterno) === 1 && item.urlExterna) {
      window.open(item.urlExterna, '_blank');
    } else {
      abrirTramite(item.id);
    }
  };

  const seccionesFiltro = [
    {
      titulo: 'ÁREAS',
      lista: categorias,
      estado: filtroCategoria,
      setter: setFiltroCategoria,
    },
    {
      titulo: 'TIPO',
      lista: ['TRAMITE', 'NOTICIA', 'INFORMACIÓN MUNICIPAL', 'DOCUMENTACIÓN PARA CONCEJALES/AS', 'NOTAS DE INTERÉS'],
      estado: filtroTipo,
      setter: setFiltroTipo,
    },
  ];

  return (
    <div className="buscador-wrapper">

      {/* Formulario */}
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

      {/* Botón filtros */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="buscador-btn-filtros"
      >
        <Icon d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" size={14} color="var(--primary-color)" />
        {showFilters ? 'OCULTAR FILTROS' : 'FILTROS'}
      </button>

      {/* Panel de filtros */}
      {showFilters && (
        <div className="buscador-filter-panel">
          {seccionesFiltro.map((seccion, idx) => (
            <div key={idx}>
              <h4 className="buscador-filter-title">{seccion.titulo}</h4>
              <div className="buscador-filter-tags">
                {seccion.lista.map(obj => {
                  const val    = typeof obj === 'string' ? obj : obj.id;
                  const label  = typeof obj === 'string' ? obj : obj.nombre;
                  const activo = seccion.estado === val;
                  return (
                    <button
                      key={val}
                      onClick={() => seccion.setter(activo ? null : val)}
                      className={`buscador-tag ${activo ? 'buscador-tag--activo' : ''}`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resultados */}
      <div className="buscador-resultados">
        {results.map(item => (
          <div
            key={item.id}
            onClick={() => manejarSeleccion(item)}
            className="buscador-card"
          >
            <span style={{ fontSize: '0.7rem', color: '#a0aec0', fontWeight: 700, textTransform: 'uppercase' }}>
              {item.tipo}
            </span>
            <h3 style={{ margin: '5px 0 0 0', color: '#2d3748', fontSize: '1.15rem', fontWeight: 600 }}>
              {item.titulo}
            </h3>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Buscador;