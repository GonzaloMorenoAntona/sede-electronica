import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
// IMPORTANTE: Sin llaves {} en estos imports
import BuscadorPage from './pages/BuscadorPage';
import FichaTramitePage from './pages/FichaTramitePage';

function App() {
  const [view, setView] = useState('BUSCADOR');
  const [selectedId, setSelectedId] = useState(null); // Solo el ID, nada más
  const [categorias, setCategorias] = useState([]);

  // Traemos las categorías reales de tu base de datos
  useEffect(() => {
    fetch('/api/categorias')
      .then(res => res.json())
      .then(data => setCategorias(data))
      .catch(err => console.error("Error cargando categorías:", err));
  }, []);

  // Esta función es la que usará el buscador para "avisar" a App de que cambie de vista
  const irADetalle = (id) => {
    setSelectedId(id);
    setView('DETALLE');
  };

  return (
    <Layout>
      {view === 'BUSCADOR' && (
        <BuscadorPage 
          categorias={categorias} 
          abrirTramite={irADetalle} 
        />
      )}
      
      {view === 'DETALLE' && (
        <FichaTramitePage 
          tramiteId={selectedId} 
          volver={() => setView('BUSCADOR')} 
        />
      )}
    </Layout>
  );
}

export default App;