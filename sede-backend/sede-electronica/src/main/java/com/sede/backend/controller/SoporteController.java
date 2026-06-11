package com.sede.backend.controller;

import com.sede.backend.service.EmailService;
import com.sede.backend.service.RecaptchaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/soporte")
public class SoporteController {

    @Autowired private EmailService emailService;
    @Autowired private RecaptchaService recaptchaService;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> enviarSoporte(
            @RequestParam String nombre,
            @RequestParam String telefono,
            @RequestParam String email,
            @RequestParam String consulta,
            @RequestParam String captchaToken,
            @RequestParam(required = false) MultipartFile archivo) {

        if (!recaptchaService.verificar(captchaToken)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Verificación reCAPTCHA fallida"));
        }

        try {
            emailService.enviarSoporte(nombre, telefono, email, consulta, archivo);
            return ResponseEntity.ok(Map.of("ok", true));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Error al enviar el mensaje"));
        }
    }
}
