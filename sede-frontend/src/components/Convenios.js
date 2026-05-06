import React, { useState, useMemo } from 'react';
import './Convenios.css';

const MATERIA_ICONOS = {
  social:    { color: '#3b82f6', svg: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></> },
  educacion: { color: '#a855f7', svg: <><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></> },
  cultura:   { color: '#ec4899', svg: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></> },
  deportes:  { color: '#10b981', svg: <><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/></> },
  empleo:    { color: '#eab308', svg: <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></> },
  default:   { color: '#64748b', svg: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></> },
};
const getMateriaIcono = (m) => {
  if (!m) return MATERIA_ICONOS.default;
  const k = m.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (k.includes('social'))  return MATERIA_ICONOS.social;
  if (k.includes('educa'))   return MATERIA_ICONOS.educacion;
  if (k.includes('cultur'))  return MATERIA_ICONOS.cultura;
  if (k.includes('deport'))  return MATERIA_ICONOS.deportes;
  if (k.includes('emple'))   return MATERIA_ICONOS.empleo;
  return MATERIA_ICONOS.default;
};

const parseJSON   = (j) => { try { return typeof j === 'string' ? JSON.parse(j) : (j || null); } catch { return null; } };
const formatFecha = (f) => f ? new Date(f).toLocaleDateString('es-ES') : '—';
const isVigente   = (c) => !c.plazoVigenciaFin || new Date(c.plazoVigenciaFin) >= new Date();
const getAnio     = (c) => c.plazoVigenciaInicio ? new Date(c.plazoVigenciaInicio).getFullYear() : null;

/* ===== Tarjeta — 4 columnas (sin Ver detalle) ===== */
const ConvenioCard = ({ convenio }) => {
  const vigente   = isVigente(convenio);
  const documento = parseJSON(convenio.documento);

  return (
    <article className={`conv-card ${vigente ? 'conv-card--vigente' : 'conv-card--expirado'}`}>

      <div className="conv-card-icono">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {vigente
            ? <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>
            : <><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></>
          }
        </svg>
      </div>

      <div className="conv-card-info">
        <span className="conv-card-id">{convenio.idExternoSigem}</span>
        <h3>{convenio.titulo}</h3>
        <div className="conv-card-tags">
          {convenio.clase   && <span className="convenio-tag">{convenio.clase}</span>}
          {convenio.detalle && <span className="convenio-tag">{convenio.detalle}</span>}
        </div>
        {convenio.entidadesFirmantes && (
          <p className="conv-card-firmantes">
            <strong>Entidades firmantes:</strong> {convenio.entidadesFirmantes}
          </p>
        )}
      </div>

      <div className="conv-card-estado">
        <span className={`convenio-card-badge ${vigente ? 'vigente' : 'expirado'}`}>
          ● {vigente ? 'VIGENTE' : 'FINALIZADO'}
        </span>
        {(convenio.plazoVigenciaInicio || convenio.plazoVigenciaFin) && (
          <div className="conv-card-vigencia-bloque">
            <span className="conv-card-vig-label">Vigencia</span>
            <strong>{formatFecha(convenio.plazoVigenciaInicio)}</strong>
            <span>→ {formatFecha(convenio.plazoVigenciaFin)}</span>
          </div>
        )}
        {convenio.fechaSincronizacion && (
          <span className="conv-card-actualizado">
            Actualizado: {formatFecha(convenio.fechaSincronizacion)}
          </span>
        )}
      </div>

      <div className="conv-card-doc">
        {documento?.url ? (
          <>
            <span className="conv-card-doc-titulo">DOCUMENTO DEL CONVENIO</span>
            <div className="conv-card-doc-fila">
              <span className="conv-card-doc-pdf">PDF</span>
              <span className="conv-card-doc-nombre">
                {documento.label || `Convenio ${convenio.idExternoSigem}.pdf`}
              </span>
            </div>
            <a href={documento.url} target="_blank" rel="noreferrer" className="conv-btn conv-btn--secundario">
              ↓ Descargar
            </a>
          </>
        ) : (
          <span className="conv-card-doc-vacio">Sin documento adjunto</span>
        )}
      </div>
    </article>
  );
};

/* ===== Componente principal ===== */
const Convenios = ({ datos, volver }) => {
  const [materiaAbierta, setMateriaAbierta] = useState(null);
  const [anioGlobal, setAnioGlobal]       = useState('todos');
  const [busqueda, setBusqueda]           = useState('');
  const [filtroMateria, setFiltroMateria] = useState('todas');
  const [filtroClase, setFiltroClase]     = useState('todas');
  const [filtroEstado, setFiltroEstado]   = useState('todos');

  const anios    = useMemo(() => [...new Set(datos.map(getAnio).filter(Boolean))].sort((a, b) => b - a), [datos]);
  const materias = useMemo(() => [...new Set(datos.map(d => d.materia).filter(Boolean))].sort(), [datos]);
  const clases   = useMemo(() => [...new Set(datos.map(d => d.clase).filter(Boolean))].sort(), [datos]);

  const filtrados = useMemo(() => datos.filter(d => {
    if (anioGlobal !== 'todos' && getAnio(d) !== Number(anioGlobal)) return false;
    if (filtroMateria !== 'todas' && d.materia !== filtroMateria) return false;
    if (filtroClase   !== 'todas' && d.clase   !== filtroClase)   return false;
    if (filtroEstado === 'vigentes'    && !isVigente(d)) return false;
    if (filtroEstado === 'finalizados' &&  isVigente(d)) return false;
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      return d.titulo?.toLowerCase().includes(q) ||
             d.entidadesFirmantes?.toLowerCase().includes(q) ||
             d.materia?.toLowerCase().includes(q) ||
             d.idExternoSigem?.toLowerCase().includes(q);
    }
    return true;
  }), [datos, anioGlobal, busqueda, filtroMateria, filtroClase, filtroEstado]);

  const vigentes    = filtrados.filter(isVigente).length;
  const conDoc      = filtrados.filter(d => parseJSON(d.documento)?.url).length;
  const finEsteAnio = filtrados.filter(d => {
    if (!d.plazoVigenciaFin) return false;
    const f = new Date(d.plazoVigenciaFin);
    return f < new Date() && f.getFullYear() === new Date().getFullYear();
  }).length;

  const gruposMaterias = useMemo(() =>
    [...new Set(filtrados.map(d => d.materia).filter(Boolean))].sort(), [filtrados]);

  return (
    <div className="home-content-wrapper">
      {volver && <button onClick={volver} className="btn-volver">← VOLVER AL BUSCADOR</button>}

      <header className="conv-header">
        <div>
          <h1 className="conv-titulo">Convenios Municipales</h1>
          <p className="conv-subtitulo">
            Consulta los convenios de colaboración firmados por el Ayuntamiento.
            Información actualizada y accesible para la ciudadanía.
          </p>
        </div>
        <div className="conv-stats">
          <div className="conv-stat conv-stat--azul">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <div><strong>{filtrados.length}</strong><span>Convenios en total</span></div>
          </div>
          <div className="conv-stat conv-stat--verde">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <div><strong>{vigentes}</strong><span>Vigentes</span></div>
          </div>
          <div className="conv-stat conv-stat--naranja">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></svg>
            <div><strong>{finEsteAnio}</strong><span>Vigencia finalizada este año</span></div>
          </div>
          <div className="conv-stat conv-stat--morado">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            <div><strong>{conDoc}</strong><span>Documentos disponibles</span></div>
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

      <div className="conv-controles">
        <input type="text" className="conv-search-input"
          placeholder="Buscar convenio, entidad, materia..."
          autoComplete="off" spellCheck="false"
          onInput={ev => setBusqueda(ev.target.value)} />
        <select value={filtroMateria} onChange={ev => setFiltroMateria(ev.target.value)}>
          <option value="todas">Materia: Todas</option>
          {materias.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select value={filtroClase} onChange={ev => setFiltroClase(ev.target.value)}>
          <option value="todas">Clase: Todas</option>
          {clases.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filtroEstado} onChange={ev => setFiltroEstado(ev.target.value)}>
          <option value="todos">Estado: Todos</option>
          <option value="vigentes">Vigentes</option>
          <option value="finalizados">Finalizados</option>
        </select>
      </div>

      <div className="sub-acordeones">
        {gruposMaterias.map(materia => {
          const ico    = getMateriaIcono(materia);
          const lista  = filtrados.filter(d => d.materia === materia);
          const abierto = materiaAbierta === materia;
          return (
            <div key={materia} className="conv-grupo">
              <button className="conv-acordeon-header"
                onClick={() => setMateriaAbierta(abierto ? null : materia)}>
                <span className="conv-acordeon-icono" style={{ background: ico.color }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {ico.svg}
                  </svg>
                </span>
                <span className="conv-acordeon-nombre">{materia.toUpperCase()}</span>
                <span className="conv-acordeon-count">
                  {lista.length} {lista.length === 1 ? 'convenio' : 'convenios'}
                </span>
                <span className="conv-acordeon-chev">{abierto ? '▲' : '▼'}</span>
              </button>
              {abierto && (
                <div className="conv-grupo-body">
                  {lista.map(c => <ConvenioCard key={c.id} convenio={c} />)}
                </div>
              )}
            </div>
          );
        })}
        {gruposMaterias.length === 0 && (
          <p className="conv-vacio">{busqueda
            ? `No hay resultados para "${busqueda}".`
            : 'No hay convenios que coincidan con los filtros.'}</p>
        )}
      </div>
    </div>
  );
};

export default Convenios;

