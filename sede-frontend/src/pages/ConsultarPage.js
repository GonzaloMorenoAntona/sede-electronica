import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConsultarUI from '../components/Consultar';

/* Extrae la URL de un enlace por su id dentro del campo enlacesJson */
const urlDeEnlace = (tramite, idEnlace) => {
  if (!tramite) return null;
  const raw = tramite.enlacesJson || tramite.enlaces_json;
  if (!raw) return null;
  try {
    const arr = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return Array.isArray(arr) ? (arr.find(e => e.id === idEnlace)?.url || null) : null;
  } catch { return null; }
};

const ConsultarPage = () => {
  const navigate = useNavigate();
  const [tramite1,   setTramite1]   = useState(null);
  const [enlacesExt, setEnlacesExt] = useState({});

  useEffect(() => {
    // Tramite 1 — canales del panel desplegable (links dentro de enlacesJson)
    fetch('/api/tramites/1')
      .then(r => r.json())
      .then(res => setTramite1(Array.isArray(res) ? res[0] : res))
      .catch(() => setTramite1(null));

    // Tarjetas superiores
    Promise.all([
      fetch('/api/tramites/9').then(r => r.json()).catch(() => null),   // Registro telemático → urlExterna
      fetch('/api/tramites/91').then(r => r.json()).catch(() => null),  // CVE Ayto → urlExterna
      fetch('/api/tramites/102').then(r => r.json()).catch(() => null), // DEHú → enlacesJson[acceso_dehu]
    ]).then(([resReg, resCve, resDehu]) => {
      const reg  = Array.isArray(resReg)  ? resReg[0]  : resReg;
      const cve  = Array.isArray(resCve)  ? resCve[0]  : resCve;
      const dehu = Array.isArray(resDehu) ? resDehu[0] : resDehu;

      setEnlacesExt({
        // Tramites 9 y 91 son esEnlaceExterno=1 → la URL está en urlExterna
        registros: reg?.urlExterna  || null,
        cve:       cve?.urlExterna  || null,
        // Tramite 102 es esEnlaceExterno=0 → la URL está dentro de enlacesJson
        dehu:      urlDeEnlace(dehu, 'acceso_dehu'),
      });
    });
  }, []);

  return (
    <ConsultarUI
      tramite1={tramite1}
      enlacesExt={enlacesExt}
      volver={() => navigate(-1)}
    />
  );
};

export default ConsultarPage;
