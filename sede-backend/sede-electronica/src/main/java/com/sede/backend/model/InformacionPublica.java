package com.sede.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Data;

@Entity
@Table(name = "informacion_publica")
@Data
public class InformacionPublica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_externo_sigem", unique = true, nullable = false)
    private String idExternoSigem;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String titulo;

    @Column(name = "fecha_inicio")
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

    @Column(name = "enlace_alegaciones")
    private String enlaceAlegaciones;

    @Column(name = "naturaleza_juridica")
    private String naturalezaJuridica;

    @Column(name = "ambito_material")
    private String ambitoMaterial;

    @Column(name = "caracter_iniciativa")
    private String caracterIniciativa;

    @Column(columnDefinition = "JSON")
    private String documentos;

    @Column(name = "fecha_sincronizacion")
    private LocalDateTime fechaSincronizacion;
}