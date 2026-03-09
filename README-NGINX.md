# Nginx Configuration for Sede Electrónica
## Configuración de Nginx para HTTPS local

### Requisitos previos
1. Tener nginx instalado en Windows
2. Spring Boot corriendo en puerto 8080
3. React corriendo en puerto 3000
4. Certificados SSL: wildcard-ciudadreal-es.crt y wildcard-ciudadreal-es.key

### Archivos necesarios
- `nginx.conf` - Configuración principal de nginx
- `wildcard-ciudadreal-es.crt` - Certificado SSL
- `wildcard-ciudadreal-es.key` - Clave privada del certificado

### Configuración creada
El archivo `nginx.conf` incluye:
- **HTTPS en puerto 443** con certificados SSL
- **Frontend React** en `/` → `http://localhost:3000`
- **Backend Spring Boot** en `/api/` → `http://localhost:8080/`
- **Redirección HTTP a HTTPS** (puerto 80 → 443)
- **CORS headers** para el backend
- **Soporte para React Router** con fallback
- **Compresión gzip** y caché de assets estáticos
- **Security headers** recomendados

### Cómo usar
1. Asegúrate de que nginx esté instalado
2. Copia `nginx.conf` al directorio de configuración de nginx
3. Inicia nginx: `nginx.exe`
4. Accede a tu app en: `https://localhost`

### Comandos útiles
```bash
# Iniciar nginx
nginx.exe

# Detener nginx
nginx.exe -s stop

# Recargar configuración
nginx.exe -s reload

# Verificar configuración
nginx.exe -t
```

### Estructura de URLs
- `https://localhost/` → Frontend React
- `https://localhost/api/` → Backend Spring Boot
- `http://localhost/` → Redirige a HTTPS
