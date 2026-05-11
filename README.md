# Portal de Soporte AMSA

Portal web estático para centralizar información operativa del equipo de **Soporte Data & Analítica Avanzada**. El sitio está diseñado para consultar productos soportados, modelo operativo, catálogo de monitoreo, runbooks, escalamientos, documentación, links de interés y capacitaciones desde archivos versionados en el repositorio.

## Objetivo del portal

Entregar un punto único de consulta, mantenible y publicable como sitio estático, que permita al equipo:

- Consultar el inventario de productos soportados.
- Revisar el modelo operativo de soporte.
- Consultar el catálogo de monitoreo y observabilidad como complemento de Grafana.
- Acceder a runbooks y criterios de escalamiento.
- Mantener documentación y links de interés ordenados.
- Facilitar onboarding y capacitaciones internas.
- Versionar cambios de contenido mediante JSON y Markdown.

## Estado

Versión inicial refactorizada como proyecto web estático. El portal ya separa HTML, CSS, JavaScript y contenido, pero los datos incluidos son ejemplos realistas y deben ser reemplazados o complementados con información validada por el equipo antes de su publicación interna.

## Estructura del repositorio

```text
.
├── index.html
├── assets/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── app.js
├── data/
│   ├── capacitaciones.json
│   ├── documentacion.json
│   ├── escalamientos.json
│   ├── links-interes.json
│   ├── modelo-operativo.json
│   ├── monitoreo.json
│   ├── productos.json
│   └── runbooks.json
├── docs/
│   ├── estandar-monitoreo.md
│   ├── guia-mantencion-portal.md
│   ├── modelo-operativo.md
│   └── traspaso-soporte.md
├── templates/
│   ├── documentacion.template.json
│   ├── escalamiento.template.json
│   ├── producto.template.json
│   └── runbook.template.json
└── README.md
```

## Cómo probar localmente

El portal carga archivos JSON mediante `fetch`, por lo que se recomienda probarlo usando un servidor local en vez de abrir `index.html` directamente desde el sistema de archivos.

Desde la raíz del repositorio:

```bash
python3 -m http.server 8080
```

Luego abrir:

```text
http://localhost:8080
```

También se puede usar cualquier servidor estático equivalente, por ejemplo extensiones de editor, `npx serve` o un hosting estático corporativo.



## Relación con Grafana

Grafana es la fuente oficial para monitoreo en tiempo real, estados actuales, últimas ejecuciones, errores recientes y métricas operacionales dinámicas. El portal no debe reemplazar ni duplicar esos datos.

El portal cumple un rol complementario como fuente de conocimiento operativo:

- Indica qué dashboard revisar por producto.
- Explica el objetivo de cada dashboard y sus componentes monitoreados.
- Documenta qué revisar primero ante alertas o tickets.
- Mantiene criterios interpretativos OK / WARN / ALERT como guía, no como estado vivo.
- Vincula runbooks, responsables y rutas de escalamiento.

No se deben agregar al portal capturas, métricas copiadas manualmente, estados actuales ni valores que queden obsoletos frente a Grafana.

## Consideraciones para SharePoint

El portal está preparado para publicarse desde GitHub Pages o desde una biblioteca de documentos de SharePoint siempre que se mantenga la estructura de carpetas junto a `index.html`. Las referencias de ejecución usan rutas relativas al archivo `index.html`, por ejemplo `./assets/css/styles.css`, `./assets/js/app.js` y `./data/productos.json`.

Para evitar errores de carga:

- Subir `index.html`, `assets/`, `data/`, `docs/` y `templates/` al mismo nivel dentro de la biblioteca.
- No cambiar los nombres de carpetas sin actualizar las referencias en `index.html`, `assets/js/app.js` y los JSON correspondientes.
- Evitar rutas absolutas como `/data/productos.json` o URLs dependientes de un dominio específico.
- Verificar que SharePoint permita descargar archivos `.json`, `.css` y `.js` desde la ubicación publicada.

## Cómo agregar productos

1. Abrir `data/productos.json`.
2. Copiar la estructura de `templates/producto.template.json`.
3. Agregar un nuevo objeto al arreglo JSON.
4. Completar campos como nombre, criticidad, dueño funcional, responsable técnico, horario, referencia al dashboard principal, runbook, estado documental y descripción.
5. Validar que el JSON siga siendo válido.

Ejemplo de campos obligatorios:

- `nombre`
- `criticidad`
- `duenoFuncional`
- `responsableTecnico`
- `horario`
- `dashboard`
- `runbook`
- `estadoDocumentacion`
- `descripcion`


## Cómo actualizar el catálogo de monitoreo

1. Abrir `data/monitoreo.json`.
2. Agregar una entrada por producto o dashboard relevante.
3. Completar dashboard principal, objetivo, componentes monitoreados, qué revisar primero, frecuencia esperada, criterios OK / WARN / ALERT, runbook asociado, responsable, link a Grafana y observaciones.
4. Usar links a Grafana sin tokens, credenciales, parámetros sensibles ni rutas internas innecesarias.
5. Recordar que los criterios son guías interpretativas; el estado real se valida en Grafana.

## Cómo agregar runbooks

1. Abrir `data/runbooks.json`.
2. Usar `templates/runbook.template.json` como referencia.
3. Definir un `id` único y estable, por ejemplo `runbook-producto-evento`.
4. Asociar el runbook al producto correspondiente.
5. Completar objetivo, severidad sugerida, pasos operativos, evidencia mínima y estado.
6. Si el runbook requiere explicación extendida, crear un documento Markdown en `docs/` y enlazarlo desde la documentación.

## Cómo agregar escalamientos

1. Abrir `data/escalamientos.json`.
2. Usar `templates/escalamiento.template.json` como base.
3. Agregar el nivel o criterio requerido.
4. Describir la condición que activa el escalamiento, el tiempo objetivo, el responsable y la salida esperada.
5. Evitar nombres personales si no son necesarios; preferir roles o equipos.

## Cómo agregar documentación

1. Crear o actualizar un archivo Markdown en `docs/`.
2. Abrir `data/documentacion.json`.
3. Usar `templates/documentacion.template.json` como referencia.
4. Registrar título, tipo, URL relativa, descripción y estado.
5. Probar el link desde el portal.

## Cómo agregar links de interés

1. Abrir `data/links-interes.json`.
2. Agregar un objeto con `nombre`, `categoria`, `descripcion` y `url`.
3. Usar referencias genéricas o públicas cuando sea posible.
4. No incluir URLs con tokens, credenciales, identificadores sensibles o rutas productivas privadas.

## Cómo agregar capacitaciones

1. Abrir `data/capacitaciones.json`.
2. Agregar módulo, audiencia, duración, objetivo y actividades.
3. Mantener una orientación práctica: contexto, herramientas, diagnóstico, runbooks, escalamientos y cierre de incidentes.

## Buenas prácticas de mantención

- Mantener todos los cambios de contenido versionados en Git.
- Validar sintaxis JSON antes de publicar.
- No incluir secretos, tokens, credenciales, cadenas de conexión ni datos productivos sensibles.
- Preferir roles, equipos y descripciones operativas por sobre datos personales.
- Mantener actualizados responsables, criticidades, horarios, referencias a dashboards, catálogo de monitoreo y rutas de escalamiento.
- Revisar runbooks después de incidentes relevantes o cambios de arquitectura.
- Usar Markdown en `docs/` para guías extensas y JSON en `data/` para contenido estructurado.
- Revisar el portal en móvil y escritorio antes de publicar cambios relevantes.

## Recomendaciones de publicación como sitio estático

El portal puede publicarse en cualquier plataforma que sirva archivos estáticos, por ejemplo:

- GitHub Pages o GitLab Pages.
- Azure Static Web Apps.
- Azure Storage Static Website.
- Servidor web interno corporativo.
- Intranet o repositorio documental con soporte para HTML, CSS, JS y JSON.

Recomendaciones antes de publicar:

- Configurar revisión de cambios mediante pull request.
- Validar JSON en CI/CD si la plataforma lo permite.
- Definir responsables de contenido por dominio.
- Publicar solo información aprobada para uso interno.
- Evitar indexar el sitio públicamente si contiene información operacional interna.

## Notas de seguridad

Los datos incluidos en este repositorio son ejemplos sin secretos ni credenciales. Antes de agregar contenido real, revisar que no se incluyan suscripciones completas, rutas sensibles, tokens, llaves, nombres de recursos críticos o datos productivos innecesarios.
