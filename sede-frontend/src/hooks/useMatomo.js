import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const TITULOS_RUTAS = {
  '/':                        'Inicio',
  '/subvenciones':            'Subvenciones',
  '/plenos':                  'Plenos',
  '/juntas-gobierno':         'Junta de Gobierno Local',
  '/convenios':               'Convenios',
  '/procesos-selectivos':     'Procesos Selectivos',
  '/expedientes-info-publica':'Expedientes de Información Pública',
  '/participacion-normativa': 'Participación Normativa',
  '/consultar':               'Consultar',
  '/suscripcion':             'Suscripciones',
  '/buscar':                  'Buscador',
};

const useMatomo = () => {
  const location = useLocation();

  useEffect(() => {
    // No registrar en desarrollo
    //if (window.location.hostname === 'localhost') return;

    const titulo = TITULOS_RUTAS[location.pathname] || location.pathname;

    if (window._paq) {
      window._paq.push(['setCustomUrl', window.location.href]);
      window._paq.push(['setDocumentTitle', `Sede Electrónica - ${titulo}`]);
      window._paq.push(['trackPageView']);
    }
  }, [location]);
};

export default useMatomo;