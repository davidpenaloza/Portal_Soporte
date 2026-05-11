# Arquitectura del modelo

## Propósito

La arquitectura del nuevo modelo de monitoreo ordena funciones, helpers, fuentes, dominios y wrappers para que soporte pueda diagnosticar con criterios comunes.

## Capas

| Capa | Responsabilidad | Ejemplos |
| --- | --- | --- |
| Fuentes | Normalizar datos base desde LAW u otras fuentes. | Eventos, ejecuciones, errores. |
| Helpers | Resolver transformaciones reutilizables. | Ambientes, severidades, ventanas. |
| Dominios | Agrupar lógica por producto o proceso. | Ingestas, procesamiento, aplicación. |
| Wrappers | Exponer consultas listas para dashboards. | Paneles Grafana, alertas, vistas ejecutivas. |

## Criterio operativo

Cada capa debe poder validarse de forma independiente antes de escalar. Si una falla se repite, se debe ajustar el wrapper, el helper o la documentación asociada.
