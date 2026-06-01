import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/HomePage.css';
import './Layout.css';


console.log('Layout renderizado');

/* ===== Iconos SVG ===== */
const SVG_PATHS = {
  bell:     <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>,
  x:        <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
  menu:     <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>,
  fb:       <><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></>,
  tw:       <><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></>,
  yt:       <><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></>,
  mapPin:   <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
  phone:    <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></>,
  mail:     <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
  clock:    <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
};
const Icon = ({ name, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {SVG_PATHS[name]}
  </svg>
);

/* ===== TopBar ===== */
const TopBar = ({ onFontSize }) => {
  const hoy = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const fecha = hoy.charAt(0).toUpperCase() + hoy.slice(1);
  return (
    <div className="sede-topbar">
      <span className="sede-topbar-fecha">{fecha}</span>
      <div className="sede-topbar-right">
        <button onClick={() => onFontSize('up')}   className="sede-topbar-az" aria-label="Aumentar texto">A+</button>
        <button onClick={() => onFontSize('down')} className="sede-topbar-az" aria-label="Reducir texto">A−</button>
        <span className="sede-topbar-sep"/>
        <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook"><Icon name="fb" size={14}/></a>
        <a href="https://twitter.com/"      target="_blank" rel="noreferrer" aria-label="Twitter"><Icon name="tw" size={14}/></a>
        <a href="https://youtube.com/"      target="_blank" rel="noreferrer" aria-label="YouTube"><Icon name="yt" size={14}/></a>
      </div>
    </div>
  );
};

/* ===== Header ===== */
const Header = () => (
  <header className="sede-header">
    <div className="sede-header-inner">
      <img src="/assets/logo-ayuntamiento.jpg" alt="Escudo del Ayuntamiento de Ciudad Real" className="sede-header-logo"/>
      <div className="sede-header-title">
        <strong>Ciudad Real</strong>
        <span>Sede Electrónica</span>
      </div>
    </div>
  </header>
);

/* ===== MainNav ===== */
const WEB_MUNICIPAL = 'https://www.ciudadreal.es';

const MainNav = ({ onAlertas }) => {
  const [open, setOpen] = useState(false);
  const items = [
    { label: 'Web Municipal',   href: WEB_MUNICIPAL, externo: true },
    { label: 'Sede Electrónica', href: '#main',      activo: true },
  ];
  return (
    <nav className="sede-nav">
      <div className="sede-nav-inner">
        <ul className="sede-nav-links">
          {items.map(it => (
            <li key={it.label}>
              <a href={it.href}
                 {...(it.externo ? { target: '_blank', rel: 'noreferrer' } : {})}
                 className={it.activo ? 'sede-nav-link sede-nav-link--activo' : 'sede-nav-link'}>
                {it.label}
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
          <button onClick={onAlertas} className="sede-nav-alertas sede-nav-alertas--mobile">
            <Icon name="bell" size={14}/> Alertas y Suscripciones
          </button>
          {items.map(it => (
            <a key={it.label} href={it.href}
               {...(it.externo ? { target: '_blank', rel: 'noreferrer' } : {})}>
              {it.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

/* ===== Footer Dinámico ===== */
const Footer = ({ navigate, abrirTramite }) => {
  // Estado para guardar las URLs de la base de datos
  const [urls, setUrls] = useState({
    tablon: '#', perfil: '#', transparencia: '#', carpeta: '#', tributario: '#', cve: '#'
  });

  useEffect(() => {
    // Hacemos las llamadas silenciosas a los IDs correspondientes
    Promise.all([
      fetch('/api/tramites/2').then(r => r.json()).catch(() => null),   // Tablón
      fetch('/api/tramites/5').then(r => r.json()).catch(() => null),   // Perfil Contratante
      fetch('/api/tramites/6').then(r => r.json()).catch(() => null),   // Transparencia
      fetch('/api/tramites/7').then(r => r.json()).catch(() => null),   // Carpeta Ciudadana
      fetch('/api/tramites/8').then(r => r.json()).catch(() => null),   // Tributario
      fetch('/api/tramites/91').then(r => r.json()).catch(() => null),  // CVE
    ]).then(([r2, r5, r6, r7, r8, r91]) => {
      // Función defensiva para extraer la URL venga en Array o en Objeto
      const extraerUrl = (res) => {
        const data = Array.isArray(res) ? res[0] : res;
        return data?.urlExterna || data?.url || '#';
      };

      setUrls({
        tablon: extraerUrl(r2),
        perfil: extraerUrl(r5),
        transparencia: extraerUrl(r6),
        carpeta: extraerUrl(r7),
        tributario: extraerUrl(r8),
        cve: extraerUrl(r91),
      });
    });
  }, []);

  // Función para bloquear clics si la URL aún no ha cargado ('#')
  const manejarClickExterno = (url, e) => {
    if (!url || url === '#') e.preventDefault();
  };

  return (
    <footer className="sede-footer">
      <div className="sede-skyline-wrap" aria-hidden="true">
        <img src="/assets/skyline-footer.png" alt="Línea de horizonte de Ciudad Real"/>
      </div>
      <div className="sede-footer-inner">
        <div className="sede-footer-cols">
          <div className="sede-footer-col">
            <h4>Sede Electrónica</h4>
            <ul>
              <li><button onClick={() => abrirTramite(1)}>Estado de tus expedientes</button></li>
              <li><a href={urls.carpeta} target="_blank" rel="noreferrer" onClick={(e) => manejarClickExterno(urls.carpeta, e)}>Carpeta Ciudadana</a></li>
              <li><a href={urls.cve} target="_blank" rel="noreferrer" onClick={(e) => manejarClickExterno(urls.cve, e)}>Verificación de documentos</a></li>
              <li><button onClick={() => abrirTramite(110)}>Instancia general</button></li>
            </ul>
          </div>
          <div className="sede-footer-col">
            <h4>Información</h4>
            <ul>
              <li><a href={urls.tablon} target="_blank" rel="noreferrer" onClick={(e) => manejarClickExterno(urls.tablon, e)}>Tablón de edictos</a></li>
              <li><a href={urls.perfil} target="_blank" rel="noreferrer" onClick={(e) => manejarClickExterno(urls.perfil, e)}>Perfil del contratante</a></li>
              <li><a href={urls.transparencia} target="_blank" rel="noreferrer" onClick={(e) => manejarClickExterno(urls.transparencia, e)}>Transparencia</a></li>
              <li><a href={urls.tributario} target="_blank" rel="noreferrer" onClick={(e) => manejarClickExterno(urls.tributario, e)}>Portal tributario</a></li>
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
              <li><button onClick={() => navigate('/juntas-gobierno')}>Juntas de gobierno</button></li>
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
              <a href="https://twitter.com/"      target="_blank" rel="noreferrer" aria-label="Twitter"><Icon name="tw" size={14}/></a>
              <a href="https://youtube.com/"      target="_blank" rel="noreferrer" aria-label="YouTube"><Icon name="yt" size={14}/></a>
            </div>
          </div>
        </div>
        <div className="sede-footer-bottom">
          <p>© {new Date().getFullYear()} Ayuntamiento de Ciudad Real · Sede Electrónica</p>
          <ul>
            <li><a href="https://www.ciudadreal.es/aviso-legal">Política de privacidad y Aviso legal</a></li>
            <li><a href="https://www.ciudadreal.es/servicios-municipales/urbanismo/accesibilidad/declaraci%C3%B3n-de-accesibilidad-web.html">Declaración de accesibilidad web</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

/* ===== Layout (Ahora recibe abrirTramite por props) ===== */
const Layout = ({ children, abrirTramite }) => {
  const navigate = useNavigate();

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

  return (
    <div className="sede-home">
      <TopBar onFontSize={handleFontSize}/>
      <Header/>
      <MainNav onAlertas={() => navigate('/suscripcion')}/>
      <main id="main">
        {children}
      </main>
      <Footer navigate={navigate} abrirTramite={abrirTramite}/>
    </div>
  );
};

export default Layout;