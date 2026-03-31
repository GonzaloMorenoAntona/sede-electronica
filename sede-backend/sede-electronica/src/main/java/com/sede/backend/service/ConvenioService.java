package com.sede.backend.service;

import com.sede.backend.model.Convenio;
import com.sede.backend.repository.ConvenioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ConvenioService {

    @Value("${sigem.api.key}")
    private String apiKeySecreta;

    private static final Logger log = LoggerFactory.getLogger(ConvenioService.class);

    @Autowired
    private ConvenioRepository repository;

    public List<Convenio> listarTodos() {
        return repository.findAll();
    }

    public Optional<Convenio> guardarOActualizar(String apiKey, Convenio datos) {
        if (!apiKeySecreta.equals(apiKey)) {
            log.warn("Intento de acceso con API Key incorrecta: {}", apiKey);
            return Optional.empty();
        }

        Convenio convenio = repository
                .findByIdExternoSigem(datos.getIdExternoSigem())
                .orElse(new Convenio());

        convenio.setIdExternoSigem(datos.getIdExternoSigem());
        convenio.setTitulo(datos.getTitulo());
        convenio.setClase(datos.getClase());
        convenio.setDetalle(datos.getDetalle());
        convenio.setMateria(datos.getMateria());
        convenio.setPlazoVigenciaInicio(datos.getPlazoVigenciaInicio());
        convenio.setPlazoVigenciaFin(datos.getPlazoVigenciaFin());
        convenio.setEntidadesFirmantes(datos.getEntidadesFirmantes());
        convenio.setFechaSincronizacion(LocalDateTime.now());

        Convenio guardado = repository.save(convenio);
        log.info("Convenio sincronizado: {}", guardado.getIdExternoSigem());

        return Optional.of(guardado);
    }

    public boolean eliminar(String apiKey, String idExternoSigem) {
        if (!apiKeySecreta.equals(apiKey)) {
            log.warn("Intento de borrado con API Key incorrecta");
            return false;
        }
        repository.findByIdExternoSigem(idExternoSigem).ifPresent(c -> {
            repository.delete(c);
            log.info("Convenio eliminado: {}", idExternoSigem);
        });
        return true;
    }
}