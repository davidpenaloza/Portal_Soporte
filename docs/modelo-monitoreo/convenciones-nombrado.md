# Convenciones de nombrado

## Objetivo

Definir nombres consistentes para funciones, helpers, wrappers, productos, fuentes y dominios del modelo de monitoreo.

## Convención sugerida

| Elemento | Patrón | Ejemplo |
| --- | --- | --- |
| Fuente | `src_<dominio>_<origen>` | `src_ingestas_adf` |
| Helper | `hlp_<accion>` | `hlp_normalizar_ambiente` |
| Dominio | `dmn_<producto>_<proceso>` | `dmn_ada_ingestas` |
| Wrapper | `vw_<producto>_<panel>` | `vw_ada_salud_operacional` |

## Buenas prácticas

- Usar nombres descriptivos y estables.
- Evitar siglas no documentadas.
- Mantener consistencia entre LAW, Grafana y runbooks.
- Documentar cada cambio que pueda afectar dashboards o alertas.
