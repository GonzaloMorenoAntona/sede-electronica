package com.sede.backend.repository;

import com.sede.backend.model.Convenio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ConvenioRepository extends JpaRepository<Convenio, Long> {
    Optional<Convenio> findByIdExternoSigem(String idExternoSigem);
}
