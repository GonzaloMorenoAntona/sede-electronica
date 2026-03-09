package com.sede.backend.service;


import com.sede.backend.model.Subvencion;
import com.sede.backend.repository.SubvencionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SubvencionService {

    @Value("${sigem.api.key}")
    private String apiKeySecreta;

    private static final Logger log = LoggerFactory.getLogger(SubvencionService.class);

    @Autowired
    private SubvencionRepository repository;

    public List<Subvencion> listarTodas() {
        return repository.findAll();
    }
    public Optional<Subvencion> guardarOActualizar(String apiKey, Subvencion datos) {
        // Validar API Key
        if (!apiKeySecreta.equals(apiKey)) {
            log.warn("Intento de acceso con API Key incorrecta: {}", apiKey);
            return Optional.empty();
        }

        Subvencion subvencion = repository
                .findByIdExternoSigem(datos.getIdExternoSigem())
                .orElse(new Subvencion());

        subvencion.setIdExternoSigem(datos.getIdExternoSigem());
        subvencion.setTitulo(datos.getTitulo());
        subvencion.setAnio(datos.getAnio());
        subvencion.setServicio(datos.getServicio());
        subvencion.setFechaInicio(datos.getFechaInicio());
        subvencion.setFechaFin(datos.getFechaFin());
        subvencion.setUrlConvocatoria(datos.getUrlConvocatoria());
        subvencion.setUrlJustificacion(datos.getUrlJustificacion());
        subvencion.setAnexos(datos.getAnexos());
        subvencion.setFechaSincronizacion(LocalDateTime.now());

        Subvencion guardada = repository.save(subvencion);
        log.info("Subvención sincronizada: {} - {}", guardada.getIdExternoSigem(), guardada.getFechaSincronizacion());

        return Optional.of(guardada);
    }
    public boolean eliminar(String apiKey, String idExternoSigem) {
        if (!apiKeySecreta.equals(apiKey)) {
            log.warn("Intento de borrado con API Key incorrecta");
            return false;
        }
        repository.findByIdExternoSigem(idExternoSigem).ifPresent(sub -> {
            repository.delete(sub);
            log.info("Subvención eliminada: {}", idExternoSigem);
        });
        return true;
    }
}