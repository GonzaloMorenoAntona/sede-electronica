import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import './App.css';
import Layout from './components/LayoutTEMP';
import HomePage from './pages/HomePage';
import FichaTramitePage from './pages/FichaTramitePage';
import SubvencionesPage from './pages/SubvencionesPage';
import ListadoTramitesPage from './pages/ListadoTramitesPage';
import ProcesosSelectivosPage from './pages/ProcesosSelectivosPage';
import PlenosPage from './pages/PlenosPage';
import ConveniosPage from './pages/ConveniosPage';
import ExpedientesInfoPublicaPage from './pages/ExpedientesInfoPublicaPage';
import ParticipacionNormativaPage from './pages/ParticipacionNormativaPage';

const FichaWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <FichaTramitePage
      tramiteId={Number(id)}
      volver={() => navigate(-1)}
    />
  );
};

const ListadoWrapper = ({ categorias }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const categoria = categorias.find(c => c.id === Number(id));

  return (
    <ListadoTramitesPage
      categoriaId={Number(id)}
      categoriaNombre={categoria?.nombre || ''}
      abrirTramite={(tramiteId) => navigate(`/tramite/${tramiteId}`)}
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

  const abrirTramite = (id) => {
  if (id === 16) navigate('/subvenciones');
  else if (id === 14 || id === 59) navigate('/procesos-selectivos');
  else if (id === 115) navigate('/plenos');
  else if (id === 116) navigate('/convenios');
  else if (id === 117) navigate('/expedientes-info-publica');
  else if (id === 118) navigate('/participacion-normativa');
  else navigate(`/tramite/${id}`);
};

  return (
    <Layout>
      <Routes>
        <Route path="/" element={
          <HomePage
            categorias={categorias}
            alSeleccionarTramite={abrirTramite}
            abrirCategoria={(cat) => navigate(`/categoria/${cat.id}`)}
          />
        } />
        <Route path="/tramite/:id"    element={<FichaWrapper />} />
        <Route path="/categoria/:id"  element={<ListadoWrapper categorias={categorias} />} />
        <Route path="/subvenciones"   element={<SubvencionesPage volver={() => navigate('/')} />} />
        <Route path="/procesos-selectivos" element={<ProcesosSelectivosPage volver={() => navigate('/')} />} />
        <Route path="/plenos" element={<PlenosPage volver={() => navigate('/')} />} />
        <Route path="/convenios" element={<ConveniosPage volver={() => navigate('/')} />} />
        <Route path="/expedientes-info-publica" element={<ExpedientesInfoPublicaPage volver={() => navigate('/')} />} />
        <Route path="/participacion-normativa" element={<ParticipacionNormativaPage volver={() => navigate('/')} />} />
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