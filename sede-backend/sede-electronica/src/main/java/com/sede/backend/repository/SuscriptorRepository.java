package com.sede.backend.repository;

import com.sede.backend.model.Suscriptor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SuscriptorRepository extends JpaRepository<Suscriptor, Long> {
    Optional<Suscriptor> findByEmail(String email);
    Optional<Suscriptor> findByToken(String token);
}
