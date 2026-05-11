# Troubleshooting del modelo de monitoreo

## Flujo rápido

1. Identificar producto, fuente, ambiente y ventana afectada.
2. Ubicar la capa inicial del síntoma.
3. Revisar dashboard, logs y runbook asociado.
4. Confirmar si el impacto es técnico, funcional o documental.
5. Resolver o escalar con evidencia mínima.

## Síntomas comunes

| Síntoma | Primera revisión | Acción sugerida |
| --- | --- | --- |
| Dashboard sin datos | Ingestas y procesamiento. | Validar última ejecución y fuente obligatoria. |
| API lenta | Aplicación e infraestructura. | Revisar trazas, latencia y recursos. |
| KPI inconsistente | Dominio e ingestas. | Comparar regla funcional, muestra y ventana. |
| Alerta repetida | Gestión y capa de origen. | Ajustar umbral, runbook o escalamiento. |

## Escalamiento

> Escalar solo después de registrar evidencia mínima: producto, fuente, ambiente, ventana afectada, síntoma, dashboard revisado y runbook aplicado.

## Cierre

Cada incidente cerrado debe indicar causa probable, acción ejecutada, evidencia y si corresponde actualizar documentación, alerta o matriz de escalamiento.
