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