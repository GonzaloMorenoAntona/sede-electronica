package com.sede.backend.repository;

import com.sede.backend.model.Tramite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TramiteRepository extends JpaRepository<Tramite, Long> {
    @Query("SELECT t FROM Tramite t WHERE " +
            "(:keyword IS NULL OR " +
            "LOWER(t.titulo) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(t.palabrasClave) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(t.descripcionHtml) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:#{#categoriaIds == null || #categoriaIds.isEmpty()} = true OR " +
            "t.categoriaId IN :categoriaIds) " +
            "ORDER BY CASE " +
            "  WHEN LOWER(t.titulo) LIKE LOWER(CONCAT('%', :keyword, '%')) THEN 1 " +
            "  WHEN LOWER(t.palabrasClave) LIKE LOWER(CONCAT('%', :keyword, '%')) THEN 2 " +
            "  ELSE 3 END ASC, " +
            "t.fechaPublicacion DESC")
    List<Tramite> buscarConFiltros(
            @Param("keyword") String keyword,
            @Param("categoriaIds") List<Long> categoriaIds
    );
    List<Tramite> findByCategoriaIdOrderByTituloAsc(Long categoriaId);
}
