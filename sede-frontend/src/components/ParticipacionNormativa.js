import React, { useState } from 'react';
import './ParticipacionNormativa.css';
import IconoPro from './IconoPro';

const parseJSON = (json) => {
  try { return typeof json === 'string' ? JSON.parse(json) : (json || []); }
  catch (e) { return []; }
};

const estaActivo = (fechaFin) => !fechaFin || new Date(fechaFin) >= new Date();

const MetaTag = ({ texto }) => texto ? <span className="pn-tag">{texto}</span> : null;

const ConsultaCard = ({ item }) => {
  const documentos = parseJSON(item.documentos);
  const activo = estaActivo(item.fechaFin);

  return (
    <div className="pn-card">
      <h4 className="pn-titulo">{item.titulo}</h4>
      {!activo && (
        <div className="pn-meta">
          <span className="plazo-cerrado-badge">FINALIZADA</span>
        </div>
      )}
      {(item.fechaInicio || item.fechaFin) && (
        <p className="pn-plazo">
          Plazo: {item.fechaInicio ? new Date(item.fechaInicio).toLocaleDateString('es-ES') : '—'}
          {' → '}
          {item.fechaFin ? new Date(item.fechaFin).toLocaleDateString('es-ES') : '—'}
        </p>
      )}
      {documentos.length > 0 && (
        <div className="pn-docs">
          {documentos.map((d, i) => (
            <a key={i} href={d.url} target="_blank" rel="noreferrer" className="enlace-sede-dinamico">
              <IconoPro nombre="documento" /> {d.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

const InfoPublicaCard = ({ item }) => {
  const documentos = parseJSON(item.documentos);
  const activo = estaActivo(item.fechaFin);

  return (
    <div className="pn-card">
      <h4 className="pn-titulo">{item.titulo}</h4>
      <div className="pn-meta">
        <MetaTag texto={item.naturalezaJuridica} />
        <MetaTag texto={item.ambitoMaterial} />
        <MetaTag texto={item.caracterIniciativa} />
      </div>
      {(item.fechaInicio || item.fechaFin) && (
        <p className="pn-plazo">
          Plazo: {item.fechaInicio ? new Date(item.fechaInicio).toLocaleDateString('es-ES') : '—'}
          {' → '}
          {item.fechaFin ? new Date(item.fechaFin).toLocaleDateString('es-ES') : '—'}
        </p>
      )}
      {documentos.length > 0 && (
        <div className="pn-docs">
          {documentos.map((d, i) => (
            <a key={i} href={d.url} target="_blank" rel="noreferrer" className="enlace-sede-dinamico">
              <IconoPro nombre="documento" /> {d.label}
            </a>
          ))}
        </div>
      )}
      {item.enlaceAlegaciones && (
        <div className="pn-alegaciones">
          {activo ? (
            <a href={item.enlaceAlegaciones} target="_blank" rel="noreferrer" className="pn-btn-alegaciones">
              → PRESENTAR ALEGACIÓN
            </a>
          ) : (
            <span className="plazo-cerrado-badge">PLAZO FINALIZADO</span>
          )}
        </div>
      )}
    </div>
  );
};

const SeccionConsultas = ({ activos, finalizados }) => {
  const [mostrarFinalizados, setMostrarFinalizados] = useState(false);

  return (
    <div>
      {activos.length === 0 ? (
        <p className="pn-vacio">En este momento no hay consultas públicas previas abiertas. Puedes consultar el historial de consultas finalizadas más abajo.</p>
      ) : (
        activos.map(item => <ConsultaCard key={item.id} item={item} />)
      )}

      {finalizados.length > 0 && (
        <div className="pn-finalizados">
          <button className="pn-btn-historial" onClick={() => setMostrarFinalizados(!mostrarFinalizados)}>
            {mostrarFinalizados ? '▲ Ocultar historial' : `▼ Ver ${finalizados.length} consultas finalizadas`}
          </button>
          {mostrarFinalizados && (
            <div className="pn-lista-finalizadas">
              {finalizados.map(item => {
                const documentos = parseJSON(item.documentos);
                const urlPrincipal = documentos.length === 1 ? documentos[0].url : null;
                return (
                  <div key={item.id} className="pn-fila-finalizada">
                    {urlPrincipal ? (
                      <a href={urlPrincipal} target="_blank" rel="noreferrer" className="pn-fila-titulo enlace-sede-dinamico">
                        {item.titulo}
                      </a>
                    ) : (
                      <span className="pn-fila-titulo">{item.titulo}</span>
                    )}
                    {(item.fechaInicio || item.fechaFin) && (
                      <span className="pn-fila-fecha">
                        {item.fechaInicio ? new Date(item.fechaInicio).toLocaleDateString('es-ES') : '—'}
                        {' → '}
                        {item.fechaFin ? new Date(item.fechaFin).toLocaleDateString('es-ES') : '—'}
                      </span>
                    )}
                    {documentos.length > 1 && (
                      <div className="pn-fila-docs">
                        {documentos.map((d, i) => (
                          <a key={i} href={d.url} target="_blank" rel="noreferrer" className="enlace-sede-dinamico">
                            <IconoPro nombre="documento" /> {d.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SeccionInfo = ({ activos, finalizados }) => {
  const [mostrarFinalizados, setMostrarFinalizados] = useState(false);

  return (
    <div>
      {activos.length === 0 ? (
        <p className="pn-vacio">En este momento no hay expedientes en información pública abiertos.</p>
      ) : (
        activos.map(item => <InfoPublicaCard key={item.id} item={item} />)
      )}
      {finalizados.length > 0 && (
        <div className="pn-finalizados">
          <button className="pn-btn-historial" onClick={() => setMostrarFinalizados(!mostrarFinalizados)}>
            {mostrarFinalizados ? '▲ Ocultar historial' : `▼ Ver ${finalizados.length} expedientes finalizados`}
          </button>
          {mostrarFinalizados && finalizados.map(item => <InfoPublicaCard key={item.id} item={item} />)}
        </div>
      )}
    </div>
  );
};

const ParticipacionNormativa = ({ consultas, informacion, volver }) => {
  const [tabActiva, setTabActiva] = useState('consultas');

  const consultasActivas = consultas.filter(c => estaActivo(c.fechaFin));
  const consultasFinalizadas = consultas.filter(c => !estaActivo(c.fechaFin));
  const infoActiva = informacion.filter(i => estaActivo(i.fechaFin));
  const infoFinalizada = informacion.filter(i => !estaActivo(i.fechaFin));

  return (
    <div className="home-content-wrapper">
      <button onClick={volver} className="btn-volver">← VOLVER AL BUSCADOR</button>
      <h1 className="titulo-guia-interno">Participación en Proyectos Normativos</h1>
      <p className="pn-descripcion">
        Este canal permite recabar la opinión de ciudadanos, organizaciones y asociaciones
        en dos momentos del proceso de elaboración de ordenanzas y reglamentos municipales.
      </p>

      <div className="tab-nav">
        <button
          className={`tab-button ${tabActiva === 'consultas' ? 'active' : ''}`}
          onClick={() => setTabActiva('consultas')}
        >
          Consulta Pública Previa
        </button>
        <button
          className={`tab-button ${tabActiva === 'info' ? 'active' : ''}`}
          onClick={() => setTabActiva('info')}
        >
          Información Pública
        </button>
      </div>

      {tabActiva === 'consultas' && (
        <SeccionConsultas activos={consultasActivas} finalizados={consultasFinalizadas} />
      )}

      {tabActiva === 'info' && (
        <SeccionInfo activos={infoActiva} finalizados={infoFinalizada} />
      )}
    </div>
  );
};

export default ParticipacionNormativa;