import React, { useState, useEffect } from 'react';
import BuscadorPage from './BuscadorPage';
import IconoMuni from './IconoMuni';
import UltimasPublicaciones from '../components/UltimasPublicaciones';

const HomePage = ({ categorias, alSeleccionarTramite, abrirCategoria }) => {
  const [noticias, setNoticias] = useState([]);

  const areasPrincipales = categorias.filter(cat => cat.id <= 9);
  const otrasCategorias  = categorias.filter(cat => cat.id >= 11);

  useEffect(() => {
    fetch('/api/noticias?limit=24')
      .then(r => r.json())
      .then(setNoticias)
      .catch(() => setNoticias([]));
  }, []);

  return (
    <div className="home-main">
      <section className="hero-sede">
        <div className="hero-content">
          <h1>Sede Electrónica</h1>
          <p>Ayuntamiento de Ciudad Real</p>
        </div>
      </section>

      <div className="home-content-wrapper">
        <section className="search-section-wrapper">
          <BuscadorPage categorias={categorias} abrirTramite={alSeleccionarTramite} />
        </section>

        <section className="areas-section">
          <h2 className="section-title">Áreas Municipales de Gestión</h2>
          <div className="areas-grid">
            {areasPrincipales.map(cat => (
              <div key={cat.id} className="area-card-pro" onClick={() => abrirCategoria(cat)}>
                <div className="area-icon">
                  <IconoMuni icono={cat.icono} />
                </div>
                <h3>{cat.nombre}</h3>
                <p>Gestiones de {cat.nombre.toLowerCase()}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="others-section">
          <h2 className="section-title">Información y Otros Servicios</h2>
          <div className="others-grid">
            {otrasCategorias.map(cat => (
              <div key={cat.id} className="area-card-simple" onClick={() => abrirCategoria(cat)}>
                <h3>{cat.nombre}</h3>
                <p>Consulta la información de {cat.nombre.toLowerCase()}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Últimas publicaciones — se rellena automáticamente con cualquier novedad */}
        <UltimasPublicaciones noticias={noticias} />
      </div>
    </div>
  );
};

export default HomePage;
