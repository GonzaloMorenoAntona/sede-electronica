package com.sede.backend.repository;

import com.sede.backend.model.JuntaGobierno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface JuntaGobiernoRepository extends JpaRepository<JuntaGobierno, Long> {
    Optional<JuntaGobierno> findByIdExternoSigem(String idExternoSigem);
}
