@echo off
echo Iniciando Nginx con configuracion HTTPS para Sede Electronica...
echo.

echo Verificando configuracion de nginx...
nginx-1.29.5\nginx-1.29.5\nginx.exe -p "%~dp0nginx-1.29.5\nginx-1.29.5" -c "%~dp0nginx-1.29.5\nginx-1.29.5\conf\nginx.conf" -t

if %ERRORLEVEL% EQU 0 (
    echo Configuracion correcta. Iniciando nginx...
    nginx-1.29.5\nginx-1.29.5\nginx.exe -p "%~dp0nginx-1.29.5\nginx-1.29.5" -c "%~dp0nginx-1.29.5\nginx-1.29.5\conf\nginx.conf"
    echo.
    echo Nginx iniciado correctamente!
    echo.
    echo Acceso a la aplicacion:
    echo   Frontend: https://localhost:8443/
    echo   Backend:  https://localhost:8443/api/
    echo.
    echo Para detener nginx: nginx-1.29.5\nginx-1.29.5\nginx.exe -s stop
    echo Para recargar:    nginx-1.29.5\nginx-1.29.5\nginx.exe -s reload
) else (
    echo ERROR: La configuracion de nginx tiene errores.
    echo Por favor, revisa el archivo nginx.conf
)

pause