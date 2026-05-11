# Guía de implementación en LAW

## Objetivo

Explicar cómo implementar y validar funciones del modelo en Log Analytics Workspace sin acoplar el portal a un workspace específico.

## Pasos recomendados

1. Crear o actualizar funciones KQL siguiendo el estándar.
2. Validar resultados con ventanas pequeñas y amplias.
3. Confirmar que las columnas esperadas existan para Grafana.
4. Registrar cambios relevantes en la documentación del modelo.

## Consideraciones

- No documentar IDs productivos sensibles.
- Usar nombres genéricos cuando el detalle real sea confidencial.
- Mantener trazabilidad entre función, dashboard y runbook.
