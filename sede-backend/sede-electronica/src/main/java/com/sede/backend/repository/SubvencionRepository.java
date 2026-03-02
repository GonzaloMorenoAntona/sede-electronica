package com.sede.backend.repository;


import com.sede.backend.model.Subvencion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubvencionRepository extends JpaRepository<Subvencion, Long> {
    // Para el upsert — busca por id externo de SIGEM
    Optional<Subvencion> findByIdExternoSigem(String idExternoSigem);

    // Para filtrar por año desde el frontend si lo necesitas en el futuro
    List<Subvencion> findByAnioOrderByFechaInicioDesc(Integer anio);
}