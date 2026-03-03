import React from 'react';
import './Subvenciones.css';


// Para manejar casos donde los anexos pueden ser un string JSON o un array ya parseado
const parseAnexos = (json) => {
  try { return typeof json === 'string' ? JSON.parse(json) : (json || []); }
  catch (e) { return []; }
};

const SubvencionCard = ({ sub }) => {
  const plazoVencido = new Date(sub.fechaFin) < new Date();

  return (
    <div className="sub-card">
      <div className="sub-card-header">
        <div>
          <small className="sub-card-fecha">
            {plazoVencido ? 'Finalizó el: ' : 'Finaliza el: '}
            {new Date(sub.fechaFin).toLocaleDateString('es-ES')}
          </small>
          <h4 className="sub-card-titulo">{sub.titulo}</h4>
        </div>
        <div className="sub-card-acciones">
          <a href={sub.urlConvocatoria} target="_blank" rel="noreferrer" className="enlace-sede-dinamico">
            BASES
          </a>
          {plazoVencido ? (
            <div className="plazo-cerrado-badge">PLAZO CERRADO</div>
          ) : (
            <a href={sub.urlJustificacion} target="_blank" rel="noreferrer" className="enlace-sede-dinamico">
              → TRAMITAR
            </a>
          )}
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
  );
};
const Subvenciones = ({ datos, anioActivo, setAnioActivo, servicioAbierto, setServicioAbierto, volver }) => {
  const anios     = [...new Set(datos.map(d => Number(d.anio)))].sort((a, b) => b - a);
  const filtrados = datos.filter(d => Number(d.anio) === anioActivo);
  const servicios = [...new Set(filtrados.map(d => d.servicio))];

  const toggleServicio = (servicio) =>
    setServicioAbierto(servicioAbierto === servicio ? null : servicio);

  return (
    <div className="home-content-wrapper">

      <button onClick={volver} className="btn-volver">
        ← VOLVER AL BUSCADOR
      </button>

      <h1 className="titulo-guia-interno">Convocatorias de Subvenciones Municipales</h1>

      <div className="sub-anios">
        {anios.map(anio => (
          <button
            key={anio}
            onClick={() => { setAnioActivo(anio); setServicioAbierto(null); }}
            className={`sub-anio-btn ${anioActivo === anio ? 'sub-anio-btn--activo' : ''}`}
          >
            Año {anio}
          </button>
        ))}
      </div>

      <div className="sub-acordeones">
        {servicios.length > 0 ? servicios.map(servicio => (
          <div key={servicio}>
            <button className="sub-acordeon-header" onClick={() => toggleServicio(servicio)}>
              <span>{servicio.toUpperCase()}</span>
              <span>{servicioAbierto === servicio ? '▲' : '▼'}</span>
            </button>
            {servicioAbierto === servicio && (
              <div className="sub-acordeon-body">
                {filtrados
                  .filter(d => d.servicio === servicio)
                  .map(sub => <SubvencionCard key={sub.id} sub={sub} />)
                }
              </div>
            )}
          </div>
        )) : (
          <p className="sub-vacio">No hay convocatorias registradas para el año {anioActivo}.</p>
        )}
      </div>

    </div>
  );
};

export default Subvenciones;