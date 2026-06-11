package com.sede.backend.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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
    public void enviarEnlaceGestion(String email, String token) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(mailFrom);
        msg.setTo(email);
        msg.setSubject("Gestiona tus suscripciones — Sede Electrónica Ciudad Real");
        msg.setText(
                "Hola,\n\n" +
                        "Pulsa el siguiente enlace para gestionar tus preferencias de suscripción:\n\n" +
                        appUrl + "/suscripcion-confirmada?token=" + token + "\n\n" +
                        "Ayuntamiento de Ciudad Real"
        );
        mailSender.send(msg);
    }
    public void enviarSoporte(String nombre, String telefono, String emailCiudadano,
                              String consulta, MultipartFile archivo) throws Exception {
        MimeMessage msg = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(msg, archivo != null && !archivo.isEmpty(), "UTF-8");

        helper.setFrom(mailFrom);
        helper.setTo("soporte@ciudadreal.es");
        helper.setReplyTo(emailCiudadano);
        helper.setSubject("Incidencia Sede Electrónica — " + nombre);

        String cuerpo =
                "Se ha recibido una nueva consulta/incidencia desde la Sede Electrónica.\n\n" +
                        "──────────────────────────────────\n" +
                        "DATOS DEL CIUDADANO\n" +
                        "──────────────────────────────────\n" +
                        "Nombre:    " + nombre + "\n" +
                        "Teléfono:  " + (telefono.isBlank() ? "No indicado" : telefono) + "\n" +
                        "Email:     " + emailCiudadano + "\n\n" +
                        "──────────────────────────────────\n" +
                        "CONSULTA / INCIDENCIA\n" +
                        "──────────────────────────────────\n" +
                        consulta + "\n\n" +
                        "──────────────────────────────────\n" +
                        (archivo != null && !archivo.isEmpty()
                                ? "Archivo adjunto: " + archivo.getOriginalFilename() + "\n"
                                : "Sin archivo adjunto\n") +
                        "──────────────────────────────────\n" +
                        "Enviado desde: " + appUrl;

        helper.setText(cuerpo);

        if (archivo != null && !archivo.isEmpty()) {
            helper.addAttachment(archivo.getOriginalFilename(), archivo);
        }

        mailSender.send(msg);
    }
}
