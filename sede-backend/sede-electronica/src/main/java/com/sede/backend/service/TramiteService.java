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
        respuesta.put("descripcion", tramite.getDescripcion()); // Aquí está tu descripción real
        respuesta.put("unidadTramitadora", tramite.getUnidadTramitadora());
        respuesta.put("tipo", tramite.getTipo());
        respuesta.put("documentos", documentoRepository.findByTramiteId(id));
        respuesta.put("normativas", normativaRepository.findByTramiteId(id));
        return respuesta;
    }

    public List<Tramite> obtenerTodos() {
        return tramiteRepository.findAll();
    }
    public List<Tramite> buscarTramites(String query, Long categoriaId, String tipo) {
        return tramiteRepository.searchByKeyword(query, categoriaId, tipo);
    }
}