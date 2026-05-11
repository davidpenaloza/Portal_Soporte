# Modelo de monitoreo

## Propósito

Este documento resume el modelo de monitoreo usado por el portal de soporte para orientar diagnóstico preventivo y reactivo sin reemplazar herramientas de observabilidad en tiempo real.

## Principios operativos

- Grafana y las herramientas cloud son la fuente oficial para estados vivos.
- El portal explica dónde mirar, cómo interpretar señales y qué runbook aplicar.
- Todo hallazgo recurrente debe cerrar con una mejora documental o una acción preventiva.

## Capas de revisión

| Capa | Uso principal | Evidencia mínima |
| --- | --- | --- |
| Infraestructura | Salud de recursos, permisos, límites y plataforma. | Alertas Azure, métricas base, errores de servicio. |
| Ingestas | Llegada de datos, latencia, frecuencia y reprocesos. | Última ejecución, ventana esperada, fuente afectada. |
| Procesamiento | Orquestadores, jobs, transformaciones y servicios. | Logs, identificador de ejecución, componente fallido. |
| Aplicación | APIs, backend, frontend y experiencia de usuario. | Trazas, respuesta, endpoint o pantalla afectada. |
| Dominio | Reglas de negocio, consistencia y completitud. | KPI afectado, regla esperada, muestra de datos. |
| Gestión | Incidentes, cumplimiento, brechas y mejora continua. | Ticket, responsable, tiempos y acción preventiva. |

## Uso recomendado

1. Partir por la capa donde aparece el síntoma.
2. Confirmar si el impacto afecta producto, fuente o relación producto-fuente.
3. Revisar el dashboard documentado y el runbook asociado.
4. Escalar con evidencia mínima si no existe resolución directa.
5. Actualizar el portal si se detecta una brecha documental.
