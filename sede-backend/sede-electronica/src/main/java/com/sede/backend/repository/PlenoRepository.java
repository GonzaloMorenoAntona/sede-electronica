package com.sede.backend.repository;

import com.sede.backend.model.Pleno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PlenoRepository extends JpaRepository<Pleno, Long> {
    Optional<Pleno> findByIdExternoSigem(String idExternoSigem);
}
