import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useMatomo = () => {
  const location = useLocation();

  useEffect(() => {
    if (window._paq) {
      window._paq.push(['setCustomUrl', window.location.href]);
      window._paq.push(['setDocumentTitle', document.title]);
      window._paq.push(['trackPageView']);
    }
  }, [location]);
};

export default useMatomo;