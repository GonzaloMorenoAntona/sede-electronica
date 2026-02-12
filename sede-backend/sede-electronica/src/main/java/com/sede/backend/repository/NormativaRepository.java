package com.sede.backend.repository;

import com.sede.backend.model.Normativa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NormativaRepository extends JpaRepository<Normativa, Long> {
    List<Normativa> findByTramiteId(Long tramiteId);
}
