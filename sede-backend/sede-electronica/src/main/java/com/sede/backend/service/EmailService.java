package com.sede.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${mail.from}")
    private String mailFrom;

    @Value("${app.url}")
    private String appUrl;

    public void enviarConfirmacion(String email, String token) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(mailFrom);
        msg.setTo(email);
        msg.setSubject("Confirma tu suscripción — Sede Electrónica Ciudad Real");
        msg.setText(
                "Hola,\n\n" +
                        "Has solicitado suscribirte a las alertas de la Sede Electrónica del Ayuntamiento de Ciudad Real.\n\n" +
                        "Para confirmar tu suscripción pulsa el siguiente enlace:\n" +
                        appUrl + "/api/suscripciones/verificar/" + token + "\n\n" +
                        "Si no has solicitado esta suscripción, ignora este mensaje.\n\n" +
                        "Ayuntamiento de Ciudad Real"
        );
        mailSender.send(msg);
    }

    public void enviarAlerta(String email, String token, String tipo, String titulo) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(mailFrom);
        msg.setTo(email);
        msg.setSubject("Nueva publicación: " + titulo + " — Sede Electrónica Ciudad Real");
        msg.setText(
                "Hola,\n\n" +
                        "Se ha publicado una nueva entrada en la categoría que sigues: " + tipo + "\n\n" +
                        titulo + "\n\n" +
                        "Puedes consultarla en: " + appUrl + "\n\n" +
                        "Para darte de baja de estas alertas pulsa el siguiente enlace:\n" +
                        appUrl + "/api/suscripciones/baja/" + token + "\n\n" +
                        "Ayuntamiento de Ciudad Real"
        );
        mailSender.send(msg);
    }
}
