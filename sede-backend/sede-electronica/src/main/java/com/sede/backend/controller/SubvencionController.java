package com.sede.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sede.backend.model.Subvencion;
import com.sede.backend.service.SubvencionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/subvenciones")
public class SubvencionController {

    @Autowired
    private SubvencionService service;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping
    public List<Subvencion> getSubvenciones() {
        return service.listarTodas();
    }

    @PostMapping
    public ResponseEntity<Subvencion> recibirSubvencion(
            @RequestHeader("X-Api-Key") String apiKey,
            @RequestBody Map<String, Object> body) {
        try {
            Subvencion subvencion = new Subvencion();
            subvencion.setIdExternoSigem((String) body.get("idExternoSigem"));
            subvencion.setTitulo((String) body.get("titulo"));
            subvencion.setAnio((Integer) body.get("anio"));
            subvencion.setServicio((String) body.get("servicio"));
            subvencion.setFechaInicio(LocalDate.parse((String) body.get("fechaInicio")));
            subvencion.setFechaFin(LocalDate.parse((String) body.get("fechaFin")));
            subvencion.setUrlConvocatoria((String) body.get("urlConvocatoria"));
            subvencion.setUrlJustificacion((String) body.get("urlJustificacion"));
            subvencion.setAnexos(objectMapper.writeValueAsString(body.get("anexos")));

            return service.guardarOActualizar(apiKey, subvencion)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.status(401).build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{idExternoSigem}")
    public ResponseEntity<?> eliminarSubvencion(
            @RequestHeader("X-Api-Key") String apiKey,
            @PathVariable String idExternoSigem) {
        return service.eliminar(apiKey, idExternoSigem)
                ? ResponseEntity.ok().build()
                : ResponseEntity.status(401).build();
    }
}
