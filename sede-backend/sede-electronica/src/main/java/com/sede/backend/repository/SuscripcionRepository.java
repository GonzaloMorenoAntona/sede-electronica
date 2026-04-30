package com.sede.backend.repository;

import com.sede.backend.model.Suscripcion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SuscripcionRepository extends JpaRepository<Suscripcion, Long> {
    List<Suscripcion> findByTipo(String tipo);
    void deleteBySuscriptorId(Long suscriptorId);
}

