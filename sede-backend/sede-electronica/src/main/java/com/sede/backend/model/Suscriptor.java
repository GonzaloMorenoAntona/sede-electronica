package com.sede.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import lombok.Data;

@Entity
@Table(name = "suscriptores")
@Data
public class Suscriptor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(unique = true, nullable = false)
    private String token;

    private Boolean verificado = false;

    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;

    @Column(name = "fecha_verificacion")
    private LocalDateTime fechaVerificacion;

    @OneToMany(mappedBy = "suscriptor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Suscripcion> suscripciones;
}
