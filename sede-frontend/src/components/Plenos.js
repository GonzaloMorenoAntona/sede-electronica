import React from 'react';
import './Plenos.css';
import IconoPro from './IconoPro';

const parseJSON = (json) => {
  try { return typeof json === 'string' ? JSON.parse(json) : (json || null); }
  catch (e) { return null; }
};

const PlenoCard = ({ pleno }) => {
  const convocatoria = parseJSON(pleno.convocatoria);
  const acta = parseJSON(pleno.acta);

  return (
    <div className="pleno-card">
      <h3 className="pleno-titulo">{pleno.titulo}</h3>
      <div className="pleno-docs">
        {convocatoria && (
          <a href={convocatoria.url} target="_blank" rel="noreferrer" className="enlace-sede-dinamico">
            <IconoPro nombre="documento" /> {convocatoria.label}
          </a>
        )}
        {acta && (
          <a href={acta.url} target="_blank" rel="noreferrer" className="enlace-sede-dinamico">
            <IconoPro nombre="documento" /> {acta.label}
          </a>
        )}
      </div>
    </div>
  );
};

const Plenos = ({ datos, anioActivo, setAnioActivo, volver }) => {
  const anios = [...new Set(datos.map(d => Number(d.anio)))].sort((a, b) => b - a);
  const filtrados = datos.filter(d => Number(d.anio) === anioActivo);

  return (
    <div className="home-content-wrapper">
      <button onClick={volver} className="btn-volver">← VOLVER AL BUSCADOR</button>
      <h1 className="titulo-guia-interno">Plenos del Ayuntamiento</h1>

      <div className="sub-anios">
        {anios.map(anio => (
          <button
            key={anio}
            onClick={() => setAnioActivo(anio)}
            className={`sub-anio-btn ${anioActivo === anio ? 'sub-anio-btn--activo' : ''}`}
          >
            {anio}
          </button>
        ))}
      </div>

      <div className="plenos-lista">
        {filtrados.length === 0 ? (
          <p className="pleno-vacio">No hay plenos registrados para {anioActivo}.</p>
        ) : (
          filtrados.map(p => <PlenoCard key={p.id} pleno={p} />)
        )}
      </div>
    </div>
  );
};

export default Plenos;