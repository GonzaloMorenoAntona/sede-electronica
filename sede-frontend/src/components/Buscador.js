import React, { useState } from 'react';
const Buscador = ({ 
  searchTerm, setSearchTerm, handleSearch, results, abrirTramite, isLoading,
  filtroCategoria, setFiltroCategoria, filtroTipo, setFiltroTipo,
  categorias // Recibimos las categorías reales de la base de datos
}) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div style={{ fontFamily: '"Segoe UI", sans-serif', backgroundColor: 'transparent', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        <h1 style={{ color: '#af272f', textAlign: 'center', fontWeight: '800', marginBottom: '30px' }}>Buscador Global</h1>
        
        {/* BARRA DE BÚSQUEDA */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
          <input 
            type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="¿Qué trámite necesitas?" 
            style={{ flexGrow: 1, padding: '15px 25px', borderRadius: '50px', border: '1px solid #ddd', outline: 'none', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}
          />
          <button type="submit" style={{ padding: '0 35px', backgroundColor: '#af272f', color: 'white', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold' }}>
            {isLoading ? '...' : 'BUSCAR'}
          </button>
        </form>

        {/* BOTÓN PARA DESPLEGAR FILTROS */}
        <div style={{ textAlign: 'left', marginBottom: '20px' }}>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            style={{ background: 'none', border: 'none', color: '#af272f', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9em', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            {showFilters ? '▲ OCULTAR FILTROS' : '▼ AÑADIR FILTROS'} 
            {(filtroCategoria || filtroTipo) && <span style={{ backgroundColor: '#af272f', color: 'white', borderRadius: '50%', padding: '2px 8px', fontSize: '0.8em' }}>!</span>}
          </button>
        </div>

        {/* ACORDEÓN DE FILTROS DINÁMICO */}
        {showFilters && (
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            
            {/* ÁREAS DINÁMICAS DESDE BD */}
            <div>
              <h4 style={{ color: '#af272f', marginTop: 0, fontSize: '1em' }}>Áreas Municipales</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {categorias.map(cat => (
                  <button 
                    key={cat.id} 
                    onClick={() => setFiltroCategoria(filtroCategoria === cat.id ? null : cat.id)} 
                    style={btnFiltro(filtroCategoria === cat.id)}
                  >
                    {cat.nombre}
                  </button>
                ))}
              </div>
            </div>

            {/* TIPOS DE CONTENIDO */}
            <div>
              <h4 style={{ color: '#af272f', marginTop: 0, fontSize: '1em' }}>Tipo de Contenido</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['TRAMITE', 'GUIA', 'NOTICIA'].map(tipo => (
                  <button 
                    key={tipo} 
                    onClick={() => setFiltroTipo(filtroTipo === tipo ? null : tipo)} 
                    style={btnFiltro(filtroTipo === tipo)}
                  >
                    {tipo}
                  </button>
                ))}
              </div>
              
              {(filtroCategoria || filtroTipo) && (
                <button onClick={() => { setFiltroCategoria(null); setFiltroTipo(null); }} 
                        style={{ marginTop: '20px', border: 'none', background: 'none', color: '#888', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.85em' }}>
                  Limpiar todos los filtros
                </button>
              )}
            </div>
          </div>
        )}

        {/* RESULTADOS */}
        <div style={{ display: 'grid', gap: '15px' }}>
          {results.length > 0 ? results.map(item => (
            <div 
              key={item.id} 
              onClick={() => abrirTramite(item.id)} 
              style={{ 
                backgroundColor: 'white', 
                padding: '20px', // Un poco menos de padding para que sea compacto
                borderRadius: '12px', 
                cursor: 'pointer', 
                borderLeft: '6px solid #af272f', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)', 
                transition: 'transform 0.2s' 
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '0.75em', color: '#af272f', fontWeight: 'bold', letterSpacing: '1px' }}>
                  {item.tipo}
                </span>
              </div>

              <h3 style={{ margin: 0, color: '#222', fontSize: '1.2em' }}>
                {item.titulo}
              </h3>
            </div>
          )) : !isLoading && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              No se han encontrado resultados.
            </div>
          )}
        </div>

            </div>
          </div>
        );
      };

const btnFiltro = (activo) => ({
  padding: '6px 15px',
  borderRadius: '20px',
  border: activo ? '1px solid #af272f' : '1px solid #ddd',
  backgroundColor: activo ? '#af272f' : 'white',
  color: activo ? 'white' : '#555',
  cursor: 'pointer',
  fontSize: '0.85em',
  fontWeight: activo ? 'bold' : 'normal',
  transition: '0.3s'
});

export default Buscador;