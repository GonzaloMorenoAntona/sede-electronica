package com.sede.backend.service;

import com.sede.backend.model.JuntaGobierno;
import com.sede.backend.repository.JuntaGobiernoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class JuntaGobiernoService {

    @Autowired
    private JuntaGobiernoRepository repository;

    @Value("${sigem.api.key}")
    private String apiKeyEsperada;

    public List<JuntaGobierno> listarTodos() {
        return repository.findAll();
    }

    public Optional<JuntaGobierno> guardarOActualizar(String apiKey, JuntaGobierno junta) {
        if (!apiKeyEsperada.equals(apiKey)) return Optional.empty();

        repository.findByIdExternoSigem(junta.getIdExternoSigem())
                .ifPresent(existente -> junta.setId(existente.getId()));

        junta.setFechaSincronizacion(LocalDateTime.now());
        return Optional.of(repository.save(junta));
    }

    public boolean eliminar(String apiKey, String idExternoSigem) {
        if (!apiKeyEsperada.equals(apiKey)) return false;
        repository.findByIdExternoSigem(idExternoSigem)
                .ifPresent(repository::delete);
        return true;
    }
}
