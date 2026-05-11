# Estándar de monitoreo

## Objetivo

Establecer un marco mínimo de observabilidad para productos soportados por Data & Analítica Avanzada.

## Capas mínimas

1. **Infraestructura:** disponibilidad, capacidad, permisos, errores de plataforma y límites.
2. **Ingestas:** recepción esperada, latencia, frecuencia, archivos o eventos faltantes.
3. **Procesamiento:** pipelines, jobs, notebooks, contenedores, duración y errores.
4. **Aplicación:** APIs, frontend, backend, trazas y tiempos de respuesta.
5. **Dominio:** frescura, completitud, consistencia y reglas funcionales.
6. **Gestión:** tickets, tiempos de atención, incidentes repetidos y brechas de documentación.

## Indicadores recomendados

- Estado general del producto: OK, WARN o ALERT.
- Última ejecución correcta.
- Latencia frente a frecuencia esperada.
- Errores recientes por componente.
- Validaciones de completitud y frescura.
- Incidentes abiertos y repetidos.

## Buenas prácticas

- Evitar dashboards con rutas sensibles, secretos o identificadores productivos innecesarios.
- Documentar consultas críticas en repositorio.
- Definir umbrales con responsables funcionales y técnicos.
- Revisar alertas ruidosas y ajustar umbrales con evidencia.
