package com.sede.backend.controller;


import com.sede.backend.model.Subvencion;
import com.sede.backend.service.SubvencionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/subvenciones")
public class SubvencionController {

    @Autowired
    private SubvencionService service;

    @GetMapping
    public List<Subvencion> getSubvenciones() {
        return service.listarTodas();
    }
    @PostMapping
    public ResponseEntity<Subvencion> recibirSubvencion(
            @RequestHeader("X-Api-Key") String apiKey,
            @RequestBody Subvencion subvencion) {

        return service.guardarOActualizar(apiKey, subvencion)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(401).build());
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
