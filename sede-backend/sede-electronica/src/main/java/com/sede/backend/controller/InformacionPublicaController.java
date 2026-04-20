package com.sede.backend.controller;

import com.sede.backend.model.InformacionPublica;
import com.sede.backend.service.InformacionPublicaService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/informacion-publica")
public class InformacionPublicaController {

    @Autowired
    private InformacionPublicaService service;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping
    public List<InformacionPublica> getInformacionPublica() {
        return service.listarTodas();
    }

    @PostMapping
    public ResponseEntity<InformacionPublica> recibirInformacion(
            @RequestHeader("X-Api-Key") String apiKey,
            @RequestBody Map<String, Object> body) {
        try {
            InformacionPublica info = new InformacionPublica();
            info.setIdExternoSigem((String) body.get("idExternoSigem"));
            info.setTitulo((String) body.get("titulo"));
            if (body.get("fechaInicio") != null)
                info.setFechaInicio(LocalDate.parse((String) body.get("fechaInicio")));
            if (body.get("fechaFin") != null)
                info.setFechaFin(LocalDate.parse((String) body.get("fechaFin")));
            info.setEnlaceAlegaciones((String) body.get("enlaceAlegaciones"));
            info.setNaturalezaJuridica((String) body.get("naturalezaJuridica"));
            info.setAmbitoMaterial((String) body.get("ambitoMaterial"));
            info.setCaracterIniciativa((String) body.get("caracterIniciativa"));
            info.setDocumentos(objectMapper.writeValueAsString(body.get("documentos")));

            return service.guardarOActualizar(apiKey, info)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.status(401).build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{idExternoSigem}")
    public ResponseEntity<?> eliminarInformacion(
            @RequestHeader("X-Api-Key") String apiKey,
            @PathVariable String idExternoSigem) {
        return service.eliminar(apiKey, idExternoSigem)
                ? ResponseEntity.ok().build()
                : ResponseEntity.status(401).build();
    }
}
