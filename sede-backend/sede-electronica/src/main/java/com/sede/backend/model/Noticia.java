package com.sede.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class Noticia {
    private Long    id;
    private String  tipo;       // tramite | subvencion | pleno | convenio | proceso | expediente | info_publica | consulta
    private String  categoria;  // nombre legible para badge y filtro
    private String  titulo;
    private String  descripcion; // puede ser null
    private LocalDateTime fecha;
    private String  idExterno;
}
