import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { guardarPreferencias } from '../services/suscripcionService';
import '../components/Suscripcion.css';

const TIPOS = [
  { id: 'subvenciones', label: 'Subvenciones', desc: 'Nuevas convocatorias de ayudas municipales' },
  { id: 'procesos_selectivos', label: 'Procesos selectivos', desc: 'Oposiciones y empleo público' },
  { id: 'plenos', label: 'Plenos', desc: 'Convocatorias y actas del Pleno municipal' },
  { id: 'convenios', label: 'Convenios', desc: 'Nuevos convenios municipales' },
  { id: 'expedientes_info_publica', label: 'Expedientes de información pública', desc: 'Expedientes abiertos a alegaciones' },
  { id: 'consultas_publicas', label: 'Consulta pública previa', desc: 'Consultas antes de elaborar ordenanzas' },
  { id: 'informacion_publica', label: 'Información pública de ordenanzas', desc: 'Expedientes de ordenanzas en tramitación' },
];

const PreferenciasPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [seleccionados, setSeleccionados] = useState([]);
  const [guardado, setGuardado] = useState(false);
  const [cargando, setCargando] = useState(false);

  const toggleTipo = (id) => {
    setSeleccionados(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const handleGuardar = async () => {
    if (seleccionados.length === 0) return;
    setCargando(true);
    const ok = await guardarPreferencias(token, seleccionados);
    setCargando(false);
    if (ok) setGuardado(true);
  };

  if (!token) return <div className="home-content-wrapper"><p>Enlace no válido.</p></div>;

  return (
    <div className="home-content-wrapper">
      <div className="susc-container">
        {!guardado ? (
          <>
            <h1 className="titulo-guia-interno">¡Email confirmado!</h1>
            <p className="susc-desc">Elige las alertas que quieres recibir. Puedes marcar todas las que quieras.</p>
            <div className="susc-tipos">
              {TIPOS.map(tipo => (
                <div
                  key={tipo.id}
                  className={`susc-tipo-card ${seleccionados.includes(tipo.id) ? 'susc-tipo-activo' : ''}`}
                  onClick={() => toggleTipo(tipo.id)}
                >
                  <div className="susc-tipo-check">
                    {seleccionados.includes(tipo.id) ? '✓' : ''}
                  </div>
                  <div>
                    <div className="susc-tipo-label">{tipo.label}</div>
                    <div className="susc-tipo-desc">{tipo.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="susc-btn"
              onClick={handleGuardar}
              disabled={seleccionados.length === 0 || cargando}
            >
              {cargando ? 'Guardando...' : `Guardar preferencias (${seleccionados.length} seleccionadas)`}
            </button>
          </>
        ) : (
          <div className="susc-mensaje susc-ok">
            ✓ Tus preferencias han sido guardadas. A partir de ahora recibirás alertas cuando haya novedades en las categorías que has elegido.
            <br /><br />
            <button className="susc-btn" onClick={() => navigate('/')}>Volver al inicio</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreferenciasPage;