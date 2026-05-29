package com.sede.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sede.backend.model.JuntaGobierno;
import com.sede.backend.service.JuntaGobiernoService;
import com.sede.backend.service.SuscripcionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/juntas-gobierno")
public class JuntaGobiernoController {

    @Autowired
    private JuntaGobiernoService service;

    @Autowired
    private SuscripcionService suscripcionService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping
    public List<JuntaGobierno> getJuntasGobierno() {
        return service.listarTodos();
    }

    @PostMapping
    public ResponseEntity<JuntaGobierno> recibirJuntaGobierno(
            @RequestHeader("X-Api-Key") String apiKey,
            @RequestBody Map<String, Object> body) {
        try {
            JuntaGobierno junta = new JuntaGobierno();
            junta.setIdExternoSigem((String) body.get("idExternoSigem"));
            junta.setTitulo((String) body.get("titulo"));
            junta.setDescripcion((String) body.get("descripcion"));
            junta.setAnio((Integer) body.get("anio"));
            junta.setSesion(objectMapper.writeValueAsString(body.get("sesion")));
            junta.setConvocatoria(objectMapper.writeValueAsString(body.get("convocatoria")));
            junta.setActa(objectMapper.writeValueAsString(body.get("acta")));
            junta.setOrdenDia(objectMapper.writeValueAsString(body.get("ordenDia")));

            return service.guardarOActualizar(apiKey, junta)
                    .map(s -> {
                        suscripcionService.notificarSuscriptores("juntas-gobierno", s.getTitulo());
                        return ResponseEntity.ok(s);
                    })
                    .orElse(ResponseEntity.status(401).build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{idExternoSigem}")
    public ResponseEntity<?> eliminarJuntaGobierno(
            @RequestHeader("X-Api-Key") String apiKey,
            @PathVariable String idExternoSigem) {
        return service.eliminar(apiKey, idExternoSigem)
                ? ResponseEntity.ok().build()
                : ResponseEntity.status(401).build();
    }
}
