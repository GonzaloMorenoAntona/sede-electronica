import React from 'react';
import './ProcesosSelectivos.css';
import IconoPro from './IconoPro';

const parseJSON = (json) => {
  try { return typeof json === 'string' ? JSON.parse(json) : (json || []); }
  catch (e) { return []; }
};

const ProcesoCard = ({ proceso }) => {
  const enlace = parseJSON(proceso.enlaceActivo);
  const bases = parseJSON(proceso.bases);
  const documentos = parseJSON(proceso.documentos);

  const plazoActivo = enlace?.fecha_fin_plazo
    ? new Date(enlace.fecha_fin_plazo) >= new Date()
    : false;

  return (
    <div className="proceso-card">
      <h3 className="proceso-titulo">{proceso.titulo}</h3>

      {bases.length > 0 && (
        <div className="proceso-seccion">
          <div className="proceso-seccion-label">Bases y convocatoria</div>
          <div className="proceso-seccion-links">
            {bases.map((b, i) => (
              <a key={i} href={b.url} target="_blank" rel="noreferrer" className="enlace-sede-dinamico">
                <IconoPro nombre="documento" /> {b.label}
              </a>
            ))}
          </div>
        </div>
      )}

      {documentos.length > 0 && (
        <div className="proceso-seccion">
          <div className="proceso-seccion-label">Documentación del proceso</div>
          <div className="proceso-seccion-links">
            {documentos.map((d, i) => (
              <a key={i} href={d.url} target="_blank" rel="noreferrer" className="enlace-sede-dinamico">
                <IconoPro nombre="documento" /> {d.label}
              </a>
            ))}
          </div>
        </div>
      )}

      {enlace?.label && (
        <div className="proceso-enlace-activo">
          {plazoActivo ? (
            <a href={enlace.url} target="_blank" rel="noreferrer" className="enlace-sede-dinamico">
              → {enlace.label}
            </a>
          ) : (
            <span className="plazo-cerrado-badge">{enlace.label} — PLAZO CERRADO</span>
          )}
          {enlace.fecha_inicio_plazo && enlace.fecha_fin_plazo && (
            <small className="proceso-plazo-fechas">
              Plazo del {new Date(enlace.fecha_inicio_plazo).toLocaleDateString('es-ES')} al {new Date(enlace.fecha_fin_plazo).toLocaleDateString('es-ES')}
            </small>
          )}
        </div>
      )}
    </div>
  );
};

const ProcesosSelectivos = ({ datos, volver }) => {
  return (
    <div className="home-content-wrapper">
      <button onClick={volver} className="btn-volver">← VOLVER</button>
      <h1 className="titulo-guia-interno">Procesos Selectivos</h1>
      {datos.length === 0 ? (
        <p className="proceso-vacio">No hay procesos selectivos registrados actualmente.</p>
      ) : (
        datos.map(p => <ProcesoCard key={p.id} proceso={p} />)
      )}
    </div>
  );
};

export default ProcesosSelectivos;