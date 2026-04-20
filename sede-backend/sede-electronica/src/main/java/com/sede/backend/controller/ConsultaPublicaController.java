package com.sede.backend.controller;

import com.sede.backend.model.ConsultaPublica;
import com.sede.backend.service.ConsultaPublicaService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/consultas-publicas")
public class ConsultaPublicaController {

    @Autowired
    private ConsultaPublicaService service;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping
    public List<ConsultaPublica> getConsultas() {
        return service.listarTodas();
    }

    @PostMapping
    public ResponseEntity<ConsultaPublica> recibirConsulta(
            @RequestHeader("X-Api-Key") String apiKey,
            @RequestBody Map<String, Object> body) {
        try {
            ConsultaPublica consulta = new ConsultaPublica();
            consulta.setIdExternoSigem((String) body.get("idExternoSigem"));
            consulta.setTitulo((String) body.get("titulo"));
            if (body.get("fechaInicio") != null)
                consulta.setFechaInicio(LocalDate.parse((String) body.get("fechaInicio")));
            if (body.get("fechaFin") != null)
                consulta.setFechaFin(LocalDate.parse((String) body.get("fechaFin")));
            consulta.setDocumentos(objectMapper.writeValueAsString(body.get("documentos")));

            return service.guardarOActualizar(apiKey, consulta)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.status(401).build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{idExternoSigem}")
    public ResponseEntity<?> eliminarConsulta(
            @RequestHeader("X-Api-Key") String apiKey,
            @PathVariable String idExternoSigem) {
        return service.eliminar(apiKey, idExternoSigem)
                ? ResponseEntity.ok().build()
                : ResponseEntity.status(401).build();
    }
}
