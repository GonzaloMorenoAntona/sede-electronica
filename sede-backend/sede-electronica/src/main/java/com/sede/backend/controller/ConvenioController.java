package com.sede.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sede.backend.model.Convenio;
import com.sede.backend.service.ConvenioService;
import com.sede.backend.service.SuscripcionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/convenios")
public class ConvenioController {

    @Autowired
    private ConvenioService service;

    @Autowired
    private SuscripcionService suscripcionService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping
    public List<Convenio> getConvenios() {
        return service.listarTodos();
    }

    @PostMapping
    public ResponseEntity<Convenio> recibirConvenio(
            @RequestHeader("X-Api-Key") String apiKey,
            @RequestBody Map<String, Object> body) {
        try {
            Convenio convenio = new Convenio();
            convenio.setIdExternoSigem((String) body.get("idExternoSigem"));
            convenio.setTitulo((String) body.get("titulo"));
            convenio.setClase((String) body.get("clase"));
            convenio.setDetalle((String) body.get("detalle"));
            convenio.setMateria((String) body.get("materia"));
            convenio.setEntidadesFirmantes((String) body.get("entidadesFirmantes"));

            if (body.get("plazoVigenciaInicio") != null)
                convenio.setPlazoVigenciaInicio(LocalDate.parse((String) body.get("plazoVigenciaInicio")));
            if (body.get("plazoVigenciaFin") != null)
                convenio.setPlazoVigenciaFin(LocalDate.parse((String) body.get("plazoVigenciaFin")));

            if (body.get("documento") != null)
                convenio.setDocumento(objectMapper.writeValueAsString(body.get("documento")));

            return service.guardarOActualizar(apiKey, convenio)
                    .map(s -> {
                        suscripcionService.notificarSuscriptores("convenios", s.getTitulo());
                        return ResponseEntity.ok(s);
                    })
                    .orElse(ResponseEntity.status(401).build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
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
