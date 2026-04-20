package com.sede.backend.service;

import com.sede.backend.model.InformacionPublica;
import com.sede.backend.repository.InformacionPublicaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class InformacionPublicaService {

    @Value("${sigem.api.key}")
    private String apiKeySecreta;

    private static final Logger log = LoggerFactory.getLogger(InformacionPublicaService.class);

    @Autowired
    private InformacionPublicaRepository repository;

    public List<InformacionPublica> listarTodas() {
        return repository.findAll();
    }

    public Optional<InformacionPublica> guardarOActualizar(String apiKey, InformacionPublica datos) {
        if (!apiKeySecreta.equals(apiKey)) {
            log.warn("Intento de acceso con API Key incorrecta: {}", apiKey);
            return Optional.empty();
        }

        InformacionPublica info = repository
                .findByIdExternoSigem(datos.getIdExternoSigem())
                .orElse(new InformacionPublica());

        info.setIdExternoSigem(datos.getIdExternoSigem());
        info.setTitulo(datos.getTitulo());
        info.setFechaInicio(datos.getFechaInicio());
        info.setFechaFin(datos.getFechaFin());
        info.setEnlaceAlegaciones(datos.getEnlaceAlegaciones());
        info.setNaturalezaJuridica(datos.getNaturalezaJuridica());
        info.setAmbitoMaterial(datos.getAmbitoMaterial());
        info.setCaracterIniciativa(datos.getCaracterIniciativa());
        info.setDocumentos(datos.getDocumentos());
        info.setFechaSincronizacion(LocalDateTime.now());

        InformacionPublica guardada = repository.save(info);
        log.info("Información pública sincronizada: {}", guardada.getIdExternoSigem());

        return Optional.of(guardada);
    }

    public boolean eliminar(String apiKey, String idExternoSigem) {
        if (!apiKeySecreta.equals(apiKey)) {
            log.warn("Intento de borrado con API Key incorrecta");
            return false;
        }
        repository.findByIdExternoSigem(idExternoSigem).ifPresent(i -> {
            repository.delete(i);
            log.info("Información pública eliminada: {}", idExternoSigem);
        });
        return true;
    }
}
