package com.sede.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Data;

@Entity
@Table(name = "procesos_selectivos")
@Data
public class ProcesoSelectivo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_externo_sigem", unique = true, nullable = false)
    private String idExternoSigem;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String titulo;

    @Column(columnDefinition = "JSON")
    private String bases;

    @Column(columnDefinition = "JSON")
    private String documentos;

    @Column(name = "enlace_activo", columnDefinition = "JSON")
    private String enlaceActivo;

    @Column(name = "fecha_sincronizacion")
    private LocalDateTime fechaSincronizacion;

}
