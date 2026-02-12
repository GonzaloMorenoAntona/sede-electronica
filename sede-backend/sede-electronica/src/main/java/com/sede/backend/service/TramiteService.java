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
        respuesta.put("informacion", tramite);
        respuesta.put("documentos", documentoRepository.findByTramiteId(id));
        respuesta.put("normativas", normativaRepository.findByTramiteId(id));
        return respuesta;
    }
    public List<Tramite> obtenerTodos() {
        return tramiteRepository.findAll();
    }
    public List<Tramite> buscarTramites(String query) {
        return tramiteRepository.searchByKeyword(query);
    }
}