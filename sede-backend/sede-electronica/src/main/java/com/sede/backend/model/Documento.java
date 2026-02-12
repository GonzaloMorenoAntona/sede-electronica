package com.sede.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "documentos_requeridos")
@Data
public class Documento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    // Añadimos la descripción como TEXT para explicar qué debe contener el documento
    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "tramite_id")
    private Long tramiteId;
}
