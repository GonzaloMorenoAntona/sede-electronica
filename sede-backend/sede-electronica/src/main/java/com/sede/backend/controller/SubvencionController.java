package com.sede.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sede.backend.model.Subvencion;
import com.sede.backend.service.SubvencionService;
import com.sede.backend.service.SuscripcionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/subvenciones")
public class SubvencionController {

    @Autowired private SubvencionService service;
    @Autowired private SuscripcionService suscripcionService;

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
            subvencion.setUrlConvocatoria((String) body.get("urlConvocatoria"));
            subvencion.setUrlJustificacion((String) body.get("urlJustificacion"));
            subvencion.setBases(objectMapper.writeValueAsString(body.get("bases")));
            subvencion.setAnexos(objectMapper.writeValueAsString(body.get("anexos")));
            if (body.get("fechaInicioPresentacion") != null)
                subvencion.setFechaInicioPresentacion(LocalDate.parse((String) body.get("fechaInicioPresentacion")));
            if (body.get("fechaFinPresentacion") != null)
                subvencion.setFechaFinPresentacion(LocalDate.parse((String) body.get("fechaFinPresentacion")));
            if (body.get("fechaInicioJustificacion") != null)
                subvencion.setFechaInicioJustificacion(LocalDate.parse((String) body.get("fechaInicioJustificacion")));
            if (body.get("fechaFinJustificacion") != null)
                subvencion.setFechaFinJustificacion(LocalDate.parse((String) body.get("fechaFinJustificacion")));

            return service.guardarOActualizar(apiKey, subvencion)
                    .map(s -> {
                        suscripcionService.notificarSuscriptores("subvenciones", s.getTitulo());
                        return ResponseEntity.ok(s);
                    })
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