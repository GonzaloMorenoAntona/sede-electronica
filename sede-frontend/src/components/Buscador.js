import React from 'react';

const Buscador = ({ searchTerm, setSearchTerm, handleSearch, results, abrirTramite, isLoading }) => {
  return (
    <div style={{ fontFamily: '"Segoe UI", Tahoma, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ color: '#af272f', fontSize: '2.8em', fontWeight: '800', marginBottom: '10px' }}>Buscador Global</h1>
        <p style={{ color: '#555', fontSize: '1.2em', marginBottom: '40px' }}>Ayuntamiento de Ciudad Real</p>
        
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '15px', marginBottom: '50px' }}>
          <input 
            type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="¿Qué trámite necesitas?" 
            style={{ flexGrow: 1, padding: '18px 25px', borderRadius: '50px', border: '1px solid #ddd', fontSize: '1.1em', outline: 'none' }}
          />
          <button type="submit" style={{ padding: '0 45px', backgroundColor: '#af272f', color: 'white', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold' }}>
            {isLoading ? '...' : 'BUSCAR'}
          </button>
        </form>

        <div style={{ display: 'grid', gap: '20px' }}>
          {results.map(item => (
            <div key={item.id} onClick={() => abrirTramite(item.id)} style={{ backgroundColor: 'white', padding: '25px', borderRadius: '15px', textAlign: 'left', cursor: 'pointer', borderLeft: '8px solid #af272f', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 8px 0', color: '#af272f' }}>{item.titulo}</h3>
              <p style={{ margin: 0, color: '#666' }}>{item.descripcion?.substring(0, 160)}...</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Buscador;