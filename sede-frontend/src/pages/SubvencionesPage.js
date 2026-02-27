import React, { useState, useEffect } from 'react';
import SubvencionesTable from '../components/SubvencionesTable';

const SubvencionesPage = ({ volver }) => {
  const [datos, setDatos] = useState([]);
  const [anioActivo, setAnioActivo] = useState(2026);
  const [servicioAbierto, setServicioAbierto] = useState(null);

  useEffect(() => {
    fetch('/api/subvenciones')
      .then(res => res.json())
      .then(data => setDatos(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error:", err));
  }, []);

  const filtrados = datos.filter(d => Number(d.anio) === anioActivo);
  const servicios = [...new Set(filtrados.map(d => d.servicio))];

  return (
    <div className="home-content-wrapper">
        <button onClick={volver} className="enlace-sede-dinamico" style={{border:'none', background:'none', cursor:'pointer', marginBottom:'20px', display:'block'}}>
            ← VOLVER AL BUSCADOR
        </button>

      <h1 className="titulo-guia-interno">Convocatorias de Subvenciones Municipales</h1>

      {/* TABS DE AÑOS - Usando colores del sistema */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', justifyContent: 'center' }}>
        {[2026, 2025, 2024, 2023].map(anio => (
          <button 
            key={anio}
            onClick={() => { setAnioActivo(anio); setServicioAbierto(null); }}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              backgroundColor: anioActivo === anio ? 'var(--primary-color)' : 'white',
              color: anioActivo === anio ? 'white' : 'var(--primary-color)',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Año {anio}
          </button>
        ))}
      </div>

      {/* ACORDEONES POR SERVICIO */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {servicios.length > 0 ? servicios.map(servicio => (
          <div key={servicio}>
            {/* Usamos buscador-card para el disparador del acordeón */}
            <div 
              className="buscador-card" 
              onClick={() => setServicioAbierto(servicioAbierto === servicio ? null : servicio)}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span style={{ fontWeight: '700', fontSize: '1.1rem', color: '#2d3748' }}>
                {servicio.toUpperCase()}
              </span>
              <span>{servicioAbierto === servicio ? '▲' : '▼'}</span>
            </div>

            {servicioAbierto === servicio && (
              <div style={{ padding: '20px 0' }}>
                <SubvencionesTable datos={filtrados.filter(d => d.servicio === servicio)} />
              </div>
            )}
          </div>
        )) : (
          <p style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
            No hay convocatorias registradas para el año {anioActivo}.
          </p>
        )}
      </div>
    </div>
  );
};

export default SubvencionesPage;