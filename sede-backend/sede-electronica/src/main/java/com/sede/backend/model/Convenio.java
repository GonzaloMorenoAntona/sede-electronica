package com.sede.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Data;

@Entity
@Table(name = "convenios")
@Data
public class Convenio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_externo_sigem", unique = true, nullable = false)
    private String idExternoSigem;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String titulo;

    private String clase;
    private String detalle;
    private String materia;

    @Column(name = "plazo_vigencia_inicio")
    private LocalDate plazoVigenciaInicio;

    @Column(name = "plazo_vigencia_fin")
    private LocalDate plazoVigenciaFin;

    @Column(name = "entidades_firmantes", columnDefinition = "TEXT")
    private String entidadesFirmantes;

    @Column(name = "fecha_sincronizacion")
    private LocalDateTime fechaSincronizacion;
}
