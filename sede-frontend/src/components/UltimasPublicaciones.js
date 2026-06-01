import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UltimasPublicaciones.css';
console.log('UltimasPublicaciones renderizado');
/* ===== Config visual por tipo ===== */
const TIPO_CONFIG = {
  tramite:        { label: 'Trámite',                  color: '#305985', bg: '#e6f1fb' },
  subvencion:     { label: 'Subvención',               color: '#065f46', bg: '#d1fae5' },
  pleno:          { label: 'Pleno',                    color: '#6841a3', bg: '#ede9fe' },
  convenio:       { label: 'Convenio',                 color: '#831843', bg: '#fce7f3' },
  proceso:        { label: 'Proceso selectivo',        color: '#78350f', bg: '#fef3c7' },
  expediente:     { label: 'Expediente Inf. pública',  color: '#ce8211', bg: '#fef1cf' },
  info_publica:   { label: 'Información pública',      color: '#1f4fd3', bg: '#dbeafe' },
  consulta:       { label: 'Consulta pública previa',  color: '#157279', bg: '#dbeafe' },
  junta_gobierno: { label: 'Junta de Gobierno Local',  color: '#0b3d91', bg: '#e0e7ff' },
};

/* Ruta a la que navega cada tipo al pulsar la tarjeta */
const TIPO_RUTA = {
  subvencion:     '/subvenciones',
  pleno:          '/plenos',
  junta_gobierno: '/juntas-gobierno',
  convenio:       '/convenios',
  proceso:        '/procesos-selectivos',
  expediente:     '/expedientes-info-publica',
  info_publica:   '/participacion-normativa',
  consulta:       '/participacion-normativa',
  tramite:        null, // los trámites usan abrirTramite que gestiona casos especiales.
};

const TIPOS_FILTRO = [
  { key: 'todos',          label: 'Todos' },
  { key: 'tramite',        label: 'Trámites' },
  { key: 'subvencion',     label: 'Subvenciones' },
  { key: 'pleno',          label: 'Plenos' },
  { key: 'junta_gobierno', label: 'Junta de Gobierno' },
  { key: 'convenio',       label: 'Convenios' },
  { key: 'proceso',        label: 'Procesos selectivos' },
  { key: 'expediente',     label: 'Expediente Inf. pública' },
  { key: 'info_publica',   label: 'Información pública' },
  { key: 'consulta',       label: 'Consulta pública previa' },
];

const Icono = ({ tipo, size = 26 }) => {
  const props = {
    width: size, height: size,
    viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: '2',
    strokeLinecap: 'round', strokeLinejoin: 'round',
  };
  switch (tipo) {
    case 'subvencion':
      return <svg {...props}><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>;
    case 'pleno':
      return <svg {...props}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
    case 'junta_gobierno':
      return <svg {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    case 'convenio':
      return <svg {...props}><path d="m11 17 2 2 6-6"/><path d="M18 14v6"/><path d="M6 14v6"/><path d="M2 10h20"/><path d="M2 6h20"/></svg>;
    case 'proceso':
      return <svg {...props}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
    case 'expediente':
      return <svg {...props}><path d="M4 20V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><circle cx="12" cy="13" r="2"/><path d="m14 15 1 1"/></svg>;
    case 'info_publica':
    case 'consulta':
      return <svg {...props}><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>;
    default:
      return <svg {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>;
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

const NoticiaCard = ({ item, abrirTramite }) => {
  const navigate = useNavigate();
  const cfg  = TIPO_CONFIG[item.tipo] || TIPO_CONFIG.tramite;
  const ruta = TIPO_RUTA[item.tipo];

  const handleClick = () => {
    if (ruta) {
      navigate(ruta);
    } else {
      // tramite → usa abrirTramite que ya gestiona los casos especiales (id 16→subvenciones, etc.)
      abrirTramite(item.id);
    }
  };

  return (
    <article className="up-card up-card--clickable" onClick={handleClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && handleClick()}>
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

const UltimasPublicaciones = ({ noticias = [], abrirTramite = () => {} }) => {
  const [filtro, setFiltro]        = useState('todos');
  const [mostrarTodas, setMostrar] = useState(false);

  const filtradas = filtro === 'todos' ? noticias : noticias.filter(n => n.tipo === filtro);
  const visibles  = mostrarTodas ? filtradas : filtradas.slice(0, 6);

  return (
    <section className="up-section">
      <div className="up-header">
        <div>
          <h2 className="up-titulo">Últimas Publicaciones</h2>
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
            <NoticiaCard key={`${item.tipo}-${item.id}-${i}`} item={item} abrirTramite={abrirTramite} />
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
