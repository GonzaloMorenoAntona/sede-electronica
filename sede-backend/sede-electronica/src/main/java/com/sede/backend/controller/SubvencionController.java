package com.sede.backend.controller;


import com.sede.backend.model.Subvencion;
import com.sede.backend.service.SubvencionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/subvenciones")
@CrossOrigin(origins = "http://localhost:3000") // Para que tu React no dé error de seguridad
public class SubvencionController {

    @Autowired
    private SubvencionService service;

    @GetMapping
    public List<Subvencion> getSubvenciones() {
        return service.listarTodas();
    }
}
