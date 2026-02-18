import React, { useState } from 'react';

// Un solo SVG genérico que cambia según el "d" (la ruta) que le pases
const Icon = ({ d, size = 18, color = "currentColor"}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><path d={d} /></svg>
);

const Buscador = ({ searchTerm, setSearchTerm, handleSearch, results, abrirTramite, isLoading, filtroCategoria, setFiltroCategoria, filtroTipo, setFiltroTipo, categorias }) => {
  const [showFilters, setShowFilters] = useState(false);

  const manejarSeleccion = (item) => {
    if (item.urlExterna && (!item.descripcionHtml || item.descripcionHtml?.trim() === "")) {
      window.open(item.urlExterna, '_blank');
    } else {
      abrirTramite(item.id);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', fontFamily: 'Inter, sans-serif' }}>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="¿Qué necesitas?" style={s.input} />
        <button type="submit" style={s.btnRed}>{isLoading ? '...' : 'BUSCAR'}</button>
      </form>

      <button onClick={() => setShowFilters(!showFilters)} style={s.btnFilter}>
        <Icon d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" size={14} color="var(--primary-color)" /> {showFilters ? 'OCULTAR FILTROS' : 'FILTROS'}
      </button>

      {showFilters && (
        <div style={s.filterPanel}>
          {[{ t: 'ÁREAS', list: categorias, state: filtroCategoria, set: setFiltroCategoria }, 
            { t: 'TIPO', list: ['TRAMITE', 'GUIA', 'NOTICIA'], state: filtroTipo, set: setFiltroTipo }].map((seccion, idx) => (
            <div key={idx}>
              <h4 style={s.filterTitle}>{seccion.t}</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {seccion.list.map(obj => {
                  const val = typeof obj === 'string' ? obj : obj.id;
                  const label = typeof obj === 'string' ? obj : obj.nombre;
                  const activo = seccion.state === val;
                  return <button key={val} onClick={() => seccion.set(activo ? null : val)} style={s.tag(activo)}>{label}</button>
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gap: '12px' }}>
        {results.map(item => (
          <div key={item.id} onClick={() => manejarSeleccion(item)} style={s.card} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
            <span style={s.cardTag}>{item.tipo}</span>
            <h3 style={s.cardTitle}>{item.titulo}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

// OBJETO DE ESTILOS (Para no ensuciar el HTML)
const s = {
  input: { flexGrow: 1, padding: '14px 20px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '1rem' },
  btnRed: { padding: '0 25px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' },
  btnFilter: { background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', display: 'flex', alignItems: 'center' },
  filterPanel: { backgroundColor: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  filterTitle: { margin: '0 0 10px 0', fontSize: '0.75rem', color: '#a0aec0', letterSpacing: '0.05em' },
  tag: (activo) => ({ padding: '6px 12px', borderRadius: '6px', border: '1px solid', borderColor: activo ? 'var(--primary-color)' : '#e2e8f0', backgroundColor: activo ? 'var(--primary-color)' : 'white', color: activo ? 'white' : '#4a5568', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }),
  card: { backgroundColor: 'white', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0', borderLeft: `4px solid var(--primary-color)`, cursor: 'pointer', transition: '0.2s' },
  cardTag: { fontSize: '0.7rem', color: '#a0aec0', fontWeight: '700', textTransform: 'uppercase' },
  cardTitle: { margin: '5px 0 0 0', color: '#2d3748', fontSize: '1.15rem', fontWeight: '600' }
};

export default Buscador;