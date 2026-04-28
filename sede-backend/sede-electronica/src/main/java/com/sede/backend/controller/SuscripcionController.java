package com.sede.backend.controller;

import com.sede.backend.service.SuscripcionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/suscripciones")
public class SuscripcionController {

    @Autowired
    private SuscripcionService service;

    @Value("${app.url}")
    private String appUrl;

    @PostMapping
    public ResponseEntity<?> registrar(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isBlank()) return ResponseEntity.badRequest().build();
        String resultado = service.registrar(email);
        return ResponseEntity.ok(Map.of("resultado", resultado));
    }

    @GetMapping("/verificar/{token}")
    public ResponseEntity<Void> verificar(@PathVariable String token) {
        boolean ok = service.verificar(token);
        String redirect = ok
                ? appUrl + "/suscripcion-confirmada?token=" + token
                : appUrl + "/suscripcion-error";
        return ResponseEntity.status(302)
                .header("Location", redirect)
                .build();
    }

    @PostMapping("/preferencias/{token}")
    public ResponseEntity<?> preferencias(
            @PathVariable String token,
            @RequestBody Map<String, List<String>> body) {
        boolean ok = service.actualizarPreferencias(token, body.get("tipos"));
        return ok ? ResponseEntity.ok().build() : ResponseEntity.status(403).build();
    }

    @GetMapping("/baja/{token}")
    public ResponseEntity<Void> baja(@PathVariable String token) {
        service.darDeBaja(token);
        return ResponseEntity.status(302)
                .header("Location", appUrl + "/suscripcion-baja")
                .build();
    }
}
