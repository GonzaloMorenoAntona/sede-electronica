package com.sede.backend.service;

import com.sede.backend.model.Suscripcion;
import com.sede.backend.model.Suscriptor;
import com.sede.backend.repository.SuscripcionRepository;
import com.sede.backend.repository.SuscriptorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class SuscripcionService {

    private static final Logger log = LoggerFactory.getLogger(SuscripcionService.class);

    @Autowired private SuscriptorRepository suscriptorRepo;
    @Autowired private SuscripcionRepository suscripcionRepo;
    @Autowired private EmailService emailService;

    public String registrar(String email) {
        Optional<Suscriptor> existente = suscriptorRepo.findByEmail(email);
        if (existente.isPresent()) {
            if (existente.get().getVerificado()) {
                // En vez de bloquear, redirigimos a preferencias
                return "YA_VERIFICADO:" + existente.get().getToken();
            }
            emailService.enviarConfirmacion(email, existente.get().getToken());
            return "EMAIL_REENVIADO";
        }
        Suscriptor s = new Suscriptor();
        s.setEmail(email);
        s.setToken(UUID.randomUUID().toString());
        s.setVerificado(false);
        s.setFechaRegistro(LocalDateTime.now());
        suscriptorRepo.save(s);
        emailService.enviarConfirmacion(email, s.getToken());
        log.info("Nuevo suscriptor registrado: {}", email);
        return "OK";
    }

    public boolean verificar(String token) {
        Optional<Suscriptor> opt = suscriptorRepo.findByToken(token);
        if (opt.isEmpty() || opt.get().getVerificado()) return false;
        Suscriptor s = opt.get();
        s.setVerificado(true);
        s.setFechaVerificacion(LocalDateTime.now());
        suscriptorRepo.save(s);
        log.info("Suscriptor verificado: {}", s.getEmail());
        return true;
    }

    @Transactional
    public boolean actualizarPreferencias(String token, List<String> tipos) {
        Optional<Suscriptor> opt = suscriptorRepo.findByToken(token);
        if (opt.isEmpty() || !opt.get().getVerificado()) return false;
        Suscriptor s = opt.get();
        suscripcionRepo.deleteBySuscriptorId(s.getId());
        for (String tipo : tipos) {
            Suscripcion sub = new Suscripcion();
            sub.setSuscriptor(s);
            sub.setTipo(tipo);
            suscripcionRepo.save(sub);
        }
        log.info("Preferencias actualizadas para: {}", s.getEmail());
        return true;
    }
    public boolean darDeBaja(String token) {
        Optional<Suscriptor> opt = suscriptorRepo.findByToken(token);
        if (opt.isEmpty()) return false;
        suscriptorRepo.delete(opt.get());
        log.info("Suscriptor dado de baja: {}", opt.get().getEmail());
        return true;
    }

    public void notificarSuscriptores(String tipo, String titulo) {
        List<Suscripcion> subs = suscripcionRepo.findByTipo(tipo);
        for (Suscripcion sub : subs) {
            Suscriptor s = sub.getSuscriptor();
            if (s.getVerificado()) {
                try {
                    emailService.enviarAlerta(s.getEmail(), s.getToken(), tipo, titulo);
                } catch (Exception e) {
                    log.error("Error enviando alerta a {}: {}", s.getEmail(), e.getMessage());
                }
            }
        }
    }
}
