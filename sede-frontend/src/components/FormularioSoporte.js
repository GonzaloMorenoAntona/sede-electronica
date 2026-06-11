import React, { useState, useEffect, useRef } from 'react';
import './FormularioSoporte.css';
console.log('FormularioSoporte renderizado');
const SITE_KEY = '10000000-ffff-ffff-ffff-000000000001'; // ← sustituir por la Site Key de hCaptcha

const FormularioSoporte = ({ onCerrar }) => {
  const [form, setForm]         = useState({ nombre: '', telefono: '', email: '', consulta: '' });
  const [archivo, setArchivo]   = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const captchaRef = useRef(null);
  const widgetRef  = useRef(null);

  useEffect(() => {
    if (window.hcaptcha && captchaRef.current && widgetRef.current === null) {
      widgetRef.current = window.hcaptcha.render(captchaRef.current, { sitekey: SITE_KEY });
    }
  }, []);

  const cambiar = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const enviar = async (e) => {
    e.preventDefault();
    const token = window.hcaptcha?.getResponse(widgetRef.current);
    if (!token) { alert('Por favor completa el captcha.'); return; }

    setEnviando(true);
    try {
      const fd = new FormData();
      fd.append('nombre',       form.nombre);
      fd.append('telefono',     form.telefono);
      fd.append('email',        form.email);
      fd.append('consulta',     form.consulta);
      fd.append('captchaToken', token);
      if (archivo) fd.append('archivo', archivo);

      const res = await fetch('/api/soporte', { method: 'POST', body: fd });
      setResultado(res.ok ? 'ok' : 'error');
    } catch {
      setResultado('error');
    } finally {
      setEnviando(false);
      window.hcaptcha?.reset(widgetRef.current);
    }
  };

  if (resultado === 'ok') return (
    <div className="sop-resultado sop-resultado--ok">
      <span>✓</span>
      <p>Tu mensaje ha sido enviado correctamente. El equipo de soporte se pondrá en contacto contigo.</p>
      <button onClick={onCerrar}>Cerrar</button>
    </div>
  );

  if (resultado === 'error') return (
    <div className="sop-resultado sop-resultado--error">
      <span>✕</span>
      <p>Ha ocurrido un error al enviar el mensaje. Inténtalo de nuevo o escríbenos a <a href="mailto:soporte@ciudadreal.es">soporte@ciudadreal.es</a>.</p>
      <button onClick={() => setResultado(null)}>Reintentar</button>
    </div>
  );

  return (
    <form className="sop-form" onSubmit={enviar} noValidate>
      <div className="sop-form-grid">
        <div className="sop-field">
          <label htmlFor="sop-nombre">Nombre *</label>
          <input id="sop-nombre" name="nombre" type="text" required
            value={form.nombre} onChange={cambiar} placeholder="Tu nombre completo"/>
        </div>
        <div className="sop-field">
          <label htmlFor="sop-telefono">Teléfono / Extensión</label>
          <input id="sop-telefono" name="telefono" type="tel"
            value={form.telefono} onChange={cambiar} placeholder="Ej: 926 21 10 44"/>
        </div>
        <div className="sop-field sop-field--full">
          <label htmlFor="sop-email">Email *</label>
          <input id="sop-email" name="email" type="email" required
            value={form.email} onChange={cambiar} placeholder="tu@email.es"/>
        </div>
        <div className="sop-field sop-field--full">
          <label htmlFor="sop-consulta">Consulta, incidencia o petición *</label>
          <textarea id="sop-consulta" name="consulta" required rows={4}
            value={form.consulta} onChange={cambiar}
            placeholder="Describe detalladamente el problema o consulta, indicando el navegador y la URL donde ocurre si es relevante."/>
        </div>
        <div className="sop-field sop-field--full">
          <label htmlFor="sop-archivo">Adjuntar archivo <span className="sop-hint">(zip, pdf, doc, odt, jpg, png — opcional)</span></label>
          <div className="sop-archivo-wrap">
            <input id="sop-archivo" name="archivo" type="file"
              accept=".zip,.pdf,.doc,.docx,.odt,.jpg,.jpeg,.png"
              onChange={e => setArchivo(e.target.files[0] || null)}/>
            {archivo && (
              <button type="button" className="sop-archivo-quitar"
                onClick={() => { setArchivo(null); document.getElementById('sop-archivo').value = ''; }}>
                ✕ {archivo.name}
              </button>
            )}
          </div>
        </div>
        <div className="sop-field sop-field--full">
          <div ref={captchaRef}/>
        </div>
      </div>
      <div className="sop-acciones">
        <button type="button" className="sop-btn-cancelar" onClick={onCerrar}>Cancelar</button>
        <button type="submit" className="sop-btn-enviar" disabled={enviando}>
          {enviando ? 'Enviando...' : 'Enviar mensaje'}
        </button>
      </div>
    </form>
  );
};

export default FormularioSoporte;

