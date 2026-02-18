import React, { useState, useEffect } from 'react'; 
import './App.css';
import Layout from './components/Layout';
import HomePage from './pages/HomePage'; 
import FichaTramitePage from './pages/FichaTramitePage';

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
    setSelectedId(id);
    setView('DETALLE');
  };

  return (
    <Layout>
      {view === 'HOME' ? (
        <HomePage 
          categorias={categorias} 
          alSeleccionarTramite={abrirDetalle} 
        />
      ) : (
        <FichaTramitePage 
          tramiteId={selectedId} 
          volver={() => setView('HOME')} 
        />
      )}
    </Layout>
  );
}

export default App;