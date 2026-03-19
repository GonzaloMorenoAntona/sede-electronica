package com.sede.backend.service;

import com.sede.backend.model.Pleno;
import com.sede.backend.repository.PlenoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PlenoService {

    @Value("${sigem.api.key}")
    private String apiKeySecreta;

    private static final Logger log = LoggerFactory.getLogger(PlenoService.class);

    @Autowired
    private PlenoRepository repository;

    public List<Pleno> listarTodos() {
        return repository.findAll();
    }

    public Optional<Pleno> guardarOActualizar(String apiKey, Pleno datos) {
        if (!apiKeySecreta.equals(apiKey)) {
            log.warn("Intento de acceso con API Key incorrecta: {}", apiKey);
            return Optional.empty();
        }

        Pleno pleno = repository
                .findByIdExternoSigem(datos.getIdExternoSigem())
                .orElse(new Pleno());

        pleno.setIdExternoSigem(datos.getIdExternoSigem());
        pleno.setTitulo(datos.getTitulo());
        pleno.setAnio(datos.getAnio());
        pleno.setConvocatoria(datos.getConvocatoria());
        pleno.setActa(datos.getActa());
        pleno.setFechaSincronizacion(LocalDateTime.now());

        Pleno guardado = repository.save(pleno);
        log.info("Pleno sincronizado: {}", guardado.getIdExternoSigem());

        return Optional.of(guardado);
    }

    public boolean eliminar(String apiKey, String idExternoSigem) {
        if (!apiKeySecreta.equals(apiKey)) {
            log.warn("Intento de borrado con API Key incorrecta");
            return false;
        }
        repository.findByIdExternoSigem(idExternoSigem).ifPresent(p -> {
            repository.delete(p);
            log.info("Pleno eliminado: {}", idExternoSigem);
        });
        return true;
    }
}
