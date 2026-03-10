import React from 'react';
import BuscadorPage from './BuscadorPage';
import IconoMuni from './IconoMuni';

const HomePage = ({ categorias, alSeleccionarTramite, abrirCategoria }) => {
  const areasPrincipales = categorias.filter(cat => cat.id <= 9);
  const otrasCategorias  = categorias.filter(cat => cat.id >= 11);

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
      </div>
    </div>
  );
};

export default HomePage;