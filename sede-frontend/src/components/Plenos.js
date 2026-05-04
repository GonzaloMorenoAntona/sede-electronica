import React, { useState, useMemo } from 'react';
import './Plenos.css';


const MESES = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];

const PATHS = {
  cal:   <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
  clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
  doc:   <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
  list:  <><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>,
  msg:   <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>,
  chev:  <><polyline points="9 18 15 12 9 6"/></>,
};

const Icon = ({ name, size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{PATHS[name]}</svg>
);

const parseJSON = (j) => {
  try { return typeof j === 'string' ? JSON.parse(j) : (j || null); }
  catch { return null; }
};

/* ===== Tarjeta ===== */
const PlenoCard = ({ pleno }) => {
  const [abierto, setAbierto] = useState(false);
  const sesion       = parseJSON(pleno.sesion);
  const convocatoria = parseJSON(pleno.convocatoria);
  const acta         = parseJSON(pleno.acta);
  const ordenDia     = parseJSON(pleno.ordenDia) || [];

  const fc = sesion?.fechaCelebracion ? new Date(sesion.fechaCelebracion) : null;
  const dia  = fc ? fc.getDate() : '—';
  const mes  = fc ? MESES[fc.getMonth()] : '';
  const anio = fc ? fc.getFullYear() : '';

  const tieneActa  = !!(acta?.url);
  const propuestas = ordenDia.filter(o => o.propuesta === 'SI').length;
  const urgencias  = ordenDia.filter(o => o.urgencia === 'SI').length;
  const ruegos     = ordenDia.some(o => /ruego/i.test(o.titulo || ''));

  return (
    <article className={`pleno-card ${abierto ? 'pleno-card--abierto' : ''}`}>
      <div className="pleno-fecha">
        <strong>{dia}</strong>
        <span>{mes}</span>
        <span className="pleno-fecha-anio">{anio}</span>
      </div>

      <div className="pleno-info">
        <h3>{pleno.titulo}</h3>
        <div className="pleno-meta">
          {sesion?.horaCelebracion && <span><Icon name="clock" /> {sesion.horaCelebracion} h</span>}
          {sesion?.numeroConvocatoria && <span><Icon name="doc" /> Convocatoria {sesion.numeroConvocatoria}</span>}
          <span className={`pleno-badge ${tieneActa ? 'publicada' : 'convocada'}`}>
            {tieneActa ? 'Acta publicada' : 'Convocada'}
          </span>
        </div>
        {ordenDia.length > 0 && (
          <div className="pleno-resumen">
            {propuestas > 0 && <span><Icon name="doc" /> {propuestas} propuesta{propuestas !== 1 ? 's' : ''}</span>}
            {urgencias > 0 && <span><Icon name="list" /> {urgencias} urgencia{urgencias !== 1 ? 's' : ''}</span>}
            {ruegos && <span><Icon name="msg" /> Ruegos y preguntas</span>}
          </div>
        )}
      </div>

      <div className="pleno-acciones">
        {convocatoria?.url && (
          <a href={convocatoria.url} target="_blank" rel="noreferrer" className="pleno-btn pleno-btn--secundario">
            <Icon name="doc" /> Convocatoria
          </a>
        )}
        {ordenDia.length > 0 && (
          <button onClick={() => setAbierto(!abierto)} className="pleno-btn pleno-btn--secundario">
            <Icon name="list" /> Orden del día
          </button>
        )}
        {acta?.url && (
          <a href={acta.url} target="_blank" rel="noreferrer" className="pleno-btn pleno-btn--secundario">
            <Icon name="doc" /> Extracto del acta
          </a>
        )}
        <button onClick={() => setAbierto(!abierto)} className="pleno-btn pleno-btn--primario">
          Ver detalle <Icon name="chev" size={12} />
        </button>
      </div>

      {abierto && ordenDia.length > 0 && (
        <div className="pleno-orden">
          <h4>Orden del día</h4>
          <ol>
            {ordenDia.map((o, i) => (
              <li key={i}>
                <span className="pleno-orden-num">{o.orden ?? i + 1}</span>
                <span className="pleno-orden-texto">{o.titulo}</span>
                {o.urgencia === 'SI' && <span className="pleno-orden-tag urgente">Urgencia</span>}
              </li>
            ))}
          </ol>
        </div>
      )}
    </article>
  );
};

/* ===== Componente principal ===== */
const Plenos = ({ datos, anioActivo, setAnioActivo, volver }) => {
  const [busqueda, setBusqueda]     = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todas');

  const anios = useMemo(
    () => [...new Set(datos.map(d => Number(d.anio)))].sort((a, b) => b - a),
    [datos]
  );

  const filtrados = useMemo(() => datos
    .filter(d => {
      if (Number(d.anio) !== anioActivo) return false;

      const sesion = parseJSON(d.sesion);
      const tipo = sesion?.tipo?.toLowerCase() || '';
      if (filtroTipo === 'ordinarias' && tipo !== 'ordinaria') return false;
      if (filtroTipo === 'extraordinarias' && tipo !== 'extraordinaria') return false;

      if (busqueda.trim()) {
        const q = busqueda.toLowerCase();
        return (d.titulo?.toLowerCase().includes(q) ||
                d.descripcion?.toLowerCase().includes(q) ||
                sesion?.numeroConvocatoria?.toLowerCase().includes(q));
      }
      return true;
    })
    .sort((a, b) => {
      const fa = parseJSON(a.sesion)?.fechaCelebracion || '';
      const fb = parseJSON(b.sesion)?.fechaCelebracion || '';
      return fb.localeCompare(fa);
    }),
  [datos, anioActivo, busqueda, filtroTipo]);

  return (
    <div className="home-content-wrapper">
      {volver && <button onClick={volver} className="btn-volver">← VOLVER AL BUSCADOR</button>}

      <header className="pleno-header">
        <div>
          <h1 className="pleno-titulo-principal">Plenos del Ayuntamiento</h1>
          <p className="pleno-subtitulo">
            Consulta convocatorias, órdenes del día, actas y documentación de las sesiones plenarias.
          </p>
        </div>
        <div className="pleno-stat">
          <Icon name="cal" size={20} />
          <strong>{filtrados.length}</strong>
          <span>sesiones en {anioActivo ?? '—'}</span>
        </div>
      </header>

      <div className="sub-anios">
        {anios.map(a => (
          <button key={a} onClick={() => setAnioActivo(a)}
            className={`sub-anio-btn ${anioActivo === a ? 'sub-anio-btn--activo' : ''}`}>
            {a}
          </button>
        ))}
      </div>

      <div className="pleno-controles">
        <input
          type="text"
          className="pleno-search-input"
          placeholder="Buscar por fecha, asunto o convocatoria..."
          autoComplete="off"
          spellCheck="false"
          onInput={ev => setBusqueda(ev.target.value)}
        />
        <div className="pleno-tipos">
          {[
            { v: 'todas',          l: 'Todas' },
            { v: 'ordinarias',     l: 'Ordinarias' },
            { v: 'extraordinarias', l: 'Extraordinarias' },
          ].map(o => (
            <button key={o.v} onClick={() => setFiltroTipo(o.v)}
              className={`pleno-tipo-btn ${filtroTipo === o.v ? 'activo' : ''}`}>
              {o.l}
            </button>
          ))}
        </div>
      </div>

      <div className="plenos-lista">
        {filtrados.length > 0
          ? filtrados.map(p => <PlenoCard key={p.id} pleno={p} />)
          : <p className="pleno-vacio">{busqueda
              ? `No hay resultados para "${busqueda}".`
              : `No hay plenos registrados para ${anioActivo ?? '—'}.`}</p>}
      </div>
    </div>
  );
};

export default Plenos;