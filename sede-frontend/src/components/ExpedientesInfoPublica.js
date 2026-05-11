import React, { useState, useMemo } from 'react';
import './ExpedientesInfoPublica.css';

/* ===== Helpers ===== */
const parseJSON   = (j) => { try { return typeof j === 'string' ? JSON.parse(j) : (j || []); } catch { return []; } };
const formatFecha = (f) => f ? new Date(f).toLocaleDateString('es-ES') : '—';
const formatFechaHora = (f) => {
  if (!f) return '—';
  const d = new Date(f);
  return `${formatFecha(d)} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
};

const enPlazo = (e) => e.fechaFinAlegaciones && new Date(e.fechaFinAlegaciones) >= new Date();

const getAnio = (e) => {
  if (e.fechaInicioAlegaciones) return new Date(e.fechaInicioAlegaciones).getFullYear();
  if (e.fechaSincronizacion)   return new Date(e.fechaSincronizacion).getFullYear();
  return null;
};

/* ===== Tarjeta ===== */
const ExpedienteCard = ({ expediente }) => {
  const documentos = parseJSON(expediente.documentos);
  const activo = enPlazo(expediente);

  return (
    <article className={`expe-card ${activo ? 'expe-card--activo' : 'expe-card--cerrado'}`}>

      <div className="expe-card-icono">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      </div>

      <div className="expe-card-info">
        <span className="expe-card-id">{expediente.idExternoSigem}</span>
        <h3>{expediente.titulo}</h3>
        {expediente.concejalia && (
          <span className="expe-card-concejalia">{expediente.concejalia}</span>
        )}
        {expediente.fechaSincronizacion && (
          <span className="expe-card-sync">
            Última sincronización: {formatFechaHora(expediente.fechaSincronizacion)}
          </span>
        )}
      </div>

      <div className="expe-card-estado">
        <span className={`expe-badge ${activo ? 'activo' : 'cerrado'}`}>
          ● {activo ? 'Alegaciones abiertas' : 'Plazo cerrado'}
        </span>
        {(expediente.fechaInicioAlegaciones || expediente.fechaFinAlegaciones) && (
          <div className="expe-card-plazo">
            <span className="expe-card-plazo-label">Plazo de alegaciones</span>
            <strong>{formatFecha(expediente.fechaInicioAlegaciones)} - {formatFecha(expediente.fechaFinAlegaciones)}</strong>
            <span className={`expe-card-plazo-estado ${activo ? 'verde' : 'gris'}`}>
              {activo ? 'En plazo' : 'Fuera de plazo'}
            </span>
          </div>
        )}
      </div>

      <div className="expe-card-doc">
        <span className="expe-card-doc-titulo">Documentación disponible</span>
        {documentos.length > 0 ? documentos.map((d, i) => (
          <a key={i} href={d.url} target="_blank" rel="noreferrer" className="expe-doc">
            <span className="expe-doc-pdf">PDF</span>
            <span className="expe-doc-nombre">{d.label}</span>
          </a>
        )) : (
          <span className="expe-card-doc-vacio">Sin documentación adjunta</span>
        )}
      </div>

      <div className="expe-card-acciones">
        {activo && expediente.enlaceAlegaciones ? (
          <a href={expediente.enlaceAlegaciones} target="_blank" rel="noreferrer"
             className="expe-btn expe-btn--primario">
            Presentar alegaciones
          </a>
        ) : (
          <span className="expe-btn expe-btn--inactivo">Plazo cerrado</span>
        )}
      </div>

    </article>
  );
};

/* ===== Componente principal ===== */
const ExpedientesInfoPublica = ({ datos, volver }) => {
  const [anioGlobal, setAnioGlobal]         = useState('todos');
  const [busqueda, setBusqueda]             = useState('');
  const [filtroConcejalia, setFiltroConcejalia] = useState('todas');
  const [filtroEstado, setFiltroEstado]     = useState('todos');

  const anios       = useMemo(() => [...new Set(datos.map(getAnio).filter(Boolean))].sort((a, b) => b - a), [datos]);
  const concejalias = useMemo(() => [...new Set(datos.map(d => d.concejalia).filter(Boolean))].sort(), [datos]);

  const filtrados = useMemo(() => datos.filter(d => {
    if (anioGlobal !== 'todos' && getAnio(d) !== Number(anioGlobal)) return false;
    if (filtroConcejalia !== 'todas' && d.concejalia !== filtroConcejalia) return false;
    if (filtroEstado === 'activos'  && !enPlazo(d)) return false;
    if (filtroEstado === 'cerrados' &&  enPlazo(d)) return false;
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      return d.titulo?.toLowerCase().includes(q) ||
             d.concejalia?.toLowerCase().includes(q) ||
             d.idExternoSigem?.toLowerCase().includes(q);
    }
    return true;
  }), [datos, anioGlobal, busqueda, filtroConcejalia, filtroEstado]);

  /* Ordenar por fecha de sincronización descendente (más recientes primero) */
  const ordenados = useMemo(() => [...filtrados].sort((a, b) =>
    new Date(b.fechaSincronizacion || 0) - new Date(a.fechaSincronizacion || 0)
  ), [filtrados]);

  const alegacionesAbiertas = filtrados.filter(enPlazo).length;

  return (
    <div className="home-content-wrapper">
      {volver && <button onClick={volver} className="btn-volver">← VOLVER AL BUSCADOR</button>}

      <header className="expe-header">
        <div>
          <h1 className="expe-titulo">Información Pública</h1>
          <p className="expe-subtitulo">
            Consulta los expedientes en información pública, la documentación
            disponible y presenta alegaciones dentro del plazo establecido.
          </p>
        </div>
        <div className="expe-stats">
          <div className="expe-stat expe-stat--azul">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            <div><strong>{filtrados.length}</strong><span>expedientes</span></div>
          </div>
          <div className="expe-stat expe-stat--verde">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <div><strong>{alegacionesAbiertas}</strong><span>alegaciones abiertas</span></div>
          </div>
          <div className="expe-stat expe-stat--morado">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <div>
              <strong>{anios.length} {anios.length === 1 ? 'año' : 'años'}</strong>
              <span>con información{anios.length > 0 && ` · ${anios.join(' y ')}`}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="sub-anios">
        <button onClick={() => setAnioGlobal('todos')}
          className={`sub-anio-btn ${anioGlobal === 'todos' ? 'sub-anio-btn--activo' : ''}`}>
          Todos los años
        </button>
        {anios.map(a => (
          <button key={a} onClick={() => setAnioGlobal(a)}
            className={`sub-anio-btn ${anioGlobal === a ? 'sub-anio-btn--activo' : ''}`}>
            Año {a}
          </button>
        ))}
      </div>

      <div className="expe-controles">
        <input type="text" className="expe-search-input"
          placeholder="Buscar expediente, asunto o concejalía..."
          autoComplete="off" spellCheck="false"
          onInput={ev => setBusqueda(ev.target.value)} />
        <select value={filtroConcejalia} onChange={ev => setFiltroConcejalia(ev.target.value)}>
          <option value="todas">Concejalía: Todas</option>
          {concejalias.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filtroEstado} onChange={ev => setFiltroEstado(ev.target.value)}>
          <option value="todos">Estado: Todos</option>
          <option value="activos">En plazo</option>
          <option value="cerrados">Plazo cerrado</option>
        </select>
      </div>

      <div className="expe-lista">
        {ordenados.length > 0
          ? ordenados.map(e => <ExpedienteCard key={e.id} expediente={e} />)
          : <p className="expe-vacio">{busqueda
              ? `No hay resultados para "${busqueda}".`
              : 'No hay expedientes que coincidan con los filtros.'}</p>}
      </div>
    </div>
  );
};

export default ExpedientesInfoPublica;

