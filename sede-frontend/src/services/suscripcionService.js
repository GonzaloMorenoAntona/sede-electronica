export const registrarSuscriptor = async (email) => {
  try {
    const res = await fetch('/api/suscripciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return await res.json();
  } catch (e) {
    console.error('Error registrando suscriptor:', e);
    return null;
  }
};

export const guardarPreferencias = async (token, tipos) => {
  try {
    const res = await fetch(`/api/suscripciones/preferencias/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipos })
    });
    return res.ok;
  } catch (e) {
    console.error('Error guardando preferencias:', e);
    return false;
  }
};
export const reenviarEnlaceGestion = async (email) => {
  try {
    const res = await fetch('/api/suscripciones/reenviar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return res.ok;
  } catch (e) {
    console.error('Error reenviando enlace:', e);
    return false;
  }
};

export const getPreferencias = async (token) => {
  try {
    const res = await fetch(`/api/suscripciones/preferencias/${token}`);
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    console.error('Error obteniendo preferencias:', e);
    return [];
  }
};