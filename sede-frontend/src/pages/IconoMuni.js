import React from 'react';

// Añadimos 'size = 40' para que por defecto sea grande (para la página principal)
const IconoMuni = ({ icono, size = 40 }) => {
  const paths = {
    user:      "M3 5h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M4 15c0-1.66 1.34-3 3-3h2c1.66 0 3 1.34 3 3 M14 8h5 M14 12h5 M14 16h3",
    euro:      "M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10z M14 8c-1.5-1-3-1-4.5 0A4 4 0 0 0 8 12a4 4 0 0 0 1.5 4c1.5 1 3 1 4.5 0 M7 10h6 M7 14h6",
    building:  "M3 21h18 M4 21v-4 M20 21v-4 M5 17h14 M6 17V9 M10 17V9 M14 17V9 M18 17V9 M5 9l7-5 7 5z",
    briefcase: "M4 7h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2 M2 11h20 M12 11v3a1 1 0 0 1-2 0",
    heart:     "M20.8 4.6a5.5 5.5 0 0 0-7.7 0l-1.1 1-1.1-1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21.3l7.8-7.8 1.1-1.1a5.5 5.5 0 0 0 0-7.8z M12 13V8 M9.5 10.5h5",
    shield:    "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4",
    leaf:      "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z M11 20v-6 M11 14l2-2",
    book:      "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",
    bullhorn:  "M11 5L6 9H2v6h4l5 4V5z M19.07 4.93a10 10 0 0 1 0 14.14 M15.54 8.46a5 5 0 0 1 0 7.07 M11 15l-2 5h-2l2-5"
  };

  return (
    <svg 
      width={size}   /* <--- Ahora lee la variable dinámica */
      height={size}  /* <--- Ahora lee la variable dinámica */
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor"
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d={paths[icono] || paths.building} />
    </svg>
  );
};

export default IconoMuni;