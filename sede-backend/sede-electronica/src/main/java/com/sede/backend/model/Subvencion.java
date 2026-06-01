package com.sede.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Data;

@Entity
@Table(name = "subvenciones")
@Data
public class Subvencion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_externo_sigem")
    private String idExternoSigem;

    private String titulo;
    private Integer anio;
    private String servicio;

    @Column(name = "url_convocatoria")
    private String urlConvocatoria;

    @Column(name = "url_justificacion")
    private String urlJustificacion;

    @Column(columnDefinition = "JSON")
    private String bases;   // Bases reguladoras y convocatoria

    @Column(columnDefinition = "JSON")
    private String anexos;  // Documentación adicional (anexos)

    @Column(name = "fecha_inicio_presentacion")
    private LocalDate fechaInicioPresentacion;

    @Column(name = "fecha_fin_presentacion")
    private LocalDate fechaFinPresentacion;

    @Column(name = "fecha_inicio_justificacion")
    private LocalDate fechaInicioJustificacion;

    @Column(name = "fecha_fin_justificacion")
    private LocalDate fechaFinJustificacion;

    @Column(name = "fecha_sincronizacion")
    private LocalDateTime fechaSincronizacion;
}