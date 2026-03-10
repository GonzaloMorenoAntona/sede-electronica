package com.sede.backend.service;

import com.sede.backend.model.ProcesoSelectivo;
import com.sede.backend.repository.ProcesoSelectivoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProcesoSelectivoService {

    @Value("${sigem.api.key}")
    private String apiKeySecreta;

    private static final Logger log = LoggerFactory.getLogger(ProcesoSelectivoService.class);

    @Autowired
    private ProcesoSelectivoRepository repository;

    public List<ProcesoSelectivo> listarTodos() {
        return repository.findAll();
    }

    public Optional<ProcesoSelectivo> guardarOActualizar(String apiKey, ProcesoSelectivo datos) {
        if (!apiKeySecreta.equals(apiKey)) {
            log.warn("Intento de acceso con API Key incorrecta: {}", apiKey);
            return Optional.empty();
        }

        ProcesoSelectivo proceso = repository
                .findByIdExternoSigem(datos.getIdExternoSigem())
                .orElse(new ProcesoSelectivo());

        proceso.setIdExternoSigem(datos.getIdExternoSigem());
        proceso.setTitulo(datos.getTitulo());
        proceso.setBases(datos.getBases());
        proceso.setDocumentos(datos.getDocumentos());
        proceso.setEnlaceActivo(datos.getEnlaceActivo());
        proceso.setFechaSincronizacion(LocalDateTime.now());

        ProcesoSelectivo guardado = repository.save(proceso);
        log.info("Proceso selectivo sincronizado: {}", guardado.getIdExternoSigem());

        return Optional.of(guardado);
    }

    public boolean eliminar(String apiKey, String idExternoSigem) {
        if (!apiKeySecreta.equals(apiKey)) {
            log.warn("Intento de borrado con API Key incorrecta");
            return false;
        }
        repository.findByIdExternoSigem(idExternoSigem).ifPresent(p -> {
            repository.delete(p);
            log.info("Proceso selectivo eliminado: {}", idExternoSigem);
        });
        return true;
    }
}
