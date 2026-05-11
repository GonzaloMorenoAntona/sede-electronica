import React, { useState, useMemo } from 'react';
import './ParticipacionNormativa.css';
import IconoPro from './IconoPro';
console.log('ParticipacionNormativa cargado');

const parseJSON = (json) => {
  try { return typeof json === 'string' ? JSON.parse(json) : (json || []); }
  catch (e) { return []; }
};

const estaActivo = (fechaFin) => !fechaFin || new Date(fechaFin) >= new Date();

const getAnio = (e) => {
  if (e.fechaInicio) return new Date(e.fechaInicio).getFullYear();
  if (e.fechaSincronizacion) return new Date(e.fechaSincronizacion).getFullYear();
  return null;
};

/* ===== Tarjeta Consulta Pública ===== */
const ConsultaCard = ({ item }) => {
  const documentos = parseJSON(item.documentos);
  const activo = estaActivo(item.fechaFin);
  return (
    <div className="pn-card">
      <div className="pn-card-icono"><IconoPro nombre="documento" /></div>
      <div className="pn-card-cuerpo">
        <div className="pn-card-header">
          <span className="pn-card-id">{item.idExternoSigem}</span>
          <span className={`pn-badge ${activo ? 'activo' : 'cerrado'}`}>
            {activo ? 'Abierta' : 'Finalizada'}
          </span>
        </div>
        <h3 className="pn-card-titulo">{item.titulo}</h3>
        {(item.fechaInicio || item.fechaFin) && (
          <p className="pn-card-plazo">
            {item.fechaInicio ? new Date(item.fechaInicio).toLocaleDateString('es-ES') : '—'}
            {' – '}
            {item.fechaFin ? new Date(item.fechaFin).toLocaleDateString('es-ES') : '—'}
          </p>
        )}
        {item.fechaSincronizacion && (
          <p className="pn-card-sync">
            Actualizado {new Date(item.fechaSincronizacion).toLocaleString('es-ES')}
          </p>
        )}
        {documentos.length > 0 && (
          <div className="pn-card-docs">
            {documentos.map((d, i) => (
              <a key={i} href={d.url} target="_blank" rel="noreferrer" className="pn-doc">
                <span className="pn-doc-pdf">PDF</span> {d.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ===== Tarjeta Información Pública ===== */
const InfoCard = ({ item, compacta = false }) => {
  const documentos = parseJSON(item.documentos);
  const activo = estaActivo(item.fechaFin);
  return (
    <div className={`pn-card ${compacta ? 'pn-card--compacta' : ''}`}>
      <div className="pn-card-header">
        <span className="pn-card-id">{item.idExternoSigem}</span>
        <span className={`pn-badge ${activo ? 'activo' : 'cerrado'}`}>
          ● {activo ? 'Abierta' : 'Finalizada'}
        </span>
      </div>
      <h3 className="pn-card-titulo">{item.titulo}</h3>
      <div className="pn-card-tags">
        {item.naturalezaJuridica && <span className="pn-tag">{item.naturalezaJuridica}</span>}
        {item.ambitoMaterial     && <span className="pn-tag">{item.ambitoMaterial}</span>}
        {item.caracterIniciativa && <span className="pn-tag">{item.caracterIniciativa}</span>}
      </div>
      {(item.fechaInicio || item.fechaFin) && (
        <p className="pn-card-plazo">
          {item.fechaInicio ? new Date(item.fechaInicio).toLocaleDateString('es-ES') : '—'}
          {' – '}
          {item.fechaFin ? new Date(item.fechaFin).toLocaleDateString('es-ES') : '—'}
        </p>
      )}
      {documentos.length > 0 && (
        <div className="pn-card-docs">
          {documentos.map((d, i) => (
            <a key={i} href={d.url} target="_blank" rel="noreferrer" className="pn-doc">
              <span className="pn-doc-pdf">PDF</span> {d.label}
            </a>
          ))}
        </div>
      )}
      {item.enlaceAlegaciones && (
        <div className="pn-card-accion">
          {activo ? (
            <a href={item.enlaceAlegaciones} target="_blank" rel="noreferrer" className="pn-btn pn-btn--primario">
              Presentar alegación
            </a>
          ) : (
            <span className="pn-btn pn-btn--inactivo">Plazo cerrado</span>
          )}
        </div>
      )}
    </div>
  );
};

/* ===== Componente principal ===== */
const ParticipacionNormativa = ({ consultas, informacion, volver }) => {
  const [tabActiva, setTabActiva] = useState('consultas');
  const [anioActivo, setAnioActivo] = useState(null); // null = más reciente
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroTipo, setFiltroTipo] = useState('todos');

  /* Años disponibles de ambas colecciones */
  const anios = useMemo(() => {
    const set = new Set([...consultas, ...informacion].map(getAnio).filter(Boolean));
    return [...set].sort((a, b) => b - a);
  }, [consultas, informacion]);

  const anioSeleccionado = anioActivo ?? anios[0] ?? 'todos';

  /* Función filtro común */
  const filtrar = (lista, esTipoInfo) => lista.filter(d => {
    if (anioSeleccionado !== 'todos' && getAnio(d) !== Number(anioSeleccionado)) return false;
    if (filtroEstado === 'abiertos'    && !estaActivo(d.fechaFin)) return false;
    if (filtroEstado === 'finalizados' &&  estaActivo(d.fechaFin)) return false;
    if (filtroTipo !== 'todos') {
      if (esTipoInfo && d.naturalezaJuridica !== filtroTipo) return false;
    }
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      return d.titulo?.toLowerCase().includes(q) || d.idExternoSigem?.toLowerCase().includes(q);
    }
    return true;
  });

  const consultasFiltradas = useMemo(() => filtrar(consultas, false), [consultas, anioSeleccionado, filtroEstado, busqueda]);
  const infoFiltrada       = useMemo(() => filtrar(informacion, true), [informacion, anioSeleccionado, filtroEstado, filtroTipo, busqueda]);

  /* Tipos disponibles para el select "Tipo" (de información pública) */
  const tipos = useMemo(() =>
    [...new Set(informacion.map(d => d.naturalezaJuridica).filter(Boolean))].sort(),
  [informacion]);

  return (
    <div className="home-content-wrapper">
      <button onClick={volver} className="btn-volver">← VOLVER AL BUSCADOR</button>

      <header className="pn-header">
        <div>
          <h1 className="pn-titulo-principal">Participación en Proyectos Normativos</h1>
          <p className="pn-descripcion">
            Consulta las fases de participación ciudadana en la elaboración
            de ordenanzas y reglamentos municipales.
          </p>
        </div>
        <div className="pn-stats">
          <div className="pn-stat">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            <div><strong>{consultas.length + informacion.length}</strong><span>procesos</span></div>
          </div>
          <div className="pn-stat">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <div><strong>{[...consultas, ...informacion].filter(d => estaActivo(d.fechaFin)).length}</strong><span>abiertos</span></div>
          </div>
          <div className="pn-stat">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <div><strong>{[...consultas, ...informacion].filter(d => !estaActivo(d.fechaFin)).length}</strong><span>finalizados</span></div>
          </div>
          <div className="pn-stat">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            <div><strong>2</strong><span>categorías</span></div>
          </div>
        </div>
      </header>

      {/* ---- Filtro de año + búsqueda + filtros ---- */}
      <div className="pn-filtros-top">
        <div className="pn-anios">
          {anios.map(a => (
            <button key={a}
              className={`pn-anio-btn ${anioSeleccionado === a ? 'activo' : ''}`}
              onClick={() => setAnioActivo(a)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Año {a}
            </button>
          ))}
          <button
            className={`pn-anio-btn ${anioSeleccionado === 'todos' ? 'activo' : ''}`}
            onClick={() => setAnioActivo('todos')}>
            Todos
          </button>
        </div>

        <div className="pn-controles">
          <div className="pn-search-wrap">
            <svg className="pn-search-icon" width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              className="pn-search-input"
              placeholder="Buscar norma, expediente o palabra clave..."
              autoComplete="off" spellCheck="false"
              onInput={ev => setBusqueda(ev.target.value)} />
          </div>
          <select value={filtroEstado} onChange={ev => setFiltroEstado(ev.target.value)}>
            <option value="todos">Estado: Todos</option>
            <option value="abiertos">Abiertos</option>
            <option value="finalizados">Finalizados</option>
          </select>
          <select value={filtroTipo} onChange={ev => setFiltroTipo(ev.target.value)}>
            <option value="todos">Tipo: Todos</option>
            {tipos.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* ---- Layout dividido: Consulta Pública Previa ---- */}
      {tabActiva === 'consultas' && (
        <div className="pn-layout-split">
          <div className="pn-panel-izq">
            <div className="tab-nav">
              <button className="tab-button active">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Consulta pública previa
                <span className="pn-tab-count">{consultas.length}</span>
              </button>
              <button className="tab-button" onClick={() => setTabActiva('info')}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                Información pública
                <span className="pn-tab-count">{informacion.length}</span>
              </button>
            </div>
            <div className="pn-panel-cards">
              {consultasFiltradas.length > 0
                ? consultasFiltradas.map(item => <ConsultaCard key={item.id} item={item} />)
                : <p className="pn-vacio">No hay resultados.</p>}
            </div>
          </div>

          <div className="pn-panel-der">
            <div className="pn-panel-der-header">
              <span>Vista previa de <strong>Información pública</strong></span>
              <button className="pn-ver-todo" onClick={() => setTabActiva('info')}>
                Ver todo ({informacion.length}) →
              </button>
            </div>
            {infoFiltrada.length > 0
              ? infoFiltrada.map(item => <InfoCard key={item.id} item={item} compacta />)
              : <p className="pn-vacio">Sin resultados.</p>}
          </div>
        </div>
      )}

      {/* ---- Layout completo: Información Pública ---- */}
      {tabActiva === 'info' && (
        <div>
          <div className="tab-nav">
            <button className="tab-button" onClick={() => setTabActiva('consultas')}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              Consulta pública previa
              <span className="pn-tab-count">{consultas.length}</span>
            </button>
            <button className="tab-button active">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              Información pública
              <span className="pn-tab-count">{informacion.length}</span>
            </button>
          </div>
          <div className="pn-lista">
            {infoFiltrada.length > 0
              ? infoFiltrada.map(item => <InfoCard key={item.id} item={item} />)
              : <p className="pn-vacio">No hay resultados.</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipacionNormativa;
