package com.sede.backend.repository;


import com.sede.backend.model.Subvencion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubvencionRepository extends JpaRepository<Subvencion, Long> {
}