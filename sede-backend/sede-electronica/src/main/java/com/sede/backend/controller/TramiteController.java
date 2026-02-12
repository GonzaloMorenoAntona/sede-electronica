package com.sede.backend.controller;

import com.sede.backend.model.Tramite;
import com.sede.backend.service.TramiteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tramites")
public class TramiteController {

    @Autowired
    private TramiteService tramiteService;
    @GetMapping
    public List<Tramite> obtenerTodos() {
        return tramiteService.obtenerTodos();
    }
    @GetMapping("/{id}/detalle")
    public Map<String, Object> getDetalle(@PathVariable Long id) {
        return tramiteService.getDetalleCompleto(id);
    }
    @GetMapping("/buscar")
    public List<Tramite> buscar(@RequestParam String q) {
        return tramiteService.buscarTramites(q);
    }
}