# Portal de Soporte AMSA

Portal web estático para centralizar información operativa del equipo de Soporte Data & Analítica Avanzada, con foco en productos soportados, monitoreo, gestión de incidentes, escalamientos, runbooks y documentación interna.

## Objetivo

Centralizar en un único punto de consulta el modelo operativo de soporte, la información de productos, los criterios de monitoreo, los flujos de incidentes, la matriz de escalamiento, los runbooks, los enlaces documentales y los materiales de capacitación del equipo.

## Estado

Versión inicial en construcción. El portal funciona como una base editable y reutilizable que debe completarse con responsables, enlaces oficiales, runbooks definitivos, métricas reales y documentación validada por el equipo.

## Contenido actual

El archivo principal es `portal_soporte_amsa_html.html` e incluye las siguientes secciones:

- **Resumen ejecutivo:** métricas y estado general de la documentación de soporte.
- **Modelo operativo de soporte:** soporte preventivo, reactivo y mejora continua.
- **Productos soportados:** inventario inicial de productos, criticidad, responsables, horarios, dashboards y estado documental.
- **Monitoreo estándar por capas:** infraestructura, ingestas, procesamiento, aplicación, dominio y gestión.
- **Gestión de incidentes:** flujo operativo desde detección hasta cierre y aprendizaje.
- **Matriz de escalamiento:** niveles, criterios de severidad y responsables.
- **Runbooks operativos:** estructura base para documentar procedimientos de diagnóstico y resolución.
- **Repositorio documental:** links y referencias a documentación, dashboards, consultas, arquitectura y evidencias.
- **Gobierno, calidad y mejora continua:** lineamientos para mantener documentación, indicadores y controles.
- **Capacitación y onboarding:** ruta sugerida para nuevos integrantes del equipo.

## Funcionalidades

- Portal estático en un único archivo HTML, sin dependencias externas obligatorias.
- Diseño responsive con navegación lateral y barra superior.
- Buscador interno para filtrar secciones por texto.
- Modo edición para modificar contenido directamente desde el navegador.
- Guardado local en `localStorage` del navegador.
- Exportación e importación de respaldo en formato JSON.
- Botones para agregar filas en tablas operativas.
- Opción de impresión desde el navegador.

## Cómo usar

1. Abrir `portal_soporte_amsa_html.html` en un navegador moderno.
2. Usar el buscador para localizar información por producto, herramienta, proceso o concepto.
3. Activar el modo edición para actualizar textos, tablas y contenidos operativos.
4. Guardar los cambios localmente desde el portal.
5. Exportar un respaldo JSON cuando se requiera compartir o versionar el contenido editado.

## Recomendaciones de mantenimiento

- Reemplazar textos de ejemplo por información oficial y validada.
- Completar responsables funcionales y técnicos de cada producto.
- Versionar runbooks críticos y consultas KQL relevantes.
- Mantener actualizados dashboards, enlaces documentales y rutas de escalamiento.
- Revisar periódicamente métricas, incidentes repetidos y brechas de documentación.

## Estructura del repositorio

```text
.
├── README.md
└── portal_soporte_amsa_html.html
```

## Notas

Este portal está pensado para uso interno del equipo. La paleta visual y el contenido base deben ajustarse a los lineamientos corporativos, nombres oficiales, enlaces internos y políticas vigentes antes de publicarse o compartirse ampliamente.
