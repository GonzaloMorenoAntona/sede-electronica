import React, { useState, useEffect } from 'react';
import JuntasGobiernoUI from '../components/JuntasGobierno';
import { getJuntasGobierno } from '../services/juntasGobiernoService';

const JuntasGobiernoPage = ({ volver }) => {
  const [datos, setDatos]         = useState([]);
  const [anioActivo, setAnioActivo] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      const lista = await getJuntasGobierno();
      setDatos(lista);
      if (lista.length > 0) {
        const maxAnio = Math.max(...lista.map(d => Number(d.anio)));
        setAnioActivo(maxAnio);
      }
    };
    cargar();
  }, []);

  return (
    <JuntasGobiernoUI
      datos={datos}
      anioActivo={anioActivo}
      setAnioActivo={setAnioActivo}
      volver={volver}
    />
  );
};

export default JuntasGobiernoPage;
