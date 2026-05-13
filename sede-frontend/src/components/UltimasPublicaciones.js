import React, { useState } from 'react';
import './UltimasPublicaciones.css';

/* ===== Config visual por tipo ===== */
const TIPO_CONFIG = {
  tramite:      { label: 'Trámite',                color: '#305985', bg: '#e6f1fb' },
  subvencion:   { label: 'Subvención',             color: '#065f46', bg: '#d1fae5' },
  pleno:        { label: 'Pleno',                  color: '#6841a3', bg: '#ede9fe' },
  convenio:     { label: 'Convenio',               color: '#831843', bg: '#fce7f3' },
  proceso:      { label: 'Proceso selectivo',      color: '#78350f', bg: '#fef3c7' },
  expediente:   { label: 'Expediente Información pública',    color: '#ce8211', bg: '#fef1cf' },
  info_publica: { label: 'Información pública',        color: '#1f4fd3', bg: '#dbeafe' },
  consulta:     { label: 'Consulta pública Previa',       color: '#157279', bg: '#dbeafe' },
};

const TIPOS_FILTRO = [
  { key: 'todos',       label: 'Todos' },
  { key: 'tramite',     label: 'Trámites' },
  { key: 'subvencion',  label: 'Subvenciones' },
  { key: 'pleno',       label: 'Plenos' },
  { key: 'convenio',    label: 'Convenios' },
  { key: 'proceso',     label: 'Procesos selectivos' },
  { key: 'expediente',  label: 'Expediente Inf. pública' },
  { key: 'info_publica', label: 'Información pública' },
  { key: 'consulta', label: 'Consulta pública Previa' },
];

/* ===== Icono SVG — JSX dentro del componente, no a nivel de módulo ===== */
const Icono = ({ tipo, size = 26 }) => {
  const props = {
    width: size, height: size,
    viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: '2',
    strokeLinecap: 'round', strokeLinejoin: 'round',
  };
  switch (tipo) {
    case 'subvencion':
      return <svg {...props}><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>;
    case 'pleno':
      return <svg {...props}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/></svg>;
    case 'convenio':
      return <svg {...props}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
    case 'proceso':
      return <svg {...props}><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>;
    case 'expediente':
      return <svg {...props}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>;
    case 'info_publica':
    case 'consulta':
      return <svg {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
    default: // tramite
      return <svg {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
  }
};

const CalIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: '-1px' }}>
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const formatFecha = (f) => {
  if (!f) return '';
  return new Date(f).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
};

/* ===== Tarjeta ===== */
const NoticiaCard = ({ item }) => {
  const cfg = TIPO_CONFIG[item.tipo] || TIPO_CONFIG.tramite;
  return (
    <article className="up-card">
      <div className="up-card-header" style={{ background: cfg.color }}>
        <span className="up-card-badge">{cfg.label}</span>
        <div className="up-card-icon"><Icono tipo={item.tipo} size={40} /></div>
      </div>
      <div className="up-card-body">
        <span className="up-card-fecha"><CalIcon /> {formatFecha(item.fecha)}</span>
        <h3 className="up-card-titulo">{item.titulo}</h3>
        {item.descripcion && <p className="up-card-desc">{item.descripcion}</p>}
        <span className="up-card-tipo-pill" style={{ background: cfg.bg, color: cfg.color }}>
          {cfg.label}
        </span>
      </div>
    </article>
  );
};

/* ===== Componente principal ===== */
const UltimasPublicaciones = ({ noticias = [] }) => {
  const [filtro, setFiltro]        = useState('todos');
  const [mostrarTodas, setMostrar] = useState(false);

  const filtradas = filtro === 'todos' ? noticias : noticias.filter(n => n.tipo === filtro);
  const visibles  = mostrarTodas ? filtradas : filtradas.slice(0, 6);

  return (
    <section className="up-section">
      <div className="up-header">
        <div>
          <h2 className="section-title" style={{ marginBottom: 4 }}>Últimas Publicaciones</h2>
          <p className="up-subtitulo">
            Nuevos trámites, convocatorias, plenos y novedades del Ayuntamiento
          </p>
        </div>
        {filtradas.length > 6 && !mostrarTodas && (
          <button className="up-ver-todas" onClick={() => setMostrar(true)}>
            Ver todas ({filtradas.length}) →
          </button>
        )}
      </div>

      <div className="up-filtros">
        {TIPOS_FILTRO.map(f => (
          <button key={f.key}
            onClick={() => { setFiltro(f.key); setMostrar(false); }}
            className={`up-filtro-btn ${filtro === f.key ? 'up-filtro-btn--activo' : ''}`}>
            {f.label}
          </button>
        ))}
      </div>

      {visibles.length > 0 ? (
        <div className="up-grid">
          {visibles.map((item, i) => (
            <NoticiaCard key={`${item.tipo}-${item.id}-${i}`} item={item} />
          ))}
        </div>
      ) : (
        <p className="up-vacio">No hay publicaciones recientes.</p>
      )}

      {filtradas.length > 6 && mostrarTodas && (
        <button className="up-colapsar" onClick={() => setMostrar(false)}>▲ Mostrar menos</button>
      )}
    </section>
  );
};

export default UltimasPublicaciones;

