package com.sede.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Data;

@Entity
@Table(name = "subvenciones") // Asegúrate de que tu tabla se llama así
@Data
public class Subvencion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_externo_sigem")
    private String idExternoSigem; // Mapeado de id_externo_sigem

    private String titulo;
    private Integer anio;
    private String servicio;

    @Column(name = "fecha_inicio")
    private LocalDate fechaInicio; // Mapeado de fecha_inicio

    @Column(name = "fecha_fin")
    private LocalDate fechaFin; // Mapeado de fecha_fin

    @Column(name = "url_convocatoria")
    private String urlConvocatoria; // Mapeado de url_convocatoria

    @Column(columnDefinition = "JSON")
    private String anexos; // El campo JSON que React parseará

    @Column(name = "url_justificacion")
    private String urlJustificacion; // Mapeado de url_justificacion

    @Column(name = "fecha_sincronizacion")
    private LocalDateTime fechaSincronizacion; // Mapeado de fecha_sincronizacion

    @Column(name = "fecha_inicio_presentacion")
    private LocalDate fechaInicioPresentacion;

    @Column(name = "fecha_fin_presentacion")
    private LocalDate fechaFinPresentacion;

    @Column(name = "fecha_inicio_justificacion")
    private LocalDate fechaInicioJustificacion;

    @Column(name = "fecha_fin_justificacion")
    private LocalDate fechaFinJustificacion;
}
