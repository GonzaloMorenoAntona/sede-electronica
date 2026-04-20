package com.sede.backend.repository;

import com.sede.backend.model.ConsultaPublica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ConsultaPublicaRepository extends JpaRepository<ConsultaPublica, Long> {
    Optional<ConsultaPublica> findByIdExternoSigem(String idExternoSigem);
}
