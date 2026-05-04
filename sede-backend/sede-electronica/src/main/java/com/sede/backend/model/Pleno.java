package com.sede.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Data;

@Entity
@Table(name = "plenos")
@Data
public class Pleno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_externo_sigem", unique = true, nullable = false)
    private String idExternoSigem;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    private Integer anio;

    @Column(columnDefinition = "JSON")
    private String sesion;

    @Column(columnDefinition = "JSON")
    private String convocatoria;

    @Column(columnDefinition = "JSON")
    private String acta;

    @Column(name = "orden_dia", columnDefinition = "JSON")
    private String ordenDia;

    @Column(name = "fecha_sincronizacion")
    private LocalDateTime fechaSincronizacion;
}
