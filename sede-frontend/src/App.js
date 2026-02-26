import React, { useState, useEffect } from 'react'; 
import './App.css';
import Layout from './components/LayoutTEMP';
import HomePage from './pages/HomePage'; 
import FichaTramitePage from './pages/FichaTramitePage';
import SubvencionesPage from './pages/SubvencionesPage'

function App() {
  const [view, setView] = useState('HOME');
  const [selectedId, setSelectedId] = useState(null);
  const [categorias, setCategorias] = useState([]);

  // Cargamos las categorías una sola vez al arrancar
  useEffect(() => {
    fetch('/api/categorias')
      .then(res => res.json())
      .then(data => setCategorias(data))
      .catch(err => console.error("Error cargando categorías:", err));
  }, []);

  // Esta función se la pasamos a la Home para que pueda abrir un trámite
  const abrirDetalle = (id) => {
    // Si el ID es 16, saltamos directamente a la página especial
    if (id === 16) {
      setView('SUBVENCIONES');
    } else {
      setSelectedId(id);
      setView('DETALLE');
    }
  };

  return (
    <Layout>
      {/* Lógica de navegación por estados */}
      {view === 'HOME' && (
        <HomePage 
          categorias={categorias} 
          alSeleccionarTramite={abrirDetalle} 
        />
      )}

      {view === 'DETALLE' && (
        <FichaTramitePage 
          tramiteId={selectedId} 
          volver={() => setView('HOME')} 
        />
      )}

      {view === 'SUBVENCIONES' && (
        <SubvencionesPage 
          volver={() => setView('HOME')} 
        />
      )}
    </Layout>
  );
}

export default App;