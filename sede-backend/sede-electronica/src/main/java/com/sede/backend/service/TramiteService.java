package com.sede.backend.service;

import com.sede.backend.model.*;
import com.sede.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class TramiteService {

    @Autowired
    private TramiteRepository tramiteRepository;
    @Autowired
    private DocumentoRepository documentoRepository;
    @Autowired
    private NormativaRepository normativaRepository;
    public Map<String, Object> getDetalleCompleto(Long id) {
        Tramite tramite = tramiteRepository.findById(id).orElse(null);
        if (tramite == null) return null;

        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("id", tramite.getId());
        respuesta.put("titulo", tramite.getTitulo());
        respuesta.put("descripcionHtml", tramite.getDescripcionHtml());
        respuesta.put("tipo", tramite.getTipo());
        respuesta.put("fechaPublicacion", tramite.getFechaPublicacion());
        respuesta.put("estado", tramite.getEstado());
        respuesta.put("enlacesJson", tramite.getEnlacesJson());
        respuesta.put("urlExterna", tramite.getUrlExterna());
        respuesta.put("esEnlaceExterno", tramite.getEsEnlaceExterno());
        respuesta.put("documentos", documentoRepository.findByTramiteId(id));
        respuesta.put("normativas", normativaRepository.findByTramiteId(id));
        return respuesta;
    }

    public List<Tramite> obtenerTodos() {
        return tramiteRepository.findAll();
    }
    public List<Tramite> buscar(String keyword, List<Long> categoriaIds) {
        return tramiteRepository.buscarConFiltros(
                keyword != null && !keyword.isBlank() ? keyword : null,
                categoriaIds
        );
    }
    public List<Tramite> obtenerPorCategoria(Long categoriaId) {
        return tramiteRepository.findByCategoriaIdOrderByTituloAsc(categoriaId);
    }
    public Optional<Tramite> obtenerPorId(Long id) {
        return tramiteRepository.findById(id);
    }
}