import React, { useState, useEffect } from 'react';
import ProcesosSelectivosUI from '../components/ProcesosSelectivos';
import { getProcesosSelectivos } from '../services/procesosSelectivosService';

const ProcesosSelectivosPage = ({ volver }) => {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      const lista = await getProcesosSelectivos();
      setDatos(lista);
    };
    cargar();
  }, []);

  return <ProcesosSelectivosUI datos={datos} volver={volver} />;
};

export default ProcesosSelectivosPage;