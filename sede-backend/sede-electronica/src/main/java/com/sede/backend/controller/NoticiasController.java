package com.sede.backend.controller;

import com.sede.backend.model.Noticia;
import com.sede.backend.model.*;
import com.sede.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.*;

@RestController
@RequestMapping("/api/noticias")
public class NoticiasController {

    @Autowired private TramiteRepository               tramiteRepo;
    @Autowired private SubvencionRepository            subvencionRepo;
    @Autowired private PlenoRepository                 plenoRepo;
    @Autowired private ConvenioRepository              convenioRepo;
    @Autowired private ProcesoSelectivoRepository      procesoRepo;
    @Autowired private ExpedienteInfoPublicaRepository expedienteRepo;
    @Autowired private InformacionPublicaRepository    infoPublicaRepo;
    @Autowired private ConsultaPublicaRepository       consultaRepo;
    @Autowired private JuntaGobiernoRepository         juntaGobiernoRepo;

    @GetMapping
    public List<Noticia> getNoticias(
            @RequestParam(defaultValue = "24") int limit) {

        List<Noticia> todas = new ArrayList<>();

        // ---- Trámites ----
        tramiteRepo.findAll().forEach(t -> {
            // 1. Condición estricta: Solo los que en la columna 'tipo' ponga "TRAMITE" y estén "VIGENTE"
            if ("TRAMITE".equalsIgnoreCase(t.getTipo()) && "VIGENTE".equalsIgnoreCase(t.getEstado())) {

                // 2. Si a algún trámite se le olvidó poner la fecha en BD, le ponemos la de hoy para que aparezca sí o sí y no se pierda.
                java.time.LocalDate fechaAplicar = t.getFechaPublicacion() != null
                        ? t.getFechaPublicacion()
                        : java.time.LocalDate.now();

                todas.add(new Noticia(
                        t.getId(),
                        "tramite",  // ID del filtro para React (coincide con TIPO_CONFIG)
                        "Trámite",  // Etiqueta visual que se pinta en la tarjeta
                        t.getTitulo(),
                        stripHtml(t.getDescripcionHtml()),
                        fechaAplicar.atStartOfDay(),
                        t.getId().toString()
                ));
            }
        });

        // ---- Subvenciones ----
        subvencionRepo.findAll().forEach(s -> {
            if (s.getFechaSincronizacion() != null) {
                todas.add(new Noticia(
                        s.getId(), "subvencion", "Subvención",
                        s.getTitulo(), null,
                        s.getFechaSincronizacion(), s.getIdExternoSigem()
                ));
            }
        });

        // ---- Plenos ----
        plenoRepo.findAll().forEach(p -> {
            if (p.getFechaSincronizacion() != null) {
                todas.add(new Noticia(
                        p.getId(), "pleno", "Pleno",
                        p.getTitulo(), p.getDescripcion(),
                        p.getFechaSincronizacion(), p.getIdExternoSigem()
                ));
            }
        });

        // ---- Convenios ----
        convenioRepo.findAll().forEach(c -> {
            if (c.getFechaSincronizacion() != null) {
                todas.add(new Noticia(
                        c.getId(), "convenio", "Convenio",
                        c.getTitulo(), null,
                        c.getFechaSincronizacion(), c.getIdExternoSigem()
                ));
            }
        });

        // ---- Procesos selectivos ----
        procesoRepo.findAll().forEach(p -> {
            if (p.getFechaSincronizacion() != null) {
                todas.add(new Noticia(
                        p.getId(), "proceso", "Proceso selectivo",
                        p.getTitulo(), null,
                        p.getFechaSincronizacion(), p.getIdExternoSigem()
                ));
            }
        });

        // ---- Expedientes información pública ----
        expedienteRepo.findAll().forEach(e -> {
            if (e.getFechaSincronizacion() != null) {
                todas.add(new Noticia(
                        e.getId(), "expediente", "Información pública",
                        e.getTitulo(), null,
                        e.getFechaSincronizacion(), e.getIdExternoSigem()
                ));
            }
        });

        // ---- Información pública normativa ----
        infoPublicaRepo.findAll().forEach(i -> {
            if (i.getFechaSincronizacion() != null) {
                todas.add(new Noticia(
                        i.getId(), "info_publica", "Participación normativa",
                        i.getTitulo(), null,
                        i.getFechaSincronizacion(), i.getIdExternoSigem()
                ));
            }
        });

        // ---- Consultas públicas ----
        consultaRepo.findAll().forEach(c -> {
            if (c.getFechaSincronizacion() != null) {
                todas.add(new Noticia(
                        c.getId(), "consulta", "Consulta pública",
                        c.getTitulo(), null,
                        c.getFechaSincronizacion(), c.getIdExternoSigem()
                ));
            }
        });

        // ---- Juntas de Gobierno Local ----
        juntaGobiernoRepo.findAll().forEach(j -> {
            if (j.getFechaSincronizacion() != null) {
                todas.add(new Noticia(
                        j.getId(), "junta_gobierno", "Junta de Gobierno Local",
                        j.getTitulo(), j.getDescripcion(),
                        j.getFechaSincronizacion(), j.getIdExternoSigem()
                ));
            }
        });

        return todas.stream()
                .sorted(Comparator.comparing(Noticia::getFecha).reversed())
                .limit(limit)
                .collect(Collectors.toList());
    }

    private String stripHtml(String html) {
        if (html == null || html.isBlank()) return null;
        String texto = html.replaceAll("<[^>]+>", " ").replaceAll("\\s+", " ").trim();
        return texto.length() > 140 ? texto.substring(0, 140) + "…" : texto;
    }
}
