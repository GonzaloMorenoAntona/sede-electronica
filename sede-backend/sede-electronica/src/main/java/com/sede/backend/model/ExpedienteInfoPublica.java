package com.sede.backend.model;


import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Data;

@Entity
@Table(name = "expedientes_informacion_publica")
@Data
public class ExpedienteInfoPublica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_externo_sigem", unique = true, nullable = false)
    private String idExternoSigem;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String titulo;

    private String concejalia;

    @Column(name = "fecha_inicio_alegaciones")
    private LocalDate fechaInicioAlegaciones;

    @Column(name = "fecha_fin_alegaciones")
    private LocalDate fechaFinAlegaciones;

    @Column(name = "enlace_alegaciones")
    private String enlaceAlegaciones;

    @Column(columnDefinition = "JSON")
    private String documentos;

    @Column(name = "fecha_sincronizacion")
    private LocalDateTime fechaSincronizacion;
}
