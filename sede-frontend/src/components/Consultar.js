import React, { useState } from 'react';
import './Consultar.css';

/* ===== Iconos SVG ===== */
const SVG_PATHS = {
  doc:      <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
  external: <><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></>,
  folder:   <><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></>,
  inbox:    <><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></>,
  shield:   <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
  bell:     <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>,
  monitor:  <><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>,
  mail:     <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
  phone:    <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></>,
  download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
  arrow:    <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
  chevR:    <><polyline points="9 18 15 12 9 6"/></>,
  chevL:    <><polyline points="15 18 9 12 15 6"/></>,
  chevD:    <><polyline points="6 9 12 15 18 9"/></>,
};

const Icon = ({ name, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {SVG_PATHS[name]}
  </svg>
);

const Consultar = ({ tramite1, enlacesExt, volver }) => {
  const [abierto, setAbierto] = useState(true);

  const obtenerUrlCanal = (id) => {
    const datosTramite = Array.isArray(tramite1) ? tramite1[0] : tramite1;
    if (!datosTramite) return null;
    const campoJson = datosTramite.enlacesJson || datosTramite.enlaces_json;
    if (!campoJson) return null;
    try {
      const arr = typeof campoJson === 'string' ? JSON.parse(campoJson) : campoJson;
      if (!Array.isArray(arr)) return null;
      return arr.find(e => e.id === id)?.url || null;
    } catch { return null; }
  };

  // Todas las URLs salen del enlacesJson del tramite 1 en la BD
  const urlCartaServicios = obtenerUrlCanal('carta_servicios_link');

  const canales = [
    { idEnlace: 'como_va_lo_mio_link', icon: 'monitor', tono: 'azul',   titulo: 'Cómo va lo mío',
      desc: 'Accede, mediante certificado electrónico, al gestor de expedientes municipal y consulta los documentos asociados al procedimiento.', cta: 'Acceder' },
    { idEnlace: 'mail_listado_link',   icon: 'mail',    tono: 'verde',  titulo: 'Información por mail',
      desc: 'Solicita la información que necesites sobre tu expediente. La respuesta se remitirá por este canal.', cta: 'Ver listado' },
    { idEnlace: 'tel_listado_link',    icon: 'phone',   tono: 'morado', titulo: 'Información telefónica',
      desc: 'Realiza las consultas que estimes oportunas utilizando el listado de teléfonos disponible.', cta: 'Consultar' },
  ];

  const urlRegistros = enlacesExt?.registros || null;
  const urlCve       = enlacesExt?.cve       || null;
  const urlDehu      = enlacesExt?.dehu      || null;

  const tarjetas = [
    { id: 'expedientes', icon: 'folder', tono: 'azul',    tipo: 'toggle',
      titulo: 'Estado de tus expedientes',              desc: 'Consulta el estado de tus procedimientos administrativos municipales.' },
    { id: 'registros',   icon: 'inbox',  tono: 'verde',   url: urlRegistros, cta: 'Ir a registros',
      titulo: 'Registros de entrada',                   desc: 'Consulta tus registros presentados y los justificantes de entrada.' },
    { id: 'cve',         icon: 'shield', tono: 'morado',  url: urlCve,       cta: 'Verificar documento',
      titulo: 'Código de Verificación Electrónica (CVE)', desc: 'Verifica la autenticidad de los documentos emitidos por el Ayuntamiento.' },
    { id: 'dehu',        icon: 'bell',   tono: 'naranja', url: urlDehu,      cta: 'Acceder a notificaciones',
      titulo: 'Notificaciones electrónicas (DEHú)',     desc: 'Accede a tus notificaciones electrónicas desde la Dirección Electrónica Habilitada única.' },
  ];

  return (
    <div className="consultar-page">
      <div className="consultar-head">
        <button onClick={volver} className="btn-volver">← VOLVER</button>
        <h1>Consultar</h1>
        <p>Consulta el estado de tus expedientes, registros, documentos y notificaciones electrónicas.</p>
      </div>

      <div className="consultar-cards">
        {tarjetas.map(t => {
          const inner = (
            <>
              <div className={`consultar-card-icon ${t.tono}`}><Icon name={t.icon} size={24}/></div>
              <div className="consultar-card-body">
                <h3>{t.titulo}</h3>
                <p>{t.desc}</p>
                {t.tipo === 'toggle' ? (
                  <span className="consultar-card-cta">
                    {abierto ? 'Ocultar canales' : 'Ver canales'} <Icon name={abierto ? 'chevD' : 'chevR'} size={15}/>
                  </span>
                ) : (
                  <span className="consultar-card-cta">{t.cta} <Icon name="arrow" size={15}/></span>
                )}
              </div>
            </>
          );
          if (t.tipo === 'toggle') {
            return (
              <button key={t.id} className={`consultar-card ${t.tono} ${abierto ? 'activa' : ''}`}
                      onClick={() => setAbierto(o => !o)}>{inner}</button>
            );
          }
          return (
            <a key={t.id} className={`consultar-card ${t.tono}`}
               href={t.url || '#'} target="_blank" rel="noreferrer"
               onClick={e => { if (!t.url) e.preventDefault(); }}>{inner}</a>
          );
        })}
      </div>

      {abierto && (
        <section className="consultar-panel">
          <h2>Estado de tus expedientes</h2>
          <p>El Ayuntamiento de Ciudad Real ofrece a los interesados información sobre el estado de
             los procedimientos administrativos a través de los siguientes canales:</p>

          <div className="consultar-canales">
            {canales.map(c => {
              const url = obtenerUrlCanal(c.idEnlace);
              return (
                <div key={c.idEnlace} className="consultar-canal">
                  <div className={`consultar-canal-icon ${c.tono}`}><Icon name={c.icon} size={22}/></div>
                  <h4>{c.titulo}</h4>
                  <p>{c.desc}</p>
                  <a className={`consultar-canal-btn ${c.tono} ${url ? '' : 'disabled'}`}
                     href={url || '#'} target="_blank" rel="noreferrer"
                     onClick={e => { if (!url) e.preventDefault(); }}>
                    {c.cta} <Icon name="arrow" size={14}/>
                  </a>
                </div>
              );
            })}
          </div>

          <div className="consultar-carta-banner">
            <div className="consultar-carta-icon">
              <Icon name="doc" size={22}/>
            </div>
            <div className="consultar-carta-texto">
              El compromiso que asume este Ayuntamiento con los interesados en relación a la información
              sobre el estado de los procedimientos se contiene en la siguiente <strong>Carta de Servicios</strong>
              <a href={urlCartaServicios || '#'} target="_blank" rel="noreferrer"
                 className="consultar-carta-link"
                 onClick={e => { if (!urlCartaServicios) e.preventDefault(); }}>
                <span className="consultar-carta-link-box">
                  <Icon name="external" size={12}/>
                </span>
                Carta de Servicios
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Consultar;
