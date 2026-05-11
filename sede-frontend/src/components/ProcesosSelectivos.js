import React, { useState, useMemo } from 'react';
import './ProcesosSelectivos.css';

/* ===== Iconos ===== */
const PATHS = {
  doc:   <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
  cal:   <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
  clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
  ext:   <><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></>,
  lock:  <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
  check: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>,
};
const Icon = ({ name, size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{PATHS[name]}</svg>
);

/* ===== Helpers ===== */
const parseJSON = (j) => { try { return typeof j === 'string' ? JSON.parse(j) : (j || null); } catch { return null; } };
const parseArr  = (j) => { try { const r = typeof j === 'string' ? JSON.parse(j) : j; return Array.isArray(r) ? r : []; } catch { return []; } };
const formatFecha = (f) => f ? new Date(f).toLocaleDateString('es-ES') : '—';

const getEnlace = (p) => parseJSON(p.enlaceActivo);
const enlaceActivo = (p) => {
  const e = getEnlace(p);
  if (!e) return false;
  if (!e.fecha_fin_plazo) return !!e.url;
  return new Date(e.fecha_fin_plazo) >= new Date();
};

/* ===== Tarjeta ===== */
const Card = ({ proceso }) => {
  const bases     = parseArr(proceso.bases);
  const docs      = parseArr(proceso.documentos);
  const enlace    = getEnlace(proceso);
  const activo    = enlaceActivo(proceso);

  return (
    <article className={`ps-card ${activo ? 'ps-card--activo' : 'ps-card--cerrado'}`}>

      <div className="ps-card-icono">
        <Icon name="users" size={26} />
      </div>

      <div className="ps-card-info">
        <span className="ps-card-id">{proceso.idExternoSigem}</span>
        <h3>{proceso.titulo}</h3>
        {proceso.fechaSincronizacion && (
          <span className="ps-card-sync">
            <Icon name="clock" size={12} />
            Actualizado {new Date(proceso.fechaSincronizacion).toLocaleString('es-ES')}
          </span>
        )}
      </div>

      <div className="ps-card-estado">
        <span className={`ps-badge ${activo ? 'activo' : 'cerrado'}`}>
          ● {activo ? 'Plazo abierto' : 'Plazo cerrado'}
        </span>
        {enlace?.fecha_inicio_plazo && enlace?.fecha_fin_plazo && (
          <div className="ps-card-plazo">
            <span className="ps-card-plazo-label"><Icon name="cal" size={13} /> Plazo</span>
            <strong>{formatFecha(enlace.fecha_inicio_plazo)} - {formatFecha(enlace.fecha_fin_plazo)}</strong>
            <span className={`ps-plazo-estado ${activo ? 'verde' : 'gris'}`}>
              {activo ? 'En plazo' : 'Fuera de plazo'}
            </span>
          </div>
        )}
      </div>

      <div className="ps-card-docs">
        {bases.length > 0 && (
          <>
            <span className="ps-docs-label">Bases y convocatoria</span>
            {bases.map((b, i) => (
              <a key={i} href={b.url} target="_blank" rel="noreferrer" className="ps-doc">
                <span className="ps-doc-pdf">PDF</span>
                <span className="ps-doc-nombre">{b.label}</span>
              </a>
            ))}
          </>
        )}
        {docs.length > 0 && (
          <>
            <span className="ps-docs-label" style={{ marginTop: bases.length ? 8 : 0 }}>Documentación</span>
            {docs.map((d, i) => (
              <a key={i} href={d.url} target="_blank" rel="noreferrer" className="ps-doc">
                <span className="ps-doc-pdf">PDF</span>
                <span className="ps-doc-nombre">{d.label}</span>
              </a>
            ))}
          </>
        )}
        {bases.length === 0 && docs.length === 0 && (
          <span className="ps-docs-vacio">Sin documentación adjunta</span>
        )}
      </div>

      <div className="ps-card-acciones">
        {enlace?.url && activo ? (
          <a href={enlace.url} target="_blank" rel="noreferrer" className="ps-btn ps-btn--primario">
            <Icon name="ext" size={13} /> {enlace.label || 'Acceder'}
          </a>
        ) : enlace?.url ? (
          <span className="ps-btn ps-btn--inactivo">
            <Icon name="lock" size={13} /> Plazo cerrado
          </span>
        ) : null}
      </div>

    </article>
  );
};

/* ===== Componente principal ===== */
const ProcesosSelectivos = ({ datos, volver }) => {
  const [busqueda, setBusqueda]         = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  const filtrados = useMemo(() => datos.filter(d => {
    if (filtroEstado === 'activos'  && !enlaceActivo(d)) return false;
    if (filtroEstado === 'cerrados' &&  enlaceActivo(d)) return false;
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      return d.titulo?.toLowerCase().includes(q) ||
             d.idExternoSigem?.toLowerCase().includes(q);
    }
    return true;
  }), [datos, busqueda, filtroEstado]);

  const activos  = datos.filter(enlaceActivo).length;
  const cerrados = datos.length - activos;

  return (
    <div className="home-content-wrapper">
      {volver && <button onClick={volver} className="btn-volver">← VOLVER AL BUSCADOR</button>}

      <header className="ps-header">
        <div>
          <h1 className="ps-titulo">Procesos Selectivos</h1>
          <p className="ps-subtitulo">
            Consulta las oposiciones y bolsas de trabajo convocadas por el Ayuntamiento,
            descarga las bases y accede a los trámites dentro del plazo.
          </p>
        </div>
        <div className="ps-stats">
          <div className="ps-stat ps-stat--azul">
            <Icon name="users" size={22} />
            <div><strong>{datos.length}</strong><span>procesos</span></div>
          </div>
          <div className="ps-stat ps-stat--verde">
            <Icon name="clock" size={22} />
            <div><strong>{activos}</strong><span>con plazo abierto</span></div>
          </div>
          <div className="ps-stat ps-stat--gris">
            <Icon name="check" size={22} />
            <div><strong>{cerrados}</strong><span>cerrados</span></div>
          </div>
        </div>
      </header>

      <div className="ps-controles">
        <input
          type="text"
          className="ps-search-input"
          placeholder="Buscar proceso selectivo..."
          autoComplete="off"
          spellCheck="false"
          onInput={ev => setBusqueda(ev.target.value)}
        />
        <select value={filtroEstado} onChange={ev => setFiltroEstado(ev.target.value)}>
          <option value="todos">Estado: Todos</option>
          <option value="activos">Plazo abierto</option>
          <option value="cerrados">Plazo cerrado</option>
        </select>
      </div>

      <div className="ps-lista">
        {filtrados.length > 0
          ? filtrados.map(p => <Card key={p.id} proceso={p} />)
          : <p className="ps-vacio">{busqueda
              ? `No hay resultados para "${busqueda}".`
              : 'No hay procesos selectivos que coincidan con los filtros.'}</p>}
      </div>
    </div>
  );
};

export default ProcesosSelectivos;
