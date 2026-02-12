package com.sede.backend.model;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "normativa")
@Data
public class Normativa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String referencia;

    @Column(name = "descripcion_corta", columnDefinition = "TEXT")
    private String descripcionCorta;

    @Column(name = "enlace_boletin")
    private String enlaceBoletin;

    @Column(name = "tramite_id")
    private Long tramiteId;
}