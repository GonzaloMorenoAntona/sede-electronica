package com.sede.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sede.backend.model.ExpedienteInfoPublica;
import com.sede.backend.service.ExpedienteInfoPublicaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expedientes-info-publica")
public class ExpedienteInfoPublicaController {

    @Autowired
    private ExpedienteInfoPublicaService service;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping
    public List<ExpedienteInfoPublica> getExpedientes() {
        return service.listarTodos();
    }

    @PostMapping
    public ResponseEntity<ExpedienteInfoPublica> recibirExpediente(
            @RequestHeader("X-Api-Key") String apiKey,
            @RequestBody Map<String, Object> body) {
        try {
            ExpedienteInfoPublica expediente = new ExpedienteInfoPublica();
            expediente.setIdExternoSigem((String) body.get("idExternoSigem"));
            expediente.setTitulo((String) body.get("titulo"));
            expediente.setConcejalia((String) body.get("concejalia"));
            if (body.get("fechaInicioAlegaciones") != null)
                expediente.setFechaInicioAlegaciones(LocalDate.parse((String) body.get("fechaInicioAlegaciones")));
            if (body.get("fechaFinAlegaciones") != null)
                expediente.setFechaFinAlegaciones(LocalDate.parse((String) body.get("fechaFinAlegaciones")));
            expediente.setEnlaceAlegaciones((String) body.get("enlaceAlegaciones"));
            expediente.setDocumentos(objectMapper.writeValueAsString(body.get("documentos")));

            return service.guardarOActualizar(apiKey, expediente)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.status(401).build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{idExternoSigem}")
    public ResponseEntity<?> eliminarExpediente(
            @RequestHeader("X-Api-Key") String apiKey,
            @PathVariable String idExternoSigem) {
        return service.eliminar(apiKey, idExternoSigem)
                ? ResponseEntity.ok().build()
                : ResponseEntity.status(401).build();
    }
}
