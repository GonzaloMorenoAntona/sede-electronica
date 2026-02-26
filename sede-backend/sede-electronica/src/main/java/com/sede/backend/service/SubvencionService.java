package com.sede.backend.service;


import com.sede.backend.model.Subvencion;
import com.sede.backend.repository.SubvencionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SubvencionService {

    @Autowired
    private SubvencionRepository repository;

    public List<Subvencion> listarTodas() {
        // Aquí podrías añadir lógica extra en el futuro (ej: solo las vigentes)
        return repository.findAll();
    }
}