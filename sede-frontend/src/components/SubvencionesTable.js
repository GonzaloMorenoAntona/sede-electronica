import React from 'react';
import './Subvenciones.css';

const parseAnexos = (json) => {
  try { return typeof json === 'string' ? JSON.parse(json) : (json || []); }
  catch (e) { return []; }
};

const SubvencionesTable = ({ datos }) => (
  <div className="sub-acordeon-body">
    {datos.map((sub) => (
      <div key={sub.id} className="sub-card">

        <div className="sub-card-header">
          <div>
            <small className="sub-card-fecha">
              Finaliza el: {new Date(sub.fechaFin).toLocaleDateString('es-ES')}
            </small>
            <h4 className="sub-card-titulo">{sub.titulo}</h4>
          </div>
          <div className="sub-card-acciones">
            <a href={sub.urlConvocatoria} target="_blank" rel="noreferrer" className="enlace-sede-dinamico">
              BASES
            </a>
            <a href={sub.urlJustificacion} target="_blank" rel="noreferrer" className="enlace-sede-dinamico">
              → TRAMITAR
            </a>
          </div>
        </div>

        <div className="sub-card-anexos">
          <span className="sub-card-anexos-label">ANEXOS:</span>
          {parseAnexos(sub.anexos).map((anexo, i) => (
            <a key={i} href={anexo.url} target="_blank" rel="noreferrer" className="enlace-sede-dinamico">
              {anexo.label}
            </a>
          ))}
        </div>

      </div>
    ))}
  </div>
);

export default SubvencionesTable;