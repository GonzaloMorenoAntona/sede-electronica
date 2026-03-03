import React, { useState, useEffect } from 'react';
import SubvencionesUI from '../components/Subvenciones';

const SubvencionesPage = ({ volver }) => {
  const [datos, setDatos]                     = useState([]);
  const [anioActivo, setAnioActivo]           = useState(null);
  const [servicioAbierto, setServicioAbierto] = useState(null);

  useEffect(() => {
    fetch('/api/subvenciones')
      .then(res => res.json())
      .then(data => {
        const lista = Array.isArray(data) ? data : [];
        setDatos(lista);
        if (lista.length > 0) {
          const maxAnio = Math.max(...lista.map(d => Number(d.anio)));
          setAnioActivo(maxAnio);
        }
      })
      .catch(err => console.error('Error cargando subvenciones:', err));
  }, []);

  return (
    <SubvencionesUI
      datos={datos}
      anioActivo={anioActivo}
      setAnioActivo={setAnioActivo}
      servicioAbierto={servicioAbierto}
      setServicioAbierto={setServicioAbierto}
      volver={volver}
    />
  );
};

export default SubvencionesPage;