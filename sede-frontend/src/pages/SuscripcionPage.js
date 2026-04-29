import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registrarSuscriptor, reenviarEnlaceGestion } from '../services/suscripcionService';
import '../components/Suscripcion.css';

const SuscripcionPage = ({ volver }) => {
  const [email, setEmail] = useState('');
  const [estado, setEstado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [emailGestion, setEmailGestion] = useState('');
  const [estadoGestion, setEstadoGestion] = useState(null);
  const [cargandoGestion, setCargandoGestion] = useState(false);
  const [mostrarGestion, setMostrarGestion] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) { setEstado('EMAIL_INVALIDO'); return; }
    setCargando(true);
    const res = await registrarSuscriptor(email);
    setCargando(false);
    if (!res) { setEstado('ERROR'); return; }
    if (res.resultado.startsWith('YA_VERIFICADO:')) {
      const token = res.resultado.split(':')[1];
      navigate(`/suscripcion-confirmada?token=${token}`);
      return;
    }
    setEstado(res.resultado);
  };

  const handleGestion = async () => {
    if (!emailGestion || !emailGestion.includes('@')) { setEstadoGestion('EMAIL_INVALIDO'); return; }
    setCargandoGestion(true);
    const ok = await reenviarEnlaceGestion(emailGestion);
    setCargandoGestion(false);
    setEstadoGestion(ok ? 'OK' : 'NO_ENCONTRADO');
  };

  return (
    <div className="home-content-wrapper">
      <button onClick={volver} className="btn-volver">← VOLVER AL BUSCADOR</button>
      <div className="susc-container">
        <h1 className="titulo-guia-interno">Alertas y suscripciones</h1>
        <p className="susc-desc">
          Recibe notificaciones por email cuando se publiquen nuevas subvenciones,
          procesos selectivos, plenos, convenios y más.
        </p>

        {!estado && (
          <div className="susc-form">
            <input
              type="email"
              className="susc-input"
              placeholder="Tu correo electrónico"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
            <button className="susc-btn" onClick={handleSubmit} disabled={cargando}>
              {cargando ? 'Enviando...' : 'Suscribirme'}
            </button>
          </div>
        )}

        {estado === 'OK' && (
          <div className="susc-mensaje susc-ok">
            ✓ Te hemos enviado un email a <strong>{email}</strong>. Pulsa el enlace para confirmar tu suscripción.
          </div>
        )}
        {estado === 'EMAIL_REENVIADO' && (
          <div className="susc-mensaje susc-ok">
            ✓ Ya teníamos tu email registrado. Te hemos reenviado el mensaje de confirmación.
          </div>
        )}
        {(estado === 'ERROR' || estado === 'EMAIL_INVALIDO') && (
          <div className="susc-mensaje susc-error">
            ✗ Comprueba que el email es correcto e inténtalo de nuevo.
          </div>
        )}

        <div className="susc-separador" />

        <button className="susc-gestion-toggle" onClick={() => setMostrarGestion(!mostrarGestion)}>
          ¿Ya estás suscrito? Gestiona tus preferencias
        </button>

        {mostrarGestion && (
          <div className="susc-gestion">
            <p className="susc-desc">Introduce tu email y te enviaremos un enlace para modificar tus preferencias.</p>
            <div className="susc-form">
              <input
                type="email"
                className="susc-input"
                placeholder="Tu correo electrónico"
                value={emailGestion}
                onChange={e => setEmailGestion(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleGestion()}
              />
              <button className="susc-btn" onClick={handleGestion} disabled={cargandoGestion}>
                {cargandoGestion ? 'Enviando...' : 'Enviar enlace'}
              </button>
            </div>
            {estadoGestion === 'OK' && (
              <div className="susc-mensaje susc-ok">
                ✓ Te hemos enviado el enlace a <strong>{emailGestion}</strong>.
              </div>
            )}
            {estadoGestion === 'NO_ENCONTRADO' && (
              <div className="susc-mensaje susc-error">
                ✗ No encontramos ninguna suscripción con ese email.
              </div>
            )}
            {estadoGestion === 'EMAIL_INVALIDO' && (
              <div className="susc-mensaje susc-error">
                ✗ Comprueba que el email es correcto.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuscripcionPage;