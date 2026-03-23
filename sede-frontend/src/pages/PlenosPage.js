import React, { useState, useEffect } from 'react';
import PlenosUI from '../components/Plenos';
import { getPlenos } from '../services/plenosService';

const PlenosPage = ({ volver }) => {
  const [datos, setDatos] = useState([]);
  const [anioActivo, setAnioActivo] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      const lista = await getPlenos();
      setDatos(lista);
      if (lista.length > 0) {
        const maxAnio = Math.max(...lista.map(d => Number(d.anio)));
        setAnioActivo(maxAnio);
      }
    };
    cargar();
  }, []);

  return <PlenosUI datos={datos} anioActivo={anioActivo} setAnioActivo={setAnioActivo} volver={volver} />;
};

export default PlenosPage;