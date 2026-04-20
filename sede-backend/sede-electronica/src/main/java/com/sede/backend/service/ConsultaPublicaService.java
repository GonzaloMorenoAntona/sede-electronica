package com.sede.backend.service;

import com.sede.backend.model.ConsultaPublica;
import com.sede.backend.repository.ConsultaPublicaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ConsultaPublicaService {

    @Value("${sigem.api.key}")
    private String apiKeySecreta;

    private static final Logger log = LoggerFactory.getLogger(ConsultaPublicaService.class);

    @Autowired
    private ConsultaPublicaRepository repository;

    public List<ConsultaPublica> listarTodas() {
        return repository.findAll();
    }

    public Optional<ConsultaPublica> guardarOActualizar(String apiKey, ConsultaPublica datos) {
        if (!apiKeySecreta.equals(apiKey)) {
            log.warn("Intento de acceso con API Key incorrecta: {}", apiKey);
            return Optional.empty();
        }

        ConsultaPublica consulta = repository
                .findByIdExternoSigem(datos.getIdExternoSigem())
                .orElse(new ConsultaPublica());

        consulta.setIdExternoSigem(datos.getIdExternoSigem());
        consulta.setTitulo(datos.getTitulo());
        consulta.setFechaInicio(datos.getFechaInicio());
        consulta.setFechaFin(datos.getFechaFin());
        consulta.setDocumentos(datos.getDocumentos());
        consulta.setFechaSincronizacion(LocalDateTime.now());

        ConsultaPublica guardada = repository.save(consulta);
        log.info("Consulta pública sincronizada: {}", guardada.getIdExternoSigem());

        return Optional.of(guardada);
    }

    public boolean eliminar(String apiKey, String idExternoSigem) {
        if (!apiKeySecreta.equals(apiKey)) {
            log.warn("Intento de borrado con API Key incorrecta");
            return false;
        }
        repository.findByIdExternoSigem(idExternoSigem).ifPresent(c -> {
            repository.delete(c);
            log.info("Consulta pública eliminada: {}", idExternoSigem);
        });
        return true;
    }
}
