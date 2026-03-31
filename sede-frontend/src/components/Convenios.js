import React from 'react';
import './Convenios.css';

const ConvenioCard = ({ convenio }) => {
  const vigenciaFin = convenio.plazoVigenciaFin ? new Date(convenio.plazoVigenciaFin) : null;
  const vigente = vigenciaFin ? vigenciaFin >= new Date() : true;

  return (
    <div className="convenio-card">
      <h4 className="convenio-titulo">{convenio.titulo}</h4>
      <div className="convenio-meta">
        {convenio.clase && <span className="convenio-tag">{convenio.clase}</span>}
        {convenio.detalle && <span className="convenio-tag">{convenio.detalle}</span>}
        {!vigente && <span className="plazo-cerrado-badge">EXPIRADO</span>}
      </div>
      {convenio.entidadesFirmantes && (
        <p className="convenio-firmantes">
          <strong>Entidades firmantes:</strong> {convenio.entidadesFirmantes}
        </p>
      )}
      {(convenio.plazoVigenciaInicio || convenio.plazoVigenciaFin) && (
        <p className="convenio-vigencia">
          <strong>Vigencia:</strong>{' '}
          {convenio.plazoVigenciaInicio
            ? new Date(convenio.plazoVigenciaInicio).toLocaleDateString('es-ES')
            : '—'}
          {' → '}
          {convenio.plazoVigenciaFin
            ? new Date(convenio.plazoVigenciaFin).toLocaleDateString('es-ES')
            : '—'}
        </p>
      )}
    </div>
  );
};

const Convenios = ({ datos, materiaAbierta, setMateriaAbierta, anioActivo, setAnioActivo, volver }) => {
  const materias = [...new Set(datos.map(d => d.materia))].sort();

  const toggleMateria = (materia) => {
    if (materiaAbierta === materia) {
      setMateriaAbierta(null);
    } else {
      setMateriaAbierta(materia);
      const conveniosDe = datos.filter(d => d.materia === materia);
      const maxAnio = Math.max(...conveniosDe.map(d =>
        new Date(d.plazoVigenciaInicio || d.plazoVigenciaFin).getFullYear()
      ));
      setAnioActivo(prev => ({ ...prev, [materia]: maxAnio }));
    }
  };

  const setAnioDeMateria = (materia, anio) => {
    setAnioActivo(prev => ({ ...prev, [materia]: anio }));
  };

  return (
    <div className="home-content-wrapper">
      <button onClick={volver} className="btn-volver">← VOLVER AL BUSCADOR</button>
      <h1 className="titulo-guia-interno">Convenios Municipales</h1>

      <div className="sub-acordeones">
        {materias.map(materia => {
          const conveniosDe = datos.filter(d => d.materia === materia);
          const anios = [...new Set(conveniosDe.map(d =>
            new Date(d.plazoVigenciaInicio || d.plazoVigenciaFin).getFullYear()
          ))].sort((a, b) => b - a);
          const anio = anioActivo[materia] || anios[0];
          const filtrados = conveniosDe.filter(d =>
            new Date(d.plazoVigenciaInicio || d.plazoVigenciaFin).getFullYear() === anio
          );

          return (
            <div key={materia}>
              <button className="sub-acordeon-header" onClick={() => toggleMateria(materia)}>
                <span>{materia.toUpperCase()}</span>
                <span>{materiaAbierta === materia ? '▲' : '▼'}</span>
              </button>
              {materiaAbierta === materia && (
                <div className="sub-acordeon-body">
                  <div className="sub-anios">
                    {anios.map(a => (
                      <button
                        key={a}
                        onClick={() => setAnioDeMateria(materia, a)}
                        className={`sub-anio-btn ${anio === a ? 'sub-anio-btn--activo' : ''}`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                  {filtrados.map(c => <ConvenioCard key={c.id} convenio={c} />)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Convenios;