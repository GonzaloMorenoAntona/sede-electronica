import React, { useState, useMemo } from 'react';
import './Subvenciones.css';

/* ===== Iconos ===== */
const PATHS = {
  clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
  doc:   <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
  ext:   <><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></>,
};
const Icon = ({ name, size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{PATHS[name]}</svg>
);

/* ===== Iconos por área ===== */
const AREA_ICONOS = {
  educacion:     { color: '#3b82f6', paths: <><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></> },
  cultura:       { color: '#a855f7', paths: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></> },
  deportes:      { color: '#10b981', paths: <><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/></> },
  participacion: { color: '#f97316', paths: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></> },
  juventud:      { color: '#14b8a6', paths: <><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></> },
  social:        { color: '#ec4899', paths: <><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/></> },
  empleo:        { color: '#eab308', paths: <><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></> },
  default:       { color: '#64748b', paths: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></> },
};

const getAreaIcono = (servicio) => {
  if (!servicio) return AREA_ICONOS.default;
  const k = servicio.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (k.includes('educa'))  return AREA_ICONOS.educacion;
  if (k.includes('cultur')) return AREA_ICONOS.cultura;
  if (k.includes('deport')) return AREA_ICONOS.deportes;
  if (k.includes('partic')) return AREA_ICONOS.participacion;
  if (k.includes('juven'))  return AREA_ICONOS.juventud;
  if (k.includes('social') || k.includes('igual')) return AREA_ICONOS.social;
  if (k.includes('emple')  || k.includes('trabaj')) return AREA_ICONOS.empleo;
  return AREA_ICONOS.default;
};

/* ===== Helpers ===== */
const parseArr = (j) => {
  try { const r = typeof j === 'string' ? JSON.parse(j) : j; return Array.isArray(r) ? r : []; }
  catch { return []; }
};

const diasHasta = (f) => {
  if (!f) return null;
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  const fin = new Date(f); fin.setHours(0, 0, 0, 0);
  return Math.ceil((fin - hoy) / 86400000);
};

const getEstado = (sub) => {
  const dP = diasHasta(sub.fechaFinPresentacion);
  const dJ = diasHasta(sub.fechaFinJustificacion);
  if (dJ !== null && dJ >= 0) return { tipo: 'just-abierta', label: 'Justificación abierta', dias: dJ };
  if (dP !== null && dP >= 0) return { tipo: 'conv-abierta', label: 'Convocatoria abierta', dias: dP };
  if (dJ !== null && dJ < 0)  return { tipo: 'just-cerrada', label: 'Justificación cerrada', dias: null };
  return { tipo: 'conv-cerrada', label: 'Convocatoria cerrada', dias: null };
};

/* ===== Tarjeta ===== */
const Card = ({ sub }) => {
  const bases   = parseArr(sub.bases);
  const anexos  = parseArr(sub.anexos);
  const e       = getEstado(sub);
  const ai      = getAreaIcono(sub.servicio);
  const abierto = e.dias !== null && e.dias >= 0;

  const btnUrl   = e.tipo === 'conv-abierta' ? sub.urlConvocatoria : sub.urlJustificacion;
  const btnLabel = e.tipo === 'conv-abierta' ? 'Tramitar solicitud' : 'Presentar justificación';

  return (
    <article className="subv-card">
      <div className="subv-icono" style={{ background: ai.color }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
          stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {ai.paths}
        </svg>
      </div>

      <div className="subv-info">
        <h3>{sub.titulo}</h3>
        {sub.servicio && <span className="subv-area">{sub.servicio}</span>}
        {sub.descripcion && <p>{sub.descripcion}</p>}
      </div>

      <div className="subv-estado">
        <span className={`subv-badge subv-badge--${e.tipo}`}>{e.label}</span>
        <span className={`subv-tiempo ${abierto ? 'abierto' : 'cerrado'}`}>
          <Icon name="clock" /> {abierto ? `Quedan ${e.dias} día${e.dias !== 1 ? 's' : ''}` : 'Plazo cerrado'}
        </span>
      </div>

      <div className="subv-docs">
        {bases.length > 0 && (
          <>
            <span className="subv-docs-label">Bases reguladoras</span>
            {bases.map((b, i) => (
              <a key={i} href={b.url} target="_blank" rel="noreferrer" className="subv-doc">
                <span className="subv-doc-pdf">PDF</span>
                <span className="subv-doc-nombre">{b.label}</span>
              </a>
            ))}
          </>
        )}
        {anexos.length > 0 && (
          <>
            <span className="subv-docs-label" style={{ marginTop: bases.length ? 8 : 0 }}>Documentación</span>
            {anexos.map((an, i) => (
              <a key={i} href={an.url} target="_blank" rel="noreferrer" className="subv-doc">
                <span className="subv-doc-pdf">PDF</span>
                <span className="subv-doc-nombre">{an.label}</span>
              </a>
            ))}
          </>
        )}
        {bases.length === 0 && anexos.length === 0 && (
          <span className="subv-docs-vacio">Sin documentación adjunta</span>
        )}
      </div>

      <div className="subv-acciones">
        {abierto && btnUrl ? (
          <a href={btnUrl} target="_blank" rel="noreferrer" className="subv-btn subv-btn--primario">
            {btnLabel} <Icon name="ext" size={12} />
          </a>
        ) : (
          <span className="subv-btn subv-btn--inactivo">{e.label}</span>
        )}
      </div>
    </article>
  );
};

/* ===== Componente principal ===== */
const Subvenciones = ({ datos, anioActivo, setAnioActivo, volver }) => {
  const [busqueda, setBusqueda]                   = useState('');
  const [filtroArea, setFiltroArea]               = useState('todas');
  const [filtroEstado, setFiltroEstado]           = useState('todas');
  const [filtroTramitacion, setFiltroTramitacion] = useState('todas');

  const anios = useMemo(() => [...new Set(datos.map(d => Number(d.anio)))].sort((a, b) => b - a), [datos]);
  const areas = useMemo(() => [...new Set(datos.map(d => d.servicio).filter(Boolean))].sort(), [datos]);

  const filtrados = useMemo(() => datos.filter(d => {
    if (Number(d.anio) !== anioActivo) return false;
    if (filtroArea !== 'todas' && d.servicio !== filtroArea) return false;
    const e = getEstado(d);
    if (filtroEstado === 'abiertas' && !['conv-abierta', 'just-abierta'].includes(e.tipo)) return false;
    if (filtroEstado === 'cerradas' && !['conv-cerrada', 'just-cerrada'].includes(e.tipo)) return false;
    if (filtroTramitacion === 'solicitud'     && e.tipo !== 'conv-abierta') return false;
    if (filtroTramitacion === 'justificacion' && e.tipo !== 'just-abierta') return false;
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      return (d.titulo?.toLowerCase().includes(q) ||
              d.servicio?.toLowerCase().includes(q) ||
              d.descripcion?.toLowerCase().includes(q));
    }
    return true;
  }), [datos, anioActivo, busqueda, filtroArea, filtroEstado, filtroTramitacion]);

  const justAbiertas = filtrados.filter(d =>
    diasHasta(d.fechaFinJustificacion) !== null && diasHasta(d.fechaFinJustificacion) >= 0
  ).length;

  return (
    <div className="home-content-wrapper">
      {volver && <button onClick={volver} className="btn-volver">← VOLVER AL BUSCADOR</button>}

      <header className="subv-header">
        <div>
          <h1 className="subv-titulo">Convocatorias de Subvenciones Municipales</h1>
          <p className="subv-subtitulo">
            Consulta las ayudas municipales disponibles, descarga las bases y presenta tu solicitud dentro del plazo.
          </p>
        </div>
        <div className="subv-stats">
          <div><strong>{filtrados.length}</strong><span>Convocatorias mostradas</span></div>
          <div><strong>{justAbiertas}</strong><span>Plazos de justificación abiertos</span></div>
          <div><strong>{anioActivo ?? '—'}</strong><span>Año seleccionado</span></div>
        </div>
      </header>

      <div className="sub-anios">
        {anios.map(a => (
          <button key={a} onClick={() => setAnioActivo(a)}
            className={`sub-anio-btn ${anioActivo === a ? 'sub-anio-btn--activo' : ''}`}>
            Año {a}
          </button>
        ))}
      </div>

      <div className="subv-controles">
        <input type="text" className="subv-search-input"
          placeholder="Buscar subvención, área, palabra clave..."
          autoComplete="off" spellCheck="false"
          onInput={ev => setBusqueda(ev.target.value)}
        />
        <select value={filtroArea} onChange={ev => setFiltroArea(ev.target.value)}>
          <option value="todas">Área: Todas</option>
          {areas.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <select value={filtroEstado} onChange={ev => setFiltroEstado(ev.target.value)}>
          <option value="todas">Estado: Todos</option>
          <option value="abiertas">Abiertas</option>
          <option value="cerradas">Cerradas</option>
        </select>
        <select value={filtroTramitacion} onChange={ev => setFiltroTramitacion(ev.target.value)}>
          <option value="todas">Tramitación: Todas</option>
          <option value="solicitud">Solicitud abierta</option>
          <option value="justificacion">Justificación abierta</option>
        </select>
      </div>

      <div className="subv-lista">
        {filtrados.length > 0
          ? filtrados.map(s => <Card key={s.id} sub={s} />)
          : <p className="subv-vacio">{busqueda
              ? `No hay resultados para "${busqueda}".`
              : 'No hay convocatorias que coincidan con los filtros.'}</p>}
      </div>
    </div>
  );
};

export default Subvenciones;

