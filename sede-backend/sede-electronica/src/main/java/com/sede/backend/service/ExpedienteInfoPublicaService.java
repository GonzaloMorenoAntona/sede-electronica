package com.sede.backend.service;

import com.sede.backend.model.ExpedienteInfoPublica;
import com.sede.backend.repository.ExpedienteInfoPublicaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ExpedienteInfoPublicaService {

    @Value("${sigem.api.key}")
    private String apiKeySecreta;

    private static final Logger log = LoggerFactory.getLogger(ExpedienteInfoPublicaService.class);

    @Autowired
    private ExpedienteInfoPublicaRepository repository;

    public List<ExpedienteInfoPublica> listarTodos() {
        return repository.findAll();
    }

    public Optional<ExpedienteInfoPublica> guardarOActualizar(String apiKey, ExpedienteInfoPublica datos) {
        if (!apiKeySecreta.equals(apiKey)) {
            log.warn("Intento de acceso con API Key incorrecta: {}", apiKey);
            return Optional.empty();
        }

        ExpedienteInfoPublica expediente = repository
                .findByIdExternoSigem(datos.getIdExternoSigem())
                .orElse(new ExpedienteInfoPublica());

        expediente.setIdExternoSigem(datos.getIdExternoSigem());
        expediente.setTitulo(datos.getTitulo());
        expediente.setConcejalia(datos.getConcejalia());
        expediente.setFechaInicioAlegaciones(datos.getFechaInicioAlegaciones());
        expediente.setFechaFinAlegaciones(datos.getFechaFinAlegaciones());
        expediente.setEnlaceAlegaciones(datos.getEnlaceAlegaciones());
        expediente.setDocumentos(datos.getDocumentos());
        expediente.setFechaSincronizacion(LocalDateTime.now());

        ExpedienteInfoPublica guardado = repository.save(expediente);
        log.info("Expediente sincronizado: {}", guardado.getIdExternoSigem());

        return Optional.of(guardado);
    }

    public boolean eliminar(String apiKey, String idExternoSigem) {
        if (!apiKeySecreta.equals(apiKey)) {
            log.warn("Intento de borrado con API Key incorrecta");
            return false;
        }
        repository.findByIdExternoSigem(idExternoSigem).ifPresent(e -> {
            repository.delete(e);
            log.info("Expediente eliminado: {}", idExternoSigem);
        });
        return true;
    }
}
