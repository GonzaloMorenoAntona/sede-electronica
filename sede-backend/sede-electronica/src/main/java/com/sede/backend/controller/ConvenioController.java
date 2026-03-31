package com.sede.backend.controller;

import com.sede.backend.model.Convenio;
import com.sede.backend.service.ConvenioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/convenios")
public class ConvenioController {

    @Autowired
    private ConvenioService service;

    @GetMapping
    public List<Convenio> getConvenios() {
        return service.listarTodos();
    }

    @PostMapping
    public ResponseEntity<Convenio> recibirConvenio(
            @RequestHeader("X-Api-Key") String apiKey,
            @RequestBody Convenio convenio) {
        return service.guardarOActualizar(apiKey, convenio)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(401).build());
    }

    @DeleteMapping("/{idExternoSigem}")
    public ResponseEntity<?> eliminarConvenio(
            @RequestHeader("X-Api-Key") String apiKey,
            @PathVariable String idExternoSigem) {
        return service.eliminar(apiKey, idExternoSigem)
                ? ResponseEntity.ok().build()
                : ResponseEntity.status(401).build();
    }
}
