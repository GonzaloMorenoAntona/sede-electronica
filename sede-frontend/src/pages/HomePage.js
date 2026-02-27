import React from 'react';
import BuscadorPage from './BuscadorPage'; // Importamos la lógica del buscador


const IconoMuni = ({ icono, nombre }) => {
  // Aquí pones los 4 o 5 dibujos básicos
  const paths = {
    user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", // Estadística
    euro: "M12 1v22M17 5H9.5a4.5 4.5 0 1 0 0 9h5a4.5 4.5 0 1 1 0 9H6",                 // Hacienda
    building: "M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16", // Urbanismo
    briefcase: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M8 4V2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M2 11h20", // Empleo
    heart: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z", // Servicios Persona
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",                           // Seguridad
    leaf: "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z", // Medio Ambiente
    book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v15H6.5a2.5 2.5 0 0 0-2.5 2.5z", // Cultura
    bullhorn: "M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07", // Participación
  };
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[icono]} />
    </svg>
  );
};
const HomePage = ({ categorias, alSeleccionarTramite }) => {
  const areasPrincipales = categorias.filter(cat => cat.id <= 9);
  //notas de interes, informacion muncipal y concejales
  const otrasCategorias = categorias.filter(cat => cat.id >= 11);
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

        {/* SECCIÓN 1: ÁREAS DE GESTIÓN (Las 9 principales) */}
        <section className="areas-section">
          <h2 className="section-title">Áreas Municipales de Gestión</h2>
          <div className="areas-grid">
            {areasPrincipales.map(cat => (
              <div key={cat.id} className="area-card-pro">
                <div className="area-icon">
                  <IconoMuni icono={cat.icono} nombre={cat.nombre} />
                </div>
                <h3>{cat.nombre}</h3>
                <p>Gestiones de {cat.nombre.toLowerCase()}</p>
              </div>
            ))}
          </div>
        </section>

     {/* SECCIÓN 2: INFORMACIÓN Y OTROS */}
        <section className="others-section">
          <h2 className="section-title" >Información y Otros Servicios</h2>
          <div className="others-grid">
            {otrasCategorias.map(cat => (
              <div key={cat.id} className="area-card-simple">
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