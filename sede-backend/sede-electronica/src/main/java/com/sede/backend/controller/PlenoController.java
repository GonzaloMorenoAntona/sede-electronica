package com.sede.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sede.backend.model.Pleno;
import com.sede.backend.service.PlenoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/plenos")
public class PlenoController {

    @Autowired
    private PlenoService service;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping
    public List<Pleno> getPlenos() {
        return service.listarTodos();
    }

    @PostMapping
    public ResponseEntity<Pleno> recibirPleno(
            @RequestHeader("X-Api-Key") String apiKey,
            @RequestBody Map<String, Object> body) {
        try {
            Pleno pleno = new Pleno();
            pleno.setIdExternoSigem((String) body.get("idExternoSigem"));
            pleno.setTitulo((String) body.get("titulo"));
            pleno.setAnio((Integer) body.get("anio"));
            pleno.setConvocatoria(objectMapper.writeValueAsString(body.get("convocatoria")));
            pleno.setActa(objectMapper.writeValueAsString(body.get("acta")));

            return service.guardarOActualizar(apiKey, pleno)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.status(401).build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{idExternoSigem}")
    public ResponseEntity<?> eliminarPleno(
            @RequestHeader("X-Api-Key") String apiKey,
            @PathVariable String idExternoSigem) {
        return service.eliminar(apiKey, idExternoSigem)
                ? ResponseEntity.ok().build()
                : ResponseEntity.status(401).build();
    }
}
