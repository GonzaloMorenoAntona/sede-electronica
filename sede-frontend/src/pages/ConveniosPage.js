import React, { useState, useEffect } from 'react';
import Convenios from '../components/Convenios';
import { getConvenios } from '../services/conveniosService';

const ConveniosPage = ({ volver }) => {
  const [datos, setDatos] = useState([]);
  const [materiaAbierta, setMateriaAbierta] = useState(null);
  const [anioActivo, setAnioActivo] = useState({});

  useEffect(() => {
    const cargar = async () => {
      const lista = await getConvenios();
      setDatos(lista);
    };
    cargar();
  }, []);

  return (
    <Convenios
      datos={datos}
      materiaAbierta={materiaAbierta}
      setMateriaAbierta={setMateriaAbierta}
      anioActivo={anioActivo}
      setAnioActivo={setAnioActivo}
      volver={volver}
    />
  );
};

export default ConveniosPage;