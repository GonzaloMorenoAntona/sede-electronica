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
            "(LOWER(t.titulo) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(t.palabrasClave) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(t.descripcionHtml) LIKE LOWER(CONCAT('%', :keyword, '%'))) " + // <--- ESTO FALTABA
            "AND (:categoriaId IS NULL OR t.categoriaId = :categoriaId) " +
            "AND (:tipo IS NULL OR t.tipo = :tipo) " +
            "ORDER BY CASE " +
            "  WHEN LOWER(t.titulo) LIKE LOWER(CONCAT('%', :keyword, '%')) THEN 1 " +
            "  WHEN LOWER(t.palabrasClave) LIKE LOWER(CONCAT('%', :keyword, '%')) THEN 2 " +
            "  ELSE 3 END ASC, " + // Prioridad: Título > Palabras Clave > Descripción
            "t.fechaPublicacion DESC")
    List<Tramite> searchByKeyword(
            @Param("keyword") String keyword,
            @Param("categoriaId") Long categoriaId,
            @Param("tipo") String tipo
    );
}