package com.sede.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sede.backend.model.ProcesoSelectivo;
import com.sede.backend.service.ProcesoSelectivoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/procesos-selectivos")
public class ProcesoSelectivoController {

    @Autowired
    private ProcesoSelectivoService service;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping
    public List<ProcesoSelectivo> getProcesos() {
        return service.listarTodos();
    }

    @PostMapping
    public ResponseEntity<ProcesoSelectivo> recibirProceso(
            @RequestHeader("X-Api-Key") String apiKey,
            @RequestBody Map<String, Object> body) {
        try {
            ProcesoSelectivo proceso = new ProcesoSelectivo();
            proceso.setIdExternoSigem((String) body.get("idExternoSigem"));
            proceso.setTitulo((String) body.get("titulo"));
            proceso.setBases(objectMapper.writeValueAsString(body.get("bases")));
            proceso.setDocumentos(objectMapper.writeValueAsString(body.get("documentos")));
            proceso.setEnlaceActivo(objectMapper.writeValueAsString(body.get("enlaceActivo")));

            return service.guardarOActualizar(apiKey, proceso)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.status(401).build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
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
