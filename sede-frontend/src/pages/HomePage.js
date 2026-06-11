import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BuscadorPage from './BuscadorPage';
import IconoMuni from './IconoMuni';
import UltimasPublicaciones from '../components/UltimasPublicaciones';
import FormularioSoporte from '../components/FormularioSoporte';
console.log('HomePage renderizado');
/* ===== Iconos SVG ===== */
const SVG_PATHS = {
  search:    <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
  user:      <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
  building:  <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>,
  briefcase: <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>,
  shield:    <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
  leaf:      <><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.2 2.96c.5 2.26.7 3.84.7 6.04 0 5.5-4.78 8-8.9 11"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/></>,
  doc:       <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
  folder:    <><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></>,
  creditcard:<><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></>,
  arrow:     <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
  chevR:     <><polyline points="9 18 15 12 9 6"/></>,
  chevL:     <><polyline points="15 18 9 12 15 6"/></>,
  x:         <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
  bell:      <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>,
  car:       <><path d="M5 17h-2v-6l2-5h13l4 5v6h-2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></>,
  headset:   <><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></>,
  zap:       <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>,
};
const Icon = ({ name, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {SVG_PATHS[name]}
  </svg>
);

const HERO_SLIDES = [
  { id: 1, image: '/assets/ayuntamiento.jpg', title: 'Sede Electrónica del Ayuntamiento de Ciudad Real',
    subtitle: 'Accede a todos los trámites y servicios municipales desde cualquier lugar', cta: 'Acceder a trámites' },
  { id: 2, image: '/assets/parque-prado.jpg', title: 'Trámites electrónicos disponibles 24 horas',
    subtitle: 'Gestiona tus expedientes sin desplazarte. Administración más cercana, más eficiente', cta: 'Ver todos los trámites' },
  { id: 3, image: '/assets/puerta-toledo.jpg', title: 'Participación Ciudadana en Ciudad Real',
    subtitle: 'Tu opinión construye la ciudad. Consultas y proyectos normativos abiertos', cta: 'Participar ahora' },
];

const ACCESOS = [
  { id: 'tramitar',  icon: 'doc',        tono: 'azul',   titulo: 'Tramitar',
    desc: 'Presenta solicitudes, instancia general, subvenciones y trámites municipales.', cta: 'Ir a trámites' },
  { id: 'consultar', icon: 'folder',     tono: 'verde',  titulo: 'Consultar',
    desc: 'Consulta tus expedientes, registros, documentos y notificaciones.',             cta: 'Consultar expedientes' },
  { id: 'pagar',     icon: 'creditcard', tono: 'morado', titulo: 'Pagar y gestionar',
    desc: 'Gestiona tributos, tasas, recibos y paga de forma segura.',                     cta: 'Ir a portal tributario' },
];

/* IDs cubiertos en otros sitios — no mostrar en Información Municipal */
const OCULTAR_IDS = new Set([1, 8, 91, 92, 93, 94, 106]);

/* ===== Subcomponentes ===== */
const CarruselHero = ({ onCta }) => {
  const [idx, setIdx]   = useState(0);
  const [fade, setFade] = useState(false); 
  const go = useCallback((i) => {
    if (fade) return;
    setFade(true);
    setTimeout(() => { setIdx(i); setFade(false); }, 200);
  }, [fade]);
  useEffect(() => {
    const t = setInterval(() => go((idx + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(t);
  }, [idx, go]);
  const slide = HERO_SLIDES[idx];
  return (
    <section className="sede-hero">
      <img src={slide.image} alt={slide.title} className={`sede-hero-img ${fade ? 'fade' : ''}`}/>
      <div className="sede-hero-overlay"/>
      <div className={`sede-hero-content ${fade ? 'fade' : ''}`}>
        <h1>{slide.title}</h1>
        <p>{slide.subtitle}</p>
        <button onClick={onCta} className="sede-hero-cta">
          {slide.cta} <Icon name="chevR" size={14}/>
        </button>
      </div>
      <button className="sede-hero-arr left"  onClick={() => go((idx - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)} aria-label="Anterior"><Icon name="chevL" size={20}/></button>
      <button className="sede-hero-arr right" onClick={() => go((idx + 1) % HERO_SLIDES.length)} aria-label="Siguiente"><Icon name="chevR" size={20}/></button>
      <div className="sede-hero-dots">
        {HERO_SLIDES.map((_, i) => (
          <button key={i} onClick={() => go(i)} className={i === idx ? 'activo' : ''} aria-label={`Slide ${i+1}`}/>
        ))}
      </div>
    </section>
  );
};

const SeccionBuscador = ({ categorias, abrirTramite }) => (
  <section className="sede-search">
    <div className="sede-search-inner">
      <h2>¿Qué trámite necesitas realizar?</h2>
      <p>Busca entre todos los trámites, servicios y documentos municipales disponibles</p>
      <BuscadorPage categorias={categorias} abrirTramite={abrirTramite}/>
    </div>
  </section>
);

const AccesosPrincipales = ({ onTramitar, onConsultar, urlPagar }) => (
  <section className="sede-accesos">
    <div className="sede-accesos-inner">
      {ACCESOS.map(a => {
        const inner = (
          <>
            <div className="sede-acceso-icon"><Icon name={a.icon} size={26}/></div>
            <div className="sede-acceso-body">
              <h3>{a.titulo}</h3>
              <p>{a.desc}</p>
              <span className="sede-acceso-cta">{a.cta} <Icon name="arrow" size={15}/></span>
            </div>
          </>
        );
        if (a.id === 'pagar') {
          return (
            <a key={a.id} href={urlPagar} target="_blank" rel="noreferrer"
               className={`sede-acceso sede-acceso--${a.tono}`}>{inner}</a>
          );
        }
        return (
          <button key={a.id} onClick={a.id === 'tramitar' ? onTramitar : onConsultar}
                  className={`sede-acceso sede-acceso--${a.tono}`}>{inner}</button>
        );
      })}
    </div>
  </section>
);

const SoporteAlertas = ({ onSuscribir }) => {
  const [visible, setVisible]       = useState(true);
  const [formAbierto, setFormAbierto] = useState(false);

  if (!visible) return null;

  return (
    <section className="sede-banners-descartables">
      <button className="sede-banner-cerrar" onClick={() => setVisible(false)} aria-label="Cerrar avisos">
        <Icon name="x" size={18}/>
      </button>
      <div className="sede-banners-inner">
        <div className="sede-banner-item azul">
          <div className="sede-banner-icon"><Icon name="headset" size={24}/></div>
          <div className="sede-banner-texto">
            <strong>Ayuda y Soporte Técnico</strong>
            <span>¿Tienes problemas? Contacta con soporte o lee nuestras guías.</span>
          </div>
          <button onClick={() => setFormAbierto(o => !o)} className="sede-banner-btn">
            {formAbierto ? 'Cerrar formulario' : 'Ver ayuda'} <Icon name="arrow" size={14}/>
          </button>
        </div>
        <div className="sede-banner-item naranja">
          <div className="sede-banner-icon"><Icon name="bell" size={24}/></div>
          <div className="sede-banner-texto">
            <strong>Suscripciones Municipales</strong>
            <span>Recibe en tu correo las novedades que te interesan.</span>
          </div>
          <button onClick={onSuscribir} className="sede-banner-btn">
            Gestionar alertas <Icon name="arrow" size={14}/>
          </button>
        </div>
      </div>

      {formAbierto && (
        <div className="sede-soporte-form-wrap">
          <div className="sede-soporte-form-inner">
            <h3>Formulario de Soporte Técnico</h3>
            <p>Completa los campos y te responderemos lo antes posible.</p>
            <FormularioSoporte onCerrar={() => setFormAbierto(false)}/>
          </div>
        </div>
      )}
    </section>
  );
};

const AreasTematicas = ({ categorias, abrirCategoria }) => {
  const areas = categorias.filter(c => c.id <= 9 || c.id === 14);
  return (
    <section id="tramites" className="sede-areas">
      <div className="sede-areas-inner">
        <div className="sede-section-head">
          <div>
            <h2>Áreas Municipales de Gestión</h2>
            <p>Encuentra los trámites agrupados por área temática</p>
          </div>
        </div>
        <div className="sede-areas-grid">
          {areas.map(cat => (
            <div key={cat.id} className="sede-area-card" onClick={() => abrirCategoria(cat)}>
              <div className="sede-area-icon"><IconoMuni icono={cat.icono}/></div>
              <div className="sede-area-body">
                <h3>{cat.nombre}</h3>
                <p>Gestiones de {cat.nombre.toLowerCase()}</p>
              </div>
              <div className="sede-area-arrow"><Icon name="chevR" size={16}/></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const EnlacesMunicipales = ({ items = [], abrirTramite }) => {
  const [cveOpen, setCveOpen] = useState(false);

  const visibles = (Array.isArray(items) ? items : [])
    .filter(i => !OCULTAR_IDS.has(Number(i.id)));

  const esCve    = i => /\bCVE\b/i.test(i.titulo || '');
  const urlItem  = i => i.urlExterna || i.url_externa || i.url || null;
  const cve      = visibles.filter(esCve);
  const normales = visibles.filter(i => !esCve(i));

  if (!visibles.length) return null;

  return (
    <section className="sede-municipal">
      <div className="sede-municipal-inner">
        <div className="sede-section-head">
          <h2>Información Municipal</h2>
          <p>Accede a los tablones, documentos y portales del Ayuntamiento</p>
        </div>
        <div className="sede-municipal-grid">
          {normales.map(i => (
            urlItem(i) ? (
              <a key={i.id} href={urlItem(i)} target="_blank" rel="noreferrer" className="sede-municipal-link">
                <Icon name="doc" size={16}/><span>{i.titulo}</span>
              </a>
            ) : (
              <button key={i.id} onClick={() => abrirTramite(i.id)} className="sede-municipal-link">
                <Icon name="doc" size={16}/><span>{i.titulo}</span>
              </button>
            )
          ))}

          {cve.length > 0 && (
            <div className={`sede-municipal-link sede-municipal-cve ${cveOpen ? 'open' : ''}`}
                 onClick={() => setCveOpen(o => !o)}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon name="shield" size={16}/> Verificación de documentos electrónicos
              </span>
              <Icon name={cveOpen ? 'chevL' : 'chevR'} size={14}/>
              {cveOpen && (
                <div className="sede-municipal-cve-drop">
                  {cve.map(c => (
                    <a key={c.id} href={urlItem(c)} target="_blank" rel="noreferrer"
                       className="sede-municipal-cve-opt">{c.titulo}</a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const ACCESOS_CONFIG = [
  { id: 5,   logo: '/logos/perfil-contratante.png',  alt: 'Perfil del Contratante' },
  { id: 122, logo: '/logos/oav.png',                 alt: 'OAV - Oficina de Atención Urbanística' },
  { id: 7,   logo: '/logos/carpeta-ciudadana.png',   alt: 'Carpeta Ciudadana' },
  { id: 2,   logo: '/logos/etablon.png',             alt: 'eTablon' },
  { id: 13,  logo: '/logos/sugerencias.png',         alt: 'Oficina de Sugerencias y Reclamaciones' },
  { id: 18,  logo: '/logos/face.png',                alt: 'FACe - Punto General de Facturación' },
  { id: 121, logo: '/logos/mifactura.png',           alt: 'MiFactura - Gobierno de España' },
  { id: 120, logo: '/logos/dehu.png',                alt: 'DEHú - Notificaciones' },
];

const AccesosRapidos = ({ abrirTramite }) => {
  const navigate = useNavigate();
  const [accesos, setAccesos] = useState([]);

  useEffect(() => {
    Promise.all(
      ACCESOS_CONFIG.map(cfg =>
        fetch(`/api/tramites/${cfg.id}/detalle`)
          .then(r => r.json())
          .then(data => {
            const url = data?.urlExterna || data?.url_externa || null;
            return { id: cfg.id, url, logo: cfg.logo, alt: cfg.alt };
          })
          .catch(() => null)
      )
    ).then(results => setAccesos(results.filter(Boolean)));
  }, []);

  if (!accesos.length) return null;

  const handleClick = (a, e) => {
    if (a.url) return;
    e.preventDefault();
    if (abrirTramite) abrirTramite(a.id);
    else navigate(`/tramite/${a.id}`);
  };

  return (
    <section className="sede-rapidos">
      <div className="sede-rapidos-inner">
        <h2 className="sede-rapidos-titulo">
          <Icon name="zap" size={22}/> Accesos rápidos
        </h2>
        <p className="sede-rapidos-sub">Accede de forma directa a los servicios electrónicos más utilizados.</p>
        <div className="sede-rapidos-grid">
          {accesos.map(a => (
            <a key={a.id} href={a.url || '#'} target={a.url ? '_blank' : '_self'}
               rel="noreferrer" className="sede-rapido-card" title={a.alt}
               onClick={e => handleClick(a, e)}>
              <img src={a.logo} alt={a.alt} loading="lazy"/>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ===== HomePage ===== */
const HomePage = ({ categorias, alSeleccionarTramite, abrirCategoria }) => {
  const navigate = useNavigate();
  const [noticias,      setNoticias]      = useState([]);
  const [infoMunicipal, setInfoMunicipal] = useState([]);

  useEffect(() => {
    fetch('/api/noticias?limit=24')
      .then(r => r.json()).then(setNoticias).catch(() => setNoticias([]));

    fetch('/api/tramites?categoriaId=13')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setInfoMunicipal(data);
        else if (data?.content) setInfoMunicipal(data.content);
        else setInfoMunicipal([]);
      })
      .catch(() => setInfoMunicipal([]));
  }, []);

  const urlPagar =
    infoMunicipal.find(i => /portal tributario/i.test(i.titulo || ''))?.urlExterna || null;

  const irASuscripcion = () => navigate('/suscripcion');
  const irAConsultar   = () => navigate('/consultar');
  const scrollTramites = () => document.getElementById('tramites')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <>
      <CarruselHero onCta={scrollTramites}/>
      <div className="sede-barra-fina-azul"/>
      <SeccionBuscador categorias={categorias} abrirTramite={alSeleccionarTramite}/>
      <AccesosPrincipales onTramitar={scrollTramites} onConsultar={irAConsultar} urlPagar={urlPagar}/>
      <SoporteAlertas onSuscribir={irASuscripcion}/>
      <AreasTematicas categorias={categorias} abrirCategoria={abrirCategoria}/>
      <section id="publicaciones" className="sede-publicaciones">
        <div className="sede-publicaciones-inner">
          <UltimasPublicaciones noticias={noticias} abrirTramite={alSeleccionarTramite}/>
        </div>
      </section>
      <EnlacesMunicipales items={infoMunicipal} abrirTramite={alSeleccionarTramite}/>
      <AccesosRapidos abrirTramite={alSeleccionarTramite}/>
    </>
  );
};

export default HomePage;
