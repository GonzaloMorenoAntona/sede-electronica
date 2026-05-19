import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BuscadorPage from './BuscadorPage';
import IconoMuni from './IconoMuni';
import UltimasPublicaciones from '../components/UltimasPublicaciones';
import './HomePage.css';

import imgAyuntamiento from '../assets/ayuntamiento.jpg';
import imgPrado from '../assets/parque-prado.jpg';
import imgPuerta from '../assets/puerta-toledo.jpg';
import imgLogo from '../assets/logo-ayuntamiento.jpg';
import imgSkyline from '../assets/skyline-footer.png';
console.log('Imágenes cargadas:', { imgAyuntamiento, imgPrado, imgPuerta, imgLogo, imgSkyline });
/* ===== Iconos SVG ===== */
const SVG_PATHS = {
  search:   <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
  bell:     <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>,
  user:     <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
  building: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>,
  briefcase:<><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>,
  shield:   <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
  leaf:     <><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.2 2.96c.5 2.26.7 3.84.7 6.04 0 5.5-4.78 8-8.9 11"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/></>,
  doc:      <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
  folder:   <><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></>,
  creditcard:<><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></>,
  arrow:    <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
  chevR:    <><polyline points="9 18 15 12 9 6"/></>,
  chevL:    <><polyline points="15 18 9 12 15 6"/></>,
  x:        <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
  menu:     <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>,
  fb:       <><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></>,
  tw:       <><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></>,
  yt:       <><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></>,
  mapPin:   <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
  phone:    <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></>,
  mail:     <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
  clock:    <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
  car:      <><path d="M5 17h-2v-6l2-5h13l4 5v6h-2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></>,
};
const Icon = ({ name, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {SVG_PATHS[name]}
  </svg>
);

/* ===== Datos ===== */
const HERO_SLIDES = [
  { id: 1, image: imgAyuntamiento, title: 'Sede Electrónica del Ayuntamiento de Ciudad Real',
    subtitle: 'Accede a todos los trámites y servicios municipales desde cualquier lugar', cta: 'Acceder a trámites' },
  { id: 2, image: imgPrado, title: 'Trámites electrónicos disponibles 24 horas',
    subtitle: 'Gestiona tus expedientes sin desplazarte. Administración más cercana, más eficiente', cta: 'Ver todos los trámites' },
  { id: 3, image: imgPuerta, title: 'Participación Ciudadana en Ciudad Real',
    subtitle: 'Tu opinión construye la ciudad. Consultas y proyectos normativos abiertos', cta: 'Participar ahora' },
];

const QUICK_SHORTCUTS = [
  { id: 25,  label: 'Certificado de empadronamiento', icon: 'doc' },
  { id: 8,   label: 'Portal Tributario',             icon: 'creditcard', externo: true, url: 'https://carpetatributaria.ciudadreal.es/' },
  { id: 1,   label: 'Estado de mis expedientes',     icon: 'folder' },
  { id: 7,   label: 'Carpeta Ciudadana',             icon: 'user', externo: true, url: 'https://carpetaciudadana.gob.es/carpeta/clave.htm' },
  { id: 14,  label: 'Procesos selectivos',           icon: 'briefcase' },
  { id: 110, label: 'Instancia General',             icon: 'doc' },
];

const BANNERS = [
  { id: 8, title: 'Portal Tributario',  desc: 'Consulta y paga tus recibos online',          icon: 'creditcard', url: 'https://carpetatributaria.ciudadreal.es/',                color1: '#1e40af', color2: '#1e3a8a' },
  { id: 7, title: 'Carpeta Ciudadana',  desc: 'Accede a tus expedientes y notificaciones',   icon: 'folder',     url: 'https://carpetaciudadana.gob.es/carpeta/clave.htm',          color1: '#334155', color2: '#1e293b' },
  { id: 5, title: 'Perfil del Contratante', desc: 'Licitaciones y contratos municipales',    icon: 'briefcase',  url: 'https://www.ciudadreal.es/ayuntamiento/perfil-contratante.html', color1: '#065f46', color2: '#064e3b' },
];

const MUNICIPAL_LINKS = [
  { id: 1,  title: 'Estado de tus expedientes',       icon: 'folder' },
  { id: 2,  title: 'Tablón de Edictos',                icon: 'doc',        externo: true, url: 'https://etablon.dipucr.es:4443/eTablon/tablon.jsf?entidad=002' },
  { id: 5,  title: 'Perfil del Contratante',           icon: 'briefcase',  externo: true, url: 'https://www.ciudadreal.es/ayuntamiento/perfil-contratante.html' },
  { id: 6,  title: 'Transparencia y Buen Gobierno',    icon: 'building',   externo: true, url: 'https://www.ciudadreal.es/gobierno-abierto/transparencia-y-buen-gobierno.html' },
  { id: 11, title: 'Línea Verde',                      icon: 'leaf',       externo: true, url: 'https://www.lineaverdeciudadreal.com/' },
  { id: 12, title: 'Canal de Denuncias',                icon: 'shield',     externo: true, url: 'https://www.ciudadreal.es/canal-de-denuncias.html' },
  { id: 91, title: 'Verificación de Documentos (CVE)', icon: 'doc',        externo: true, url: 'https://se7.dipucr.es:4443/SIGEM_GestionCSVWeb/action/documento/form?idEntidad=002' },
  { id: 53, title: 'Plataforma ZBE Ciudad Real',        icon: 'car',        externo: true, url: 'https://zbe.ciudadreal.es/landing' },
];

/* ===== TopBar ===== */
const TopBar = ({ onFontSize }) => {
  const hoy = new Date().toLocaleDateString('es-ES', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  const fecha = hoy.charAt(0).toUpperCase() + hoy.slice(1);
  return (
    <div className="sede-topbar">
      <span className="sede-topbar-fecha">{fecha}</span>
      <div className="sede-topbar-right">
        <button onClick={() => onFontSize('up')}   className="sede-topbar-az" aria-label="Aumentar texto">A+</button>
        <button onClick={() => onFontSize('down')} className="sede-topbar-az" aria-label="Reducir texto">A−</button>
        <span className="sede-topbar-sep"/>
        <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook"><Icon name="fb" size={14}/></a>
        <a href="https://twitter.com/" target="_blank" rel="noreferrer" aria-label="Twitter"><Icon name="tw" size={14}/></a>
        <a href="https://youtube.com/" target="_blank" rel="noreferrer" aria-label="YouTube"><Icon name="yt" size={14}/></a>
      </div>
    </div>
  );
};

const Header = () => (
  <header className="sede-header">
    <div className="sede-header-inner">
      <img src={imgLogo} alt="Escudo del Ayuntamiento de Ciudad Real" className="sede-header-logo"/>
      <div className="sede-header-title">
        <strong>Ciudad Real</strong>
        <span>Sede Electrónica</span>
      </div>
    </div>
  </header>
);

const MainNav = ({ onAlertas }) => {
  const [open, setOpen] = useState(false);
  const items = ['Inicio', 'Trámites', 'Noticias', 'Transparencia', 'Sede Electrónica'];
  return (
    <nav className="sede-nav">
      <div className="sede-nav-inner">
        <ul className="sede-nav-links">
          {items.map((it, i) => (
            <li key={it}>
              <a href={i === items.length - 1 ? '#main' : '#'} className={i === items.length - 1 ? 'sede-nav-link sede-nav-link--activo' : 'sede-nav-link'}>
                {it}
              </a>
            </li>
          ))}
        </ul>
        <button onClick={onAlertas} className="sede-nav-alertas">
          <Icon name="bell" size={14}/> Alertas y Suscripciones
        </button>
        <button onClick={() => setOpen(!open)} className="sede-nav-burger" aria-label="Menú">
          <Icon name={open ? 'x' : 'menu'} size={20}/>
        </button>
      </div>
      {open && (
        <div className="sede-nav-mobile">
          {items.map(it => <a key={it} href="#">{it}</a>)}
          <button onClick={onAlertas} className="sede-nav-alertas sede-nav-alertas--mobile">
            <Icon name="bell" size={14}/> Alertas y Suscripciones
          </button>
        </div>
      )}
    </nav>
  );
};

const HeroCarousel = ({ onCta }) => {
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

const QuickShortcuts = ({ abrirTramite }) => (
  <section className="sede-quick">
    <div className="sede-quick-inner">
      <span className="sede-quick-label">Lo más buscado:</span>
      {QUICK_SHORTCUTS.map(s => (
        s.externo ? (
          <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="sede-quick-btn">
            <Icon name={s.icon} size={12}/> {s.label}
          </a>
        ) : (
          <button key={s.id} onClick={() => abrirTramite(s.id)} className="sede-quick-btn">
            <Icon name={s.icon} size={12}/> {s.label}
          </button>
        )
      ))}
    </div>
  </section>
);

const Banners = () => (
  <section className="sede-banners">
    <div className="sede-banners-inner">
      {BANNERS.map(b => (
        <a key={b.id} href={b.url} target="_blank" rel="noreferrer"
           className="sede-banner"
           style={{ background: `linear-gradient(135deg, ${b.color1}, ${b.color2})` }}>
          <div className="sede-banner-icon"><Icon name={b.icon} size={22}/></div>
          <div className="sede-banner-text">
            <strong>{b.title}</strong>
            <span>{b.desc}</span>
          </div>
          <Icon name="arrow" size={16}/>
        </a>
      ))}
    </div>
  </section>
);

const SearchSection = ({ categorias, abrirTramite }) => (
  <section className="sede-search">
    <div className="sede-search-inner">
      <h2>¿Qué trámite necesitas realizar?</h2>
      <p>Busca entre todos los trámites, servicios y documentos municipales disponibles</p>
      <BuscadorPage categorias={categorias} abrirTramite={abrirTramite}/>
    </div>
  </section>
);

const AlertsBanner = ({ onSuscribir, onCerrar }) => (
  <section className="sede-alertas-banner">
    <div className="sede-alertas-inner">
      <div className="sede-alertas-icon"><Icon name="bell" size={22}/></div>
      <div className="sede-alertas-text">
        <strong>Alertas y Suscripciones Municipales</strong>
        <p>Recibe notificaciones sobre subvenciones, empleo público, plenos y novedades que te interesan</p>
      </div>
      <button onClick={onSuscribir} className="sede-alertas-btn"><Icon name="bell" size={13}/> Suscribirse</button>
      <button onClick={onCerrar} className="sede-alertas-close" aria-label="Cerrar"><Icon name="x" size={15}/></button>
    </div>
  </section>
);

const ThematicAreas = ({ categorias, abrirCategoria }) => {
  const areas = categorias.filter(c => c.id <= 9);
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

const MunicipalLinksGrid = ({ abrirTramite }) => (
  <section className="sede-municipal">
    <div className="sede-municipal-inner">
      <h2><span className="sede-municipal-bar"/> Información Municipal</h2>
      <div className="sede-municipal-grid">
        {MUNICIPAL_LINKS.map(l => (
          l.externo ? (
            <a key={l.id} href={l.url} target="_blank" rel="noreferrer" className="sede-municipal-link">
              <Icon name={l.icon} size={16}/>
              <span>{l.title}</span>
            </a>
          ) : (
            <button key={l.id} onClick={() => abrirTramite(l.id)} className="sede-municipal-link">
              <Icon name={l.icon} size={16}/>
              <span>{l.title}</span>
            </button>
          )
        ))}
      </div>
    </div>
  </section>
);

const Footer = ({ navigate, abrirTramite }) => (
  <footer className="sede-footer">
    <div className="sede-skyline-wrap" aria-hidden="true">
      <img src={imgSkyline} alt="" />
    </div>
    <div className="sede-footer-inner">
      <div className="sede-footer-cols">
        <div className="sede-footer-col">
          <h4>Sede Electrónica</h4>
          <ul>
            <li><button onClick={() => abrirTramite(1)}>Estado de tus expedientes</button></li>
            <li><a href="https://carpetaciudadana.gob.es/carpeta/clave.htm" target="_blank" rel="noreferrer">Carpeta Ciudadana</a></li>
            <li><a href="https://se7.dipucr.es:4443/SIGEM_GestionCSVWeb/action/documento/form?idEntidad=002" target="_blank" rel="noreferrer">Verificación de documentos</a></li>
            <li><button onClick={() => abrirTramite(110)}>Instancia general</button></li>
          </ul>
        </div>
        <div className="sede-footer-col">
          <h4>Información</h4>
          <ul>
            <li><a href="https://etablon.dipucr.es:4443/eTablon/tablon.jsf?entidad=002" target="_blank" rel="noreferrer">Tablón de edictos</a></li>
            <li><a href="https://www.ciudadreal.es/ayuntamiento/perfil-contratante.html" target="_blank" rel="noreferrer">Perfil del contratante</a></li>
            <li><a href="https://www.ciudadreal.es/gobierno-abierto/transparencia-y-buen-gobierno.html" target="_blank" rel="noreferrer">Transparencia</a></li>
            <li><a href="https://carpetatributaria.ciudadreal.es/" target="_blank" rel="noreferrer">Portal tributario</a></li>
          </ul>
        </div>
        <div className="sede-footer-col">
          <h4>Servicios</h4>
          <ul>
            <li><button onClick={() => navigate('/subvenciones')}>Subvenciones</button></li>
            <li><button onClick={() => navigate('/plenos')}>Plenos municipales</button></li>
            <li><button onClick={() => navigate('/convenios')}>Convenios</button></li>
            <li><button onClick={() => navigate('/procesos-selectivos')}>Procesos selectivos</button></li>
            <li><button onClick={() => navigate('/expedientes-info-publica')}>Información pública</button></li>
            <li><button onClick={() => navigate('/participacion-normativa')}>Participación normativa</button></li>
          </ul>
        </div>
        <div className="sede-footer-col">
          <h4>Contacto</h4>
          <ul className="sede-footer-contact">
            <li><Icon name="mapPin" size={13}/> Plaza Mayor, 1 · 13001 Ciudad Real</li>
            <li><Icon name="phone" size={13}/> <a href="tel:+34926211044">926 21 10 44</a></li>
            <li><Icon name="mail" size={13}/> <a href="mailto:sede@ciudadreal.es">sede@ciudadreal.es</a></li>
            <li><Icon name="clock" size={13}/> Lunes a Viernes 09:00 – 14:00</li>
          </ul>
          <div className="sede-footer-social">
            <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook"><Icon name="fb" size={14}/></a>
            <a href="https://twitter.com/" target="_blank" rel="noreferrer" aria-label="Twitter"><Icon name="tw" size={14}/></a>
            <a href="https://youtube.com/" target="_blank" rel="noreferrer" aria-label="YouTube"><Icon name="yt" size={14}/></a>
          </div>
        </div>
      </div>
      <div className="sede-footer-bottom">
        <p>© {new Date().getFullYear()} Ayuntamiento de Ciudad Real · Sede Electrónica</p>
        <ul>
          <li><a href="#">Aviso legal</a></li>
          <li><a href="#">Política de privacidad</a></li>
          <li><a href="#">Accesibilidad</a></li>
        </ul>
      </div>
    </div>
  </footer>
);

const HomePage = ({ categorias, alSeleccionarTramite, abrirCategoria }) => {
  const navigate = useNavigate();
  const [noticias, setNoticias] = useState([]);
  const [hideAlertas, setHideAlertas] = useState(false);

  useEffect(() => {
    fetch('/api/noticias?limit=24')
      .then(r => r.json())
      .then(setNoticias)
      .catch(() => setNoticias([]));
  }, []);

  const handleFontSize = (dir) => {
    const b = document.body;
    if (dir === 'up') {
      if (b.classList.contains('font-large')) {
        b.classList.remove('font-large'); b.classList.add('font-xlarge');
      } else if (!b.classList.contains('font-xlarge')) {
        b.classList.add('font-large');
      }
    } else {
      b.classList.remove('font-xlarge', 'font-large');
    }
  };

  const irASuscripcion = () => navigate('/suscripcion');
  const scrollTramites = () => document.getElementById('tramites')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="sede-home">
      <TopBar onFontSize={handleFontSize}/>
      <Header/>
      <MainNav onAlertas={irASuscripcion}/>
      <main id="main">
        <HeroCarousel onCta={scrollTramites}/>
        <QuickShortcuts abrirTramite={alSeleccionarTramite}/>
        <Banners/>
        <SearchSection categorias={categorias} abrirTramite={alSeleccionarTramite}/>
        {!hideAlertas && <AlertsBanner onSuscribir={irASuscripcion} onCerrar={() => setHideAlertas(true)}/>}
        <ThematicAreas categorias={categorias} abrirCategoria={abrirCategoria}/>
        <section id="publicaciones" className="sede-publicaciones">
          <div className="sede-publicaciones-inner">
            <UltimasPublicaciones noticias={noticias}/>
          </div>
        </section>
        <MunicipalLinksGrid abrirTramite={alSeleccionarTramite}/>
      </main>
      <Footer navigate={navigate} abrirTramite={alSeleccionarTramite}/>
    </div>
  );
};

export default HomePage;

