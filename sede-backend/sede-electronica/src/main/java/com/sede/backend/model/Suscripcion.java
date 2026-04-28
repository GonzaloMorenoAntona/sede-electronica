package com.sede.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "suscripciones")
@Data
public class Suscripcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "suscriptor_id", nullable = false)
    private Suscriptor suscriptor;

    @Column(nullable = false)
    private String tipo;
}
