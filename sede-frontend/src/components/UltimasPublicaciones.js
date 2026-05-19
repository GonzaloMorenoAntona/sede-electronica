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
  consulta:     { label: 'Consulta pública previa',       color: '#157279', bg: '#dbeafe' },
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
  { key: 'consulta', label: 'Consulta pública previa' },
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
    case 'subvencion': // Billete con moneda (Dinero/Ayudas)
      return <svg {...props}><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>;
    
    case 'pleno': // Edificio con columnas (Ayuntamiento/Institución)
      return <svg {...props}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
    
    case 'convenio': // Apreton de manos (Acuerdo)
      return <svg {...props}><path d="m11 17 2 2 6-6"/><path d="m18 14 2.5 2.5a3.3 3.3 0 0 0 4.7-4.7L19 5a4.5 4.5 0 0 0-6.3 0l-1.3 1.3"/><path d="m3 14 2.5 2.5a3.3 3.3 0 0 0 4.7-4.7L4 5a4.5 4.5 0 0 0-6.3 0L-3.6 6.3"/><path d="m8 11 5 5"/></svg>;
    
    case 'proceso': // Maletín (Empleo Público/Oposiciones)
      return <svg {...props}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
    
    case 'expediente': // Carpeta con lupa (Búsqueda de archivos)
      return <svg {...props}><path d="M4 20V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><circle cx="12" cy="13" r="2"/><path d="m14 15 1 1"/></svg>;
    
    case 'info_publica':
    case 'consulta': // Megáfono (Participación Ciudadana)
      return <svg {...props}><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>;
    
    default: // Documento genérico
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

