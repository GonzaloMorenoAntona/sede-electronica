import React, { useState, useEffect } from 'react';
import SubvencionesUI from '../components/Subvenciones';
import { getSubvenciones } from '../services/subvencionService';

const SubvencionesPage = ({ volver }) => {
  const [datos, setDatos]                     = useState([]);
  const [anioActivo, setAnioActivo]           = useState(null);
  const [servicioAbierto, setServicioAbierto] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      const lista = await getSubvenciones();
      setDatos(lista);
      if (lista.length > 0) {
        const maxAnio = Math.max(...lista.map(d => Number(d.anio)));
        setAnioActivo(maxAnio);
      }
    };
    cargar();
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