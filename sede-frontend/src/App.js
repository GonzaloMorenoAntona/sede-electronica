import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import './App.css';
import Layout from './components/LayoutTEMP';
import HomePage from './pages/HomePage';
import FichaTramitePage from './pages/FichaTramitePage';
import SubvencionesPage from './pages/SubvencionesPage';

// Componente interno para FichaTramite — necesita useParams y useNavigate
const FichaWrapper = ({ categorias }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <FichaTramitePage
      tramiteId={Number(id)}
      volver={() => navigate(-1)}
    />
  );
};

function AppContent() {
  const [categorias, setCategorias] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/categorias')
      .then(res => res.json())
      .then(data => setCategorias(data))
      .catch(err => console.error('Error cargando categorías:', err));
  }, []);

  const abrirDetalle = (id) => {
    if (id === 16) {
      navigate('/subvenciones');
    } else {
      navigate(`/tramite/${id}`);
    }
  };

  return (
    <Layout>
      <Routes>
        <Route path="/" element={
          <HomePage
            categorias={categorias}
            alSeleccionarTramite={abrirDetalle}
          />
        } />
        <Route path="/tramite/:id" element={<FichaWrapper categorias={categorias} />} />
        <Route path="/subvenciones" element={<SubvencionesPage volver={() => navigate('/')} />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;