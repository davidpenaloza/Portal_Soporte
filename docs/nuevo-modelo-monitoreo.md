# Nuevo modelo de monitoreo por capas

## Objetivo

Integrar en el portal la documentación base del nuevo modelo de monitoreo para soporte. El modelo ordena las revisiones en capas, evita mezclar estados vivos con documentación estática y define qué evidencia debe revisar el equipo antes de diagnosticar, resolver o escalar.

## Alcance dentro del portal

El portal mantiene el conocimiento operativo del modelo:

- Qué capa revisar según el síntoma observado.
- Qué herramientas o evidencias consultar.
- Qué criterios usar para interpretar señales OK / WARN / ALERT.
- Qué runbook o ruta de escalamiento aplicar.
- Qué brechas documentales deben quedar visibles para mejora continua.

Los estados vivos, métricas actuales, últimas ejecuciones y errores recientes deben validarse en Grafana, Azure Monitor, Log Analytics Workspace, ITSM u otras fuentes oficiales de operación.

## Capas del modelo

| Capa | Propósito | Evidencias o herramientas sugeridas |
| --- | --- | --- |
| Infraestructura | Revisar disponibilidad de recursos Azure, consumo, límites, permisos y errores de plataforma. | Azure Monitor, Grafana, Log Analytics Workspace. |
| Ingestas | Confirmar ejecución esperada versus real, archivos recibidos, latencia, frecuencia, fallas y reprocesos. | Grafana, ADF u orquestadores, logs de integración. |
| Procesamiento | Analizar ADF, Databricks, Container Apps Jobs, microservicios, tiempos de ejecución y errores técnicos. | Azure Data Factory, Databricks, Container Apps Jobs, KQL. |
| Aplicación | Verificar APIs, backend, frontend, disponibilidad, tiempos de respuesta, trazas y errores visibles para usuarios. | Application Insights, Grafana, logs de aplicación. |
| Dominio | Validar KPIs, reglas de negocio, datos esperados, consistencia, freshness y completitud funcional. | Dashboards funcionales, validaciones de datos, runbooks por producto. |
| Gestión | Medir soporte, incidentes, cumplimiento, tiempos de atención, brechas y mejora continua. | ITSM, tablero de control operativo, matriz de escalamiento. |

## Checklist mínimo para dashboard estándar

Cada dashboard o referencia de observabilidad documentada en `data/monitoreo.json` debe cubrir, cuando aplique:

1. Estado general del producto o fuente.
2. Última ejecución correcta y ventana esperada de actualización.
3. Errores recientes por componente, severidad, origen y trazabilidad.
4. Validaciones de datos de negocio: completitud, frescura, consistencia y disponibilidad.
5. Runbook asociado y responsable del seguimiento.
6. Ruta de escalamiento con evidencia mínima requerida.

## Criterio de uso operativo

1. Partir por la capa donde aparece el síntoma.
2. Confirmar si el impacto está acotado a producto, fuente o relación producto-fuente.
3. Revisar el catálogo de monitoreo para ubicar dashboard, componentes, criterios OK / WARN / ALERT y runbook.
4. Si la evidencia no permite resolver, escalar con producto, fuente, ambiente, ventana afectada, síntoma observado y capturas o referencias oficiales.
5. Cerrar actualizando el runbook, el catálogo de monitoreo o la matriz de escalamiento si se detecta una brecha documental.
