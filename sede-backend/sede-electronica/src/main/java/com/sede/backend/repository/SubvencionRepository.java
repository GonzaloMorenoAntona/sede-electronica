package com.sede.backend.repository;


import com.sede.backend.model.Subvencion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubvencionRepository extends JpaRepository<Subvencion, Long> {
    Optional<Subvencion> findByIdExternoSigem(String idExternoSigem);

    // Para filtrar por año
    List<Subvencion> findByAnioOrderByFechaInicioDesc(Integer anio);
}  