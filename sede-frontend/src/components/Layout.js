import React from 'react';
import imagenFondo from '../assets/fondo.jpg';

const Layout = ({ children }) => {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Capa del fondo fija */}
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        zIndex: -1, backgroundImage: `url(${imagenFondo})`,
        backgroundRepeat: 'no-repeat', backgroundPosition: 'center center',
        backgroundSize: 'contain', opacity: 0.5, pointerEvents: 'none'
      }}></div>

      {/* Capa de contenido dinámico */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default Layout;