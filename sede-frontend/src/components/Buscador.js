import React from 'react';

const Buscador = ({ searchTerm, setSearchTerm, handleSearch, results, abrirTramite, isLoading }) => {
  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Cabecera del Buscador */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#af272f', fontSize: '2.5em', fontWeight: '800' }}>Buscador Global</h1>
        <p style={{ color: '#666' }}>Accede a trámites, noticias y convocatorias del Ayuntamiento</p>
      </div>

      {/* Barra de Búsqueda Principal */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '15px', marginBottom: '40px' }}>
        <input 
          type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="¿Qué estás buscando hoy?" 
          style={{ flexGrow: 1, padding: '18px 25px', borderRadius: '50px', border: '1px solid #ddd', fontSize: '1.1em', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', outline: 'none' }}
        />
        <button type="submit" style={{ padding: '0 40px', backgroundColor: '#af272f', color: 'white', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold' }}>
          {isLoading ? '...' : 'BUSCAR'}
        </button>
      </form>

      {/* Cuerpo del Buscador: Filtros + Resultados */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '30px' }}>
        
        {/* COLUMNA IZQUIERDA: FILTROS (FACETAS) */}
        <aside style={{ backgroundColor: 'white', padding: '20px', borderRadius: '15px', height: 'fit-content', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <h3 style={{ borderBottom: '2px solid #af272f', paddingBottom: '10px', fontSize: '1.1em' }}>Filtros</h3>
          
          <div style={{ marginTop: '20px' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>Tipo de Contenido</p>
            <label style={{ display: 'block', marginBottom: '8px' }}><input type="checkbox" defaultChecked /> Trámites</label>
            <label style={{ display: 'block', marginBottom: '8px' }}><input type="checkbox" /> Noticias</label>
            <label style={{ display: 'block', marginBottom: '8px' }}><input type="checkbox" /> Convocatorias</label>
          </div>

          <div style={{ marginTop: '20px' }}>
            <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>Áreas / Servicios</p>
            <label style={{ display: 'block', marginBottom: '8px' }}><input type="checkbox" /> Urbanismo</label>
            <label style={{ display: 'block', marginBottom: '8px' }}><input type="checkbox" /> Hacienda</label>
            <label style={{ display: 'block', marginBottom: '8px' }}><input type="checkbox" /> Servicios Sociales</label>
          </div>
        </aside>

        {/* COLUMNA DERECHA: RESULTADOS */}
        <section style={{ display: 'grid', gap: '20px' }}>
          {results.length > 0 ? (
            results.map(item => (
              <div 
                key={item.id} 
                onClick={() => abrirTramite(item.id)} 
                style={{ backgroundColor: 'white', padding: '25px', borderRadius: '15px', cursor: 'pointer', borderLeft: '8px solid #af272f', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', transition: 'transform 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ backgroundColor: '#af272f', color: 'white', padding: '3px 10px', borderRadius: '5px', fontSize: '0.75em', fontWeight: 'bold', marginBottom: '10px' }}>
                    TRÁMITE
                  </span>
                  <span style={{ fontSize: '0.85em', color: '#999' }}>ID: #{item.id}</span>
                </div>
                <h3 style={{ margin: '5px 0 10px 0', color: '#222' }}>{item.titulo}</h3>
                <p style={{ margin: 0, color: '#666', fontSize: '0.95em', lineHeight: '1.5' }}>
                  {item.descripcion?.substring(0, 180)}...
                </p>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '50px', color: '#999' }}>
              {searchTerm ? 'No se encontraron resultados para tu búsqueda.' : 'Introduce un término para comenzar.'}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default Buscador;