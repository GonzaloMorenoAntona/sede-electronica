import React, { useState, useEffect } from 'react';
import Convenios from '../components/Convenios';
import { getConvenios } from '../services/conveniosService';

const ConveniosPage = ({ volver }) => {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      const lista = await getConvenios();
      setDatos(lista);
    };
    cargar();
  }, []);

  return <Convenios datos={datos} volver={volver} />;
};

export default ConveniosPage;