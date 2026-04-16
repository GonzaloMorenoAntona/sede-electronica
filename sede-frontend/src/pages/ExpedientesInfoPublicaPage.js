import React, { useState, useEffect } from 'react';
import ExpedientesInfoPublica from '../components/ExpedientesInfoPublica';
import { getExpedientesInfoPublica } from '../services/expedientesInfoPublicaService';

const ExpedientesInfoPublicaPage = ({ volver }) => {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      const lista = await getExpedientesInfoPublica();
      setDatos(lista);
    };
    cargar();
  }, []);

  return <ExpedientesInfoPublica datos={datos} volver={volver} />;
};

export default ExpedientesInfoPublicaPage;