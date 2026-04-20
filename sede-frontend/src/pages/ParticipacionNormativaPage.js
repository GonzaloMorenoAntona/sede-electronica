import React, { useState, useEffect } from 'react';
import ParticipacionNormativa from '../components/ParticipacionNormativa';
import { getConsultasPublicas, getInformacionPublica } from '../services/participacionNormativaService';

const ParticipacionNormativaPage = ({ volver }) => {
  const [consultas, setConsultas] = useState([]);
  const [informacion, setInformacion] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      const [c, i] = await Promise.all([getConsultasPublicas(), getInformacionPublica()]);
      setConsultas(c);
      setInformacion(i);
    };
    cargar();
  }, []);

  return <ParticipacionNormativa consultas={consultas} informacion={informacion} volver={volver} />;
};

export default ParticipacionNormativaPage;