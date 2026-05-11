# Catálogo de monitoreo y observabilidad

## Objetivo

Describir cómo el equipo de soporte debe usar los dashboards de Grafana y otras fuentes de observabilidad como mapa de diagnóstico. Este documento no reemplaza Grafana ni debe duplicar estados dinámicos de productos o fuentes.

## Principio operativo

- **Grafana es la fuente oficial para monitoreo en tiempo real.**
- **El portal es la fuente de conocimiento operativo:** explica dónde mirar, qué significa cada dashboard, qué revisar primero y qué runbook aplicar.
- No registrar manualmente estados actuales, últimas ejecuciones ni errores vivos dentro del portal.

## Relación con el nuevo modelo de monitoreo

El catálogo de monitoreo se interpreta usando el [nuevo modelo de monitoreo por capas](./nuevo-modelo-monitoreo.md). Cada entrada de `data/monitoreo.json` debe indicar qué producto, fuente o componente se revisa, mientras que el modelo por capas define el orden de diagnóstico: infraestructura, ingestas, procesamiento, aplicación, dominio y gestión.

## Información mínima por dashboard

Cada entrada del catálogo de monitoreo debe mantener:

- Producto o fuente asociada.
- Dashboard principal o panel de referencia.
- Objetivo del dashboard.
- Componente cubierto.
- Qué revisar primero ante una alerta o ticket.
- Frecuencia esperada de revisión documental.
- Criterios interpretativos OK / WARN / ALERT.
- Runbook asociado.
- Responsable del seguimiento.
- Link a Grafana.
- Observaciones operativas.

## Criterios interpretativos

Los criterios OK / WARN / ALERT son guías documentales para orientar el diagnóstico. La validación del estado real debe hacerse directamente en Grafana, logs, herramientas cloud o sistemas oficiales de gestión.

## Buenas prácticas

- Mantener links a dashboards sin tokens, credenciales ni parámetros sensibles.
- Documentar el significado de paneles y alertas, no copiar métricas en vivo.
- Revisar el catálogo cuando cambien dashboards, alertas, productos, fuentes o runbooks.
- Asociar cada alerta recurrente a un runbook o ruta de escalamiento.
