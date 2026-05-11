# Modelo operativo de soporte

## Propósito

Definir una forma común de operar el soporte de productos digitales, fuentes y relaciones producto-fuente de Data & Analítica Avanzada, manteniendo continuidad operacional, trazabilidad y aprendizaje continuo.

## Conceptos principales

- **Producto digital:** solución, aplicación, dashboard, backend, frontend o producto analítico soportado.
- **Fuente:** origen de datos, sistema, API, archivo, PI System, SharePoint, storage, base de datos, proveedor o componente que alimenta productos.
- **Relación producto-fuente:** vínculo muchos-a-muchos que indica qué productos consumen una fuente, qué impacto tiene una falla y cómo actuar.
- **Ambiente técnico:** PRD, UAT, STAGE o DEV.
- **Fase o estado de soporte:** Follow, En toma de control, Soporte activo, Soporte parcial, Pendiente de traspaso, Sin soporte formal o Retirado.

> Follow no es un ambiente técnico; es una fase de soporte.

## Alcance

El equipo mantiene conocimiento operativo, rutas de diagnóstico, runbooks, matriz de escalamiento, referencias a dashboards y control documental del soporte.

## Fuera de alcance

El portal no asigna al equipo responsabilidades de definición funcional del dato, validación oficial de información, propiedad de origen ni administración de políticas corporativas de información. Las definiciones funcionales corresponden a las contrapartes designadas.

## Roles mínimos

- **Soporte N1:** clasificación inicial, revisión de dashboards, aplicación de runbooks y registro de evidencia.
- **Soporte N2 / especialista:** diagnóstico técnico profundo, validación de componentes y definición de workaround operativo.
- **Desarrollo / plataforma / integración:** corrección de defectos, cambios de infraestructura, integraciones o despliegues.
- **Contraparte funcional:** priorización, validación de impacto de negocio y aceptación de cierre.

## Cadencias sugeridas

- Revisión periódica de productos y fuentes con soporte activo.
- Revisión semanal de productos en Follow o toma de control.
- Revisión mensual de relaciones producto-fuente, responsables, runbooks y dashboards documentados.
