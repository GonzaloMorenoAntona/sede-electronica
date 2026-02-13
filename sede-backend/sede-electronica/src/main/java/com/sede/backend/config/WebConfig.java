package com.tu_proyecto.sede.config; // <--- ¡OJO! Ajusta esto a tu paquete real

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                // Aquí autorizamos al puerto de React (Frontend)
                .allowedOrigins("http://localhost:3000")
                // Qué acciones permitimos (Leer, Crear, Editar, Borrar)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                // Permitimos cualquier cabecera (Tokens, etc.)
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}