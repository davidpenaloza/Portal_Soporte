# Estándar de funciones KQL

## Propósito

Definir buenas prácticas para construir funciones KQL reutilizables, legibles y mantenibles para monitoreo operacional.

## Estructura mínima

1. Comentario de objetivo.
2. Parámetros esperados.
3. Filtros de tiempo explícitos.
4. Normalización de ambiente y producto.
5. Salida con nombres de columnas consistentes.

## Ejemplo referencial

```kql
let ventana = 2h;
TablaEventos
| where TimeGenerated > ago(ventana)
| summarize total=count() by Producto, Ambiente, Severidad
```

## Criterios de calidad

- Evitar lógica duplicada.
- Usar helpers para transformaciones repetidas.
- Validar cardinalidad antes de usar `join`.
- Mantener compatibilidad con dashboards y alertas existentes.
