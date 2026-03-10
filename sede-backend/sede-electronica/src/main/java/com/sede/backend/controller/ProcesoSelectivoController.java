package com.sede.backend.controller;

import com.sede.backend.model.ProcesoSelectivo;
import com.sede.backend.service.ProcesoSelectivoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/procesos-selectivos")
public class ProcesoSelectivoController {

    @Autowired
    private ProcesoSelectivoService service;

    @GetMapping
    public List<ProcesoSelectivo> getProcesos() {
        return service.listarTodos();
    }

    @PostMapping
    public ResponseEntity<ProcesoSelectivo> recibirProceso(
            @RequestHeader("X-Api-Key") String apiKey,
            @RequestBody ProcesoSelectivo proceso) {
        return service.guardarOActualizar(apiKey, proceso)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(401).build());
    }

    @DeleteMapping("/{idExternoSigem}")
    public ResponseEntity<?> eliminarProceso(
            @RequestHeader("X-Api-Key") String apiKey,
            @PathVariable String idExternoSigem) {
        return service.eliminar(apiKey, idExternoSigem)
                ? ResponseEntity.ok().build()
                : ResponseEntity.status(401).build();
    }
}
