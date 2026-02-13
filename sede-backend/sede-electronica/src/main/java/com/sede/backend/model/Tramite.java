package com.sede.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "tramites")
@Data
public class Tramite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "categoria_id")
    private Long categoriaId;

    private String subgrupo;

    @Column(name = "palabras_clave")
    private String palabrasClave;

    @Column(name = "url_externa")
    private String urlExterna;

    @Column(name = "es_enlace_externo")
    private Integer esEnlaceExterno; // Lo ponemos como Integer

    @Column(name = "unidad_tramitadora")
    private String unidadTramitadora;

    @Column(name = "tipo")
    private String tipo;

    @Column(name = "fecha_publicacion")
    private LocalDate fechaPublicacion;

    @Column(name = "estado")
    private String estado;
}
