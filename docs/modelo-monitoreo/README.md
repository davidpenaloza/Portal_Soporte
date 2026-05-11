# Modelo de monitoreo

## Propósito

Este documento resume el modelo de monitoreo usado por el portal de soporte para orientar diagnóstico preventivo y reactivo sin reemplazar herramientas de observabilidad en tiempo real.

## Principios operativos

- Grafana y las herramientas cloud son la fuente oficial para estados vivos.
- El portal explica dónde mirar, cómo interpretar señales y qué runbook aplicar.
- Todo hallazgo recurrente debe cerrar con una mejora documental o una acción preventiva.

## Documentos del modelo

| Documento | Uso principal |
| --- | --- |
| Arquitectura del modelo | Estructura general de capas, funciones, helpers, dominios y wrappers. |
| Catálogo de funciones | Inventario explicativo de funciones KQL, helpers, fuentes, dominios y wrappers. |
| Convenciones de nombrado | Estándares de nombres para funciones, wrappers, productos, fuentes y dominios. |
| Estándar de funciones KQL | Buenas prácticas y estructura esperada para funciones KQL. |
| Guía de implementación en Grafana | Consumo del modelo desde dashboards y paneles. |
| Guía de implementación en LAW | Implementación y validación en Log Analytics Workspace. |
| Guía para nuevo producto | Incorporación de nuevos productos al modelo. |
| Traspaso a soporte | Información necesaria para operar y diagnosticar. |
| Troubleshooting | Errores frecuentes, causas probables y pasos de diagnóstico. |

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
