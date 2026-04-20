package com.sede.backend.repository;

import com.sede.backend.model.InformacionPublica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface InformacionPublicaRepository extends JpaRepository<InformacionPublica, Long> {
    Optional<InformacionPublica> findByIdExternoSigem(String idExternoSigem);
}