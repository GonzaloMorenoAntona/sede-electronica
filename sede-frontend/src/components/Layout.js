import React from 'react';
import imagenFondo from '../assets/fondo.jpg';

const Layout = ({ children }) => {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%' }}>
      
      {/* CAPA DEL LOGO: Esta es la clave para que no se corte */}
      <div style={{
        position: 'fixed', // Se queda pegado a la ventana del navegador
        top: 0,
        left: 0,
        width: '100vw',    // Fuerza el ancho total de la pantalla
        height: '100vh',   // Fuerza el alto total de la pantalla
        zIndex: -1,        // Siempre al fondo del todo
        
        backgroundImage: `url(${imagenFondo})`,
        backgroundRepeat: 'no-repeat', 
        backgroundPosition: 'center center',
        
        backgroundSize: '1300px auto', 
        
        opacity: 0.07,     // Ajustado para que sea una marca de agua sutil
        filter: 'grayscale(100%)', // Mantiene la estética profesional
        pointerEvents: 'none'      // No interfiere con los clics
      }}></div>

      {/* CAPA DE CONTENIDO: Aquí es donde van tus tarjetas de 1100px */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default Layout;