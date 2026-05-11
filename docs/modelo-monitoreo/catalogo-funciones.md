# Catálogo de funciones

## Objetivo

Lista funciones, helpers, fuentes, dominios y wrappers que pueden usarse como referencia al construir consultas, dashboards o validaciones de soporte.

## Funciones KQL frecuentes

| Función | Uso | Consideración |
| --- | --- | --- |
| `summarize` | Agrupar eventos, errores o ejecuciones. | Definir ventanas de tiempo explícitas. |
| `where` | Filtrar por producto, fuente, ambiente o severidad. | Evitar filtros ambiguos. |
| `extend` | Crear campos derivados para análisis. | Nombrar campos con claridad. |
| `join` | Cruzar trazas, ejecuciones o fuentes. | Validar cardinalidad antes de concluir impacto. |

## Helpers recomendados

- Normalizar nombres de ambiente antes de comparar.
- Convertir timestamps a la zona horaria operacional acordada.
- Separar errores técnicos de síntomas funcionales.
- Documentar umbrales usados por cada dashboard.

## Wrappers y dominios

Los wrappers deben esconder complejidad repetitiva, pero no deben ocultar criterios críticos de diagnóstico. Si una consulta encapsula reglas funcionales, el runbook asociado debe explicar qué valida y qué no valida.
