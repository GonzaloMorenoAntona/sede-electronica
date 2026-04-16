import React from 'react';
import './ExpedientesInfoPublica.css';
import IconoPro from './IconoPro';

const parseJSON = (json) => {
  try { return typeof json === 'string' ? JSON.parse(json) : (json || []); }
  catch (e) { return []; }
};

const ExpedienteCard = ({ expediente }) => {
  const documentos = parseJSON(expediente.documentos);
  const plazoActivo = expediente.fechaFinAlegaciones
    ? new Date(expediente.fechaFinAlegaciones) >= new Date()
    : false;

  return (
    <div className="expediente-card">
      <div className="expediente-header">
        <h3 className="expediente-titulo">{expediente.titulo}</h3>
        <div className="expediente-meta">
          {expediente.concejalia && (
            <span className="expediente-concejalia">{expediente.concejalia}</span>
          )}
          <span className="expediente-fecha">
            Publicado: {new Date(expediente.fechaSincronizacion).toLocaleDateString('es-ES')}
          </span>
        </div>
      </div>

      {documentos.length > 0 && (
        <div className="expediente-docs">
          {documentos.map((d, i) => (
            <a key={i} href={d.url} target="_blank" rel="noreferrer" className="enlace-sede-dinamico">
              <IconoPro nombre="documento" /> {d.label}
            </a>
          ))}
        </div>
      )}

      {expediente.enlaceAlegaciones && (
        <div className="expediente-alegaciones">
          {plazoActivo ? (
            <>
              <div className="expediente-plazo">
                Plazo de alegaciones: {new Date(expediente.fechaInicioAlegaciones).toLocaleDateString('es-ES')} → {new Date(expediente.fechaFinAlegaciones).toLocaleDateString('es-ES')}
              </div>
              <a href={expediente.enlaceAlegaciones} target="_blank" rel="noreferrer" className="enlace-sede-dinamico">
                → PRESENTAR ALEGACIONES
              </a>
            </>
          ) : (
            <span className="plazo-cerrado-badge">PLAZO DE ALEGACIONES CERRADO</span>
          )}
        </div>
      )}
    </div>
  );
};

const ExpedientesInfoPublica = ({ datos, volver }) => {
  const activos = datos.filter(e =>
    !e.fechaFinAlegaciones || new Date(e.fechaFinAlegaciones) >= new Date()
  );
  const cerrados = datos.filter(e =>
    e.fechaFinAlegaciones && new Date(e.fechaFinAlegaciones) < new Date()
  );

  return (
    <div className="home-content-wrapper">
      <button onClick={volver} className="btn-volver">← VOLVER AL BUSCADOR</button>
      <h1 className="titulo-guia-interno">Expedientes sometidos a Información Pública</h1>

      {activos.length > 0 && (
        <>
          <h2 className="expediente-seccion-titulo">En plazo de alegaciones</h2>
          {activos.map(e => <ExpedienteCard key={e.id} expediente={e} />)}
        </>
      )}

      {cerrados.length > 0 && (
        <>
          <h2 className="expediente-seccion-titulo">Cerrados</h2>
          {cerrados.map(e => <ExpedienteCard key={e.id} expediente={e} />)}
        </>
      )}

      {datos.length === 0 && (
        <p className="expediente-vacio">No hay expedientes registrados actualmente.</p>
      )}
    </div>
  );
};

export default ExpedientesInfoPublica;