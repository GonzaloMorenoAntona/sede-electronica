import React from 'react';
import BuscadorPage from './BuscadorPage'; // Importamos la lógica del buscador

const HomePage = ({ categorias, alSeleccionarTramite }) => {
  return (
    <div className="home-main">
      {/* 1. SECCIÓN HERO: El bloque azul de identidad */}
      <section className="hero-sede">
        <div className="hero-content">
          <h1>Sede Electrónica</h1>
          <p>Ayuntamiento de Ciudad Real</p>
        </div>
      </section>

      {/* 2. CONTENEDOR CENTRAL: Buscador + Grid */}
      <div className="home-content-wrapper">
        
        {/* BUSCADOR: Lo metemos dentro de un contenedor que "flota" */}
        <section className="search-section-wrapper">
          <BuscadorPage 
            categorias={categorias} 
            abrirTramite={alSeleccionarTramite} 
          />
        </section>

        {/* ÁREAS MUNICIPALES: El Grid de 3 columnas */}
        <section className="areas-section">
          <h2 className="section-title">Áreas Municipales</h2>
          <div className="areas-grid">
            {categorias.map(cat => (
              <div 
                key={cat.id} 
                className="area-card-pro"
                onClick={() => {/* Aquí podrías filtrar el buscador por esta categoría */}}
              >
                <div className="area-icon">
                  {/* Aquí iría tu IconoPro según el nombre de la categoría */}
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0073ab" strokeWidth="1.5">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  </svg>
                </div>
                <h3>{cat.nombre}</h3>
                <p>Acceda a los trámites de {cat.nombre.toLowerCase()}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;