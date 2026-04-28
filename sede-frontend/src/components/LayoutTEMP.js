import React from 'react';
import imagenFondo from '../assets/fondo.jpg';
import { useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%' }}>
      
      {/* CAPA DEL LOGO */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        backgroundImage: `url(${imagenFondo})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: '1300px auto',
        opacity: 0.07,
        filter: 'grayscale(100%)',
        pointerEvents: 'none'
      }}></div>

      {/* CAPA DE CONTENIDO */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>

      {/* BOTÓN FLOTANTE ALERTAS */}
      <button
        onClick={() => navigate('/suscripcion')}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 100,
          background: '#1a3a5c',
          color: 'white',
          border: 'none',
          borderRadius: '50px',
          padding: '12px 20px',
          fontSize: '13px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          fontFamily: 'inherit'
        }}
      >
        🔔 Alertas y suscripciones
      </button>

    </div>
  );
};

export default Layout;