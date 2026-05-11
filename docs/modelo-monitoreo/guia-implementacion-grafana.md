# Guía de implementación en Grafana

## Objetivo

Explicar cómo consumir el modelo de monitoreo desde dashboards y paneles Grafana manteniendo criterios visuales y operativos consistentes.

## Diseño de paneles

- Mostrar estado general OK / WARN / ALERT.
- Separar salud técnica, ingestas, procesamiento y dominio.
- Incluir enlaces a runbooks o documentación del portal.
- Evitar exponer secretos, rutas internas o identificadores sensibles.

## Validación antes de publicar

1. Confirmar que la consulta usa wrappers documentados.
2. Validar ventanas de tiempo y filtros de ambiente.
3. Revisar que umbrales coincidan con criterios operativos.
4. Probar comportamiento sin datos y con errores conocidos.
