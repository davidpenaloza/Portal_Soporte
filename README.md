# Portal de Soporte AMSA

Portal web estático para centralizar conocimiento operativo del equipo de **Soporte Data & Analítica Avanzada**. El sitio permite consultar productos digitales, fuentes soportadas, relaciones producto-fuente, ambientes, fases de soporte, monitoreo operativo, runbooks, escalamientos, documentación, links de interés, capacitaciones y control operativo del soporte.

## Objetivo del portal

Entregar una base de conocimiento versionada y publicable como sitio estático que permita al equipo:

- Consultar productos digitales soportados.
- Consultar fuentes tratadas como entidades operativas de soporte.
- Entender relaciones muchos-a-muchos entre productos y fuentes.
- Identificar ambientes técnicos: `PRD`, `UAT`, `STAGE` y `DEV`.
- Documentar estados o fases de soporte como `Follow`, `En toma de control`, `Soporte activo`, `Soporte parcial`, `Pendiente de traspaso`, `Sin soporte formal` y `Retirado`.
- Ubicar dashboards de Grafana, runbooks y rutas de escalamiento.
- Controlar pendientes documentales y mínimos de traspaso a soporte.

## Alcance y límites

El portal es una herramienta de soporte operativo. No reemplaza Grafana ni sistemas oficiales de gestión de tickets. Tampoco asigna al equipo responsabilidades sobre definición funcional del dato, validación oficial de información, propiedad de origen o políticas corporativas de información.

Grafana sigue siendo la fuente oficial para monitoreo en tiempo real. El portal documenta dónde mirar, qué dashboard usar, qué componente cubre, cómo interpretar OK/WARN/ALERT, qué revisar primero, qué runbook aplicar y a quién escalar.

## Conceptos principales

### Producto digital

Solución, aplicación, dashboard, backend, frontend o producto analítico soportado. Se modela en `data/productos.json` y puede consumir una o varias fuentes.

### Fuente

Origen de datos, sistema, API, archivo, PI System, SharePoint, storage, base de datos, proveedor o componente que alimenta productos. Algunas fuentes se tratan como entidades de soporte por sí mismas. Se modelan en `data/fuentes.json`.

### Relación producto-fuente

Vínculo muchos-a-muchos entre productos y fuentes. Un producto puede consumir muchas fuentes, y una fuente puede alimentar muchos productos. Se modela en `data/producto-fuente.json` para entender impacto, síntoma visible, validación inicial, runbook y escalamiento.

### Ambiente técnico

Los ambientes técnicos válidos son `PRD`, `UAT`, `STAGE` y `DEV`. `Follow` no es ambiente: es una fase o estado de soporte.

### Estado o fase de soporte

Valores esperados: `Follow`, `En toma de control`, `Soporte activo`, `Soporte parcial`, `Pendiente de traspaso`, `Sin soporte formal` y `Retirado`.

## Estructura del repositorio

```text
.
├── index.html
├── documento.html
├── assets/
│   ├── css/
│   │   ├── markdown.css
│   │   └── styles.css
│   ├── js/
│   │   ├── app.js
│   │   └── markdown-viewer.js
│   └── vendor/
│       ├── marked.min.js
│       └── purify.min.js
├── data/
│   ├── capacitaciones.json
│   ├── documentacion.json
│   ├── escalamientos.json
│   ├── fuentes.json
│   ├── links-interes.json
│   ├── modelo-operativo.json
│   ├── modelos-monitoreo.json
│   ├── monitoreo.json
│   ├── producto-fuente.json
│   ├── productos.json
│   └── runbooks.json
├── docs/
│   ├── estandar-monitoreo.md
│   ├── guia-mantencion-portal.md
│   ├── nuevo-modelo-monitoreo.md
│   ├── modelo-monitoreo/
│   │   ├── README.md
│   │   ├── catalogo-funciones.md
│   │   └── troubleshooting.md
│   ├── modelo-operativo.md
│   ├── necesidades-dolores-portal-soporte.md
│   └── traspaso-soporte.md
├── templates/
│   ├── documentacion.template.json
│   ├── escalamiento.template.json
│   ├── fuente.template.json
│   ├── monitoreo.template.json
│   ├── producto-fuente.template.json
│   ├── producto.template.json
│   └── runbook.template.json
├── scripts/
│   └── validate-static-portal.py
└── README.md
```

## Cómo probar localmente

El portal carga archivos JSON mediante `fetch`, por lo que se recomienda probarlo usando un servidor local en vez de abrir `index.html` directamente desde el sistema de archivos.

```bash
python3 -m http.server 8080
```

Luego abrir:

```text
http://localhost:8080
```

Para ejecutar una validación básica de estructura, rutas relativas, JSON, paleta AMSA y campos mínimos:

```bash
python3 scripts/validate-static-portal.py
```

## Visor interno de documentación Markdown

El portal incluye `documento.html`, una página estática para mostrar archivos Markdown con estilos consistentes con la identidad visual AMSA. En vez de enlazar directamente a un archivo `.md`, usar el visor con el parámetro `doc`:

```text
./documento.html?doc=docs/modelo-monitoreo/README.md
./documento.html?doc=docs/modelo-monitoreo/catalogo-funciones.md
./documento.html?doc=docs/modelo-monitoreo/troubleshooting.md
```

El visor:

- Solo permite rutas dentro de `docs/`.
- Bloquea segmentos inseguros como `../` y rutas absolutas.
- Carga el Markdown con `fetch()`, por lo que funciona en GitHub Pages o en cualquier servidor estático.
- Convierte Markdown a HTML usando utilidades locales en `assets/vendor/marked.min.js`.
- Sanitiza el HTML antes de insertarlo usando `assets/vendor/purify.min.js`.
- Genera automáticamente una tabla de contenidos con encabezados `h2` y `h3`.
- Mantiene un botón para abrir el Markdown original cuando sea necesario.

Las utilidades locales en `assets/vendor/` implementan la funcionalidad necesaria para este portal y evitan depender de CDN externos, `localhost`, SharePoint o backend.

### Cómo agregar nuevos documentos Markdown

1. Crear el archivo dentro de `docs/`, preferentemente en una subcarpeta temática como `docs/modelo-monitoreo/`.
2. Registrar el documento en `data/documentacion.json` usando `markdownUrl` y `viewerUrl`.
3. Si pertenece al modelo de monitoreo, registrarlo también en `data/modelos-monitoreo.json` con `titulo`, `archivo`, `descripcion`, `tipo`, `markdownUrl` y `viewerUrl`.
4. Enlazar siempre la experiencia principal con `viewerUrl`, por ejemplo `./documento.html?doc=docs/modelo-monitoreo/nuevo-documento.md`.
5. Reservar `markdownUrl` solo como respaldo para abrir el archivo crudo.

No se recomienda enlazar directamente a `.md` cuando se busca una experiencia visual profesional, porque el navegador muestra el archivo crudo fuera del diseño, navegación y estilos del portal.

## Compatibilidad con GitHub Pages

El portal mantiene rutas relativas como `./assets/css/styles.css`, `./assets/js/app.js`, `./documento.html?doc=docs/modelo-monitoreo/README.md` y `./data/productos.json`. No usa rutas absolutas que comiencen con `/`, no depende de `localhost`, no depende de SharePoint y no requiere backend.

## Paleta visual AMSA

El portal usa la paleta corporativa indicada para AMSA, declarada como variables CSS en `assets/css/styles.css`:

- Pantone 1795 C: `#C8102E`.
- Pantone 3145 C: `#008C95`.
- Pantone 325 C: `#009CA6`.
- Pantone 124 C: `#E5A823`.
- Pantone Cool Gray 10 C: `#63666A`.
- Negro de marca: `#000000`.


## Documento de necesidades y dolores

El documento `./documento.html?doc=docs/necesidades-dolores-portal-soporte.md` ordena las hipótesis iniciales sobre necesidades, dolores operativos, perfiles a entrevistar, preguntas sugeridas y criterios de éxito del portal. Este documento es un insumo para entrevistas futuras y debe actualizarse con hallazgos reales del levantamiento.

## Cómo agregar un producto

1. Abrir `data/productos.json`.
2. Usar `templates/producto.template.json` como referencia.
3. Crear un `id` único, por ejemplo `prod-nombre-corto`.
4. Completar ambientes disponibles, ambiente soportado, estado/fase de soporte, nivel, criticidad, responsables, dashboard, runbook y fuentes asociadas por ID.
5. Si consume fuentes, registrar también las relaciones en `data/producto-fuente.json`.

## Cómo agregar una fuente

1. Abrir `data/fuentes.json`.
2. Usar `templates/fuente.template.json` como referencia.
3. Crear un `id` único, por ejemplo `fte-sistema-origen`.
4. Completar tipo, faena, sistema origen, ambientes, estado/fase de soporte, responsables, frecuencia esperada, método de recepción, dashboard, runbook y productos consumidores por ID.
5. Registrar las relaciones producto-fuente correspondientes.

## Cómo asociar una fuente a productos

1. Abrir `data/producto-fuente.json`.
2. Usar `templates/producto-fuente.template.json` como referencia.
3. Crear una entrada por cada vínculo entre `productoId` y `fuenteId`.
4. Documentar ambiente, tipo de dependencia, criticidad de la relación, obligatoriedad, componente afectado, impacto si falla, síntoma visible, validación inicial, runbook y escalamiento.
5. Actualizar `fuentesAsociadas` en el producto y `productosConsumidores` en la fuente para mantener navegación cruzada.

## Cómo identificar impacto cruzado

Cuando falla una fuente:

1. Buscar la fuente en **Fuentes soportadas**.
2. Revisar `productosConsumidores`.
3. Abrir **Mapa producto-fuente** y filtrar por nombre de fuente.
4. Revisar `impactoSiFalla`, `sintomaVisible`, `dashboardDondeSeDetecta`, `validacionInicial`, `runbookAsociado` y `escalamiento`.
5. Escalar con evidencia mínima, indicando producto, fuente, ambiente, ventana afectada y síntoma observado.

## Cómo documentar ambientes y fase de soporte

- `ambientesDisponibles`: lista de ambientes donde existe la entidad.
- `ambienteSoportado`: ambiente donde el equipo presta soporte.
- `estadoSoporte` y `faseSoporte`: fase operativa de soporte; no deben mezclarse con ambiente técnico.
- `Follow` debe registrarse como fase, nunca como ambiente.

## Cómo actualizar monitoreo operativo

1. Revisar `./documento.html?doc=docs/modelo-monitoreo/README.md` o `./documento.html?doc=docs/nuevo-modelo-monitoreo.md` para clasificar el síntoma en las capas de infraestructura, ingestas, procesamiento, aplicación, dominio o gestión.
2. Abrir `data/monitoreo.json` y, si corresponde, `data/modelos-monitoreo.json`.
3. Usar `templates/monitoreo.template.json` como referencia.
4. Documentar dónde mirar en Grafana, qué componente cubre, qué revisar primero, criterios OK/WARN/ALERT, runbook y responsable.
5. No copiar estados en tiempo real, últimas ejecuciones, errores vivos ni métricas dinámicas al portal.

## Cómo agregar runbooks

Los runbooks soportan tres niveles:

- `Transversal`: aplica a clasificación inicial o procesos comunes.
- `Producto`: aplica a un producto digital específico.
- `Fuente`: aplica a una fuente específica.

Para agregar uno, usar `templates/runbook.template.json` y completar `tipoRunbook`, `productoId`, `fuenteId`, ambiente, pasos y evidencia mínima.

## Cómo agregar escalamientos

La matriz permite escalar por `Producto`, `Fuente` o `Relación producto-fuente`. Usar `templates/escalamiento.template.json` y completar tipo de entidad, producto/fuente si aplica, ambiente, faena, síntoma, diagnóstico inicial, evidencia mínima, equipo, canal, cuándo escalar y cuándo no escalar todavía.

## Control operativo del soporte

La vista **Control operativo del soporte** muestra indicadores documentales sobre:

- Productos en Follow.
- Productos en toma de control.
- Productos con soporte activo.
- Productos sin runbook.
- Productos sin matriz de escalamiento.
- Productos sin dashboard documentado.
- Fuentes sin runbook.
- Fuentes sin responsable definido.
- Checklist mínimo de traspaso a soporte.
- Cómo solicitar cambios al portal.

## Buenas prácticas de mantención

- Mantener todos los cambios de contenido versionados en Git.
- Validar sintaxis JSON antes de publicar.
- Ejecutar `python3 scripts/validate-static-portal.py` antes de solicitar revisión.
- No incluir secretos, tokens, credenciales, cadenas de conexión, suscripciones completas, rutas sensibles ni datos productivos innecesarios.
- Preferir roles, equipos y descripciones operativas por sobre datos personales.
- Mantener actualizados responsables, ambientes, fases de soporte, relaciones producto-fuente, runbooks, dashboards y escalamientos.
- Revisar el portal en móvil y escritorio antes de publicar cambios relevantes.
