package com.sede.backend.repository;

import com.sede.backend.model.ProcesoSelectivo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ProcesoSelectivoRepository extends JpaRepository<ProcesoSelectivo, Long> {
    Optional<ProcesoSelectivo> findByIdExternoSigem(String idExternoSigem);
}