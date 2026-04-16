package com.sede.backend.repository;

import com.sede.backend.model.ExpedienteInfoPublica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ExpedienteInfoPublicaRepository extends JpaRepository<ExpedienteInfoPublica, Long> {
    Optional<ExpedienteInfoPublica> findByIdExternoSigem(String idExternoSigem);
}
