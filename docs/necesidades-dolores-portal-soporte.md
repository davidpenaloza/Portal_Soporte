# Necesidades y dolores operativos que aborda el Portal de Soporte

## 1. Propósito del documento

Este documento busca ordenar las hipótesis iniciales sobre necesidades, dolores operativos y oportunidades que el Portal de Soporte podría resolver para el equipo de Soporte Data & Analítica Avanzada. Su contenido debe entenderse como un insumo de trabajo para futuras entrevistas de levantamiento con usuarios, analistas y equipos relacionados.

Las necesidades y dolores descritos no deben considerarse conclusiones definitivas. Están planteados como hipótesis iniciales **por validar en entrevistas**, con el objetivo de orientar conversaciones, priorizar funcionalidades y ajustar el portal a necesidades reales de operación.

## 2. Contexto

El equipo de Soporte DAA trabaja con un ecosistema operativo compuesto por múltiples entidades y dependencias, entre ellas:

- productos digitales soportados;
- fuentes de datos por faena;
- relaciones muchos-a-muchos entre productos y fuentes;
- ambientes técnicos `PRD`, `UAT`, `STAGE` y `DEV`;
- estados o fases de soporte como `Follow`, toma de control, soporte activo, soporte parcial, pendiente de traspaso y sin soporte formal.

En este contexto, un producto puede consumir muchas fuentes, una fuente puede alimentar muchos productos y algunas fuentes pueden requerir tratamiento operativo propio, casi como entidades soportadas por sí mismas.

Grafana sigue siendo la fuente oficial para monitoreo vivo y revisión de estados dinámicos. El portal no busca reemplazar Grafana ni funcionar como dashboard operacional en tiempo real. Su función es documentar dónde mirar, cómo interpretar señales, qué hacer inicialmente, qué runbook aplicar y a quién escalar.

## 3. Necesidad principal

La necesidad principal que el portal busca cubrir es contar con una base de conocimiento operativa, centralizada y mantenible que permita al equipo de soporte identificar rápidamente qué productos y fuentes están bajo seguimiento, cómo se relacionan, en qué ambiente y fase se encuentran, dónde revisar, qué runbook aplicar y a quién escalar ante incidentes o hallazgos operativos.

Esta necesidad debe validarse con entrevistas para confirmar si el portal reduce tiempo de búsqueda, mejora consistencia de diagnóstico y facilita la transferencia de conocimiento dentro del equipo.

## 4. Dolores operativos que busca abordar

Los siguientes dolores se plantean como hipótesis iniciales **por validar en entrevistas**:

- **Información dispersa:** antecedentes operativos distribuidos entre SharePoint, Teams, Grafana, DevOps, repositorios, minutas y conocimiento informal.
- **Dependencia de personas específicas:** necesidad de consultar a analistas senior o especialistas para saber cómo diagnosticar, interpretar una alerta o escalar.
- **Dificultad para entender qué productos están realmente soportados:** falta de claridad sobre productos en soporte activo, Follow, toma de control, soporte parcial o pendiente de traspaso.
- **Falta de claridad entre ambiente técnico y fase de soporte:** riesgo de mezclar `PRD`, `UAT`, `STAGE` y `DEV` con fases como `Follow`.
- **Confusión entre productos digitales y fuentes de datos:** dificultad para distinguir si el problema está en el producto, en la fuente o en la relación entre ambos.
- **Dificultad para visualizar la relación producto-fuente:** falta de una vista clara para entender qué fuentes consume cada producto y qué productos dependen de una fuente.
- **Riesgo de no identificar impacto cruzado:** una falla en una fuente compartida podría afectar más de un producto sin que sea evidente al inicio del diagnóstico.
- **Dificultad para saber qué dashboard revisar en Grafana:** existencia de múltiples paneles, enlaces o vistas sin una guía operativa clara.
- **Falta de criterios claros para interpretar OK/WARN/ALERT:** necesidad de criterios documentales que orienten el diagnóstico sin duplicar el estado vivo de Grafana.
- **Falta de runbooks estandarizados:** procedimientos incompletos, heterogéneos o dependientes del conocimiento individual.
- **Escalamientos poco claros:** rutas de escalamiento dependientes de experiencia previa o conversaciones informales.
- **Dificultad para incorporar nuevos integrantes:** curva de aprendizaje alta para entender productos, fuentes, ambientes, dashboards y runbooks.
- **Falta de trazabilidad documental:** dificultad para saber qué productos o fuentes tienen runbook, matriz de escalamiento, dashboard o documentación base.
- **Pérdida de tiempo buscando links, dashboards o documentos:** fricción operacional antes de iniciar el diagnóstico.
- **Riesgo de duplicar información o mezclar responsabilidades:** posibilidad de convertir el portal en un repositorio de estados vivos que corresponden a Grafana.

## 5. Necesidades funcionales del portal

### Inventario operativo

- Saber qué productos existen.
- Saber qué fuentes existen.
- Saber en qué ambiente están.
- Saber en qué fase de soporte están.

### Relación producto-fuente

- Saber qué fuentes consume cada producto.
- Saber qué productos dependen de una fuente.
- Saber qué impacto tiene una fuente cuando falla.

### Diagnóstico y monitoreo operativo

- Saber qué dashboard revisar.
- Saber qué componente mirar primero.
- Saber qué significa una alerta desde una perspectiva operativa.
- Saber qué runbook usar.

### Escalamiento

- Saber a quién escalar.
- Saber cuándo escalar.
- Saber con qué evidencia escalar.

### Documentación y onboarding

- Centralizar documentos.
- Facilitar el aprendizaje de nuevos integrantes.
- Reducir dependencia de conocimiento tribal.

### Control operativo del soporte

- Identificar productos o fuentes sin runbook.
- Identificar productos o fuentes sin matriz de escalamiento.
- Identificar pendientes de documentación.
- Mantener actualizado el portal.

## 6. Matriz dolor → necesidad → funcionalidad

| Dolor operativo | Necesidad asociada | Funcionalidad del portal | Vista relacionada | Hipótesis a validar |
| --- | --- | --- | --- | --- |
| Información dispersa | Centralizar accesos y referencias | Links de interés y repositorio documental | Documentación / Links | Validar si los analistas pierden tiempo buscando información en múltiples lugares. |
| Dependencia de expertos | Estandarizar diagnóstico inicial | Runbooks y criterios de revisión | Runbooks | Validar qué incidentes dependen hoy de una persona específica. |
| Falla de fuente compartida | Identificar impacto cruzado | Mapa producto-fuente | Mapa producto-fuente | Validar si el equipo necesita ver productos afectados por una fuente. |
| Ambientes mezclados con estados de soporte | Separar conceptos | Campos de ambiente y fase de soporte | Productos / Fuentes / Ambientes | Validar si la distinción `PRD`/`UAT`/`STAGE`/`DEV` versus `Follow` genera confusión. |
| Productos sin fase clara | Entender alcance real de soporte | Inventario con estado y fase de soporte | Productos soportados | Validar si existen productos con soporte informal o parcialmente documentado. |
| Fuentes no visibles como entidades | Reconocer fuentes críticas para soporte | Inventario de fuentes soportadas | Fuentes soportadas | Validar si algunas fuentes requieren tratamiento operativo propio. |
| Dudas sobre dashboards | Orientar revisión en Grafana | Catálogo de monitoreo y observabilidad | Catálogo de monitoreo | Validar qué dashboards requieren explicación adicional. |
| Escalamientos informales | Formalizar rutas y evidencia mínima | Matriz de escalamiento por producto, fuente o relación | Matriz de escalamiento | Validar si los escalamiento actuales omiten evidencia relevante. |
| Onboarding lento | Facilitar aprendizaje estructurado | Capacitaciones, documentación y mapa operativo | Capacitación / Documentación | Validar qué información necesitan primero las personas nuevas. |
| Brechas documentales invisibles | Controlar pendientes de soporte | Indicadores documentales y checklist | Control operativo del soporte | Validar si el equipo necesita visibilidad periódica de pendientes documentales. |

## 7. Perfiles a entrevistar

Los siguientes perfiles podrían aportar perspectivas complementarias. La lista debe ajustarse según disponibilidad y alcance de levantamiento:

- Analistas de soporte.
- Analistas senior.
- Líder técnico.
- Equipo de plataforma.
- Equipo de desarrollo.
- Integraciones.
- Responsables funcionales.
- Usuarios o áreas consumidoras, si aplica.
- Personas nuevas o menos experimentadas del equipo.

## 8. Preguntas sugeridas para entrevistas

### Sobre búsqueda de información

- ¿Dónde buscas hoy la información para diagnosticar un incidente?
- ¿Qué información es más difícil de encontrar?
- ¿Qué documentos o links usas con mayor frecuencia?
- ¿Qué información suele estar en conversaciones, minutas o conocimiento informal?

### Sobre productos y fuentes

- ¿Tienes claridad de qué productos están soportados?
- ¿Tienes claridad de qué fuentes usa cada producto?
- ¿Qué pasa cuando falla una fuente compartida?
- ¿Cómo identificas qué productos podrían estar impactados?
- ¿Qué fuentes deberían tratarse como entidades de soporte por sí mismas?

### Sobre ambientes y fase de soporte

- ¿Está claro qué se soporta en `PRD`, `UAT`, `STAGE` y `DEV`?
- ¿Está claro qué significa que un producto esté en `Follow`?
- ¿Qué información mínima necesitas para tomar control de un producto?
- ¿Qué diferencias operativas existen entre soporte activo, soporte parcial y pendiente de traspaso?

### Sobre monitoreo

- ¿Sabes qué dashboard revisar para cada producto o fuente?
- ¿Qué información de Grafana requiere explicación adicional?
- ¿Qué alertas generan más dudas?
- ¿Qué criterios ayudarían a interpretar OK/WARN/ALERT sin duplicar estados vivos?

### Sobre runbooks y escalamiento

- ¿Qué incidentes requieren más ayuda de personas expertas?
- ¿Qué runbooks hacen falta?
- ¿Cuándo no está claro a quién escalar?
- ¿Qué evidencia se suele olvidar al escalar?
- ¿Qué diferencias debería haber entre runbooks transversales, por producto y por fuente?

### Sobre valor esperado

- ¿Qué tendría que tener el portal para que realmente lo uses?
- ¿Qué información sería innecesaria?
- ¿Qué vista debería ser la más importante?
- ¿Cómo medirías que el portal aporta valor?

## 9. Hipótesis iniciales a validar

- El equipo pierde tiempo buscando información dispersa.
- La relación producto-fuente no está suficientemente visible.
- Existen productos o fuentes con soporte informal o parcialmente documentado.
- Los nuevos integrantes dependen demasiado del conocimiento de analistas senior.
- Los escalamientos podrían mejorar si la evidencia mínima estuviera estandarizada.
- El portal aportará valor si permite encontrar rápidamente dashboard, runbook, responsable y escalamiento.
- El portal no debe duplicar información viva de Grafana, sino complementarla.
- La vista de control operativo permitirá priorizar pendientes documentales.
- La separación entre ambiente técnico y fase de soporte reducirá confusiones operativas.

Todas estas hipótesis están **por validar en entrevistas**.

## 10. Criterios de éxito del portal

Los criterios siguientes podrían usarse para evaluar si el portal entrega valor. Deben ajustarse después de las entrevistas:

- Reducción del tiempo para encontrar documentación.
- Mayor claridad sobre productos, fuentes y ambientes.
- Mayor consistencia en diagnósticos iniciales.
- Escalamientos con evidencia más completa.
- Menor dependencia de personas específicas.
- Mejor onboarding de nuevos integrantes.
- Mayor cobertura de runbooks y matrices de escalamiento.
- Uso recurrente del portal por parte del equipo.
- Mayor visibilidad de productos y fuentes en Follow, toma de control o soporte parcial.
- Mayor rapidez para identificar impacto cruzado ante falla de una fuente.

## 11. Alcance explícitamente fuera del portal

El portal no busca:

- Reemplazar Grafana.
- Mostrar estados vivos de monitoreo.
- Ser herramienta ITSM.
- Administrar incidentes en tiempo real.
- Resolver gobierno de datos.
- Certificar calidad de datos.
- Ser dueño de definiciones funcionales de negocio.
- Almacenar secretos, credenciales, tokens o información sensible.

Estos límites son relevantes para evitar que el portal se transforme en una herramienta paralela a sistemas oficiales o en un repositorio de información dinámica que debería consultarse en otra fuente.

## 12. Próximos pasos sugeridos

- Validar hipótesis mediante entrevistas.
- Priorizar dolores según frecuencia e impacto.
- Definir MVP del portal.
- Ajustar vistas según feedback.
- Cargar información real por fases.
- Establecer responsables de mantención.
- Revisar periódicamente si el portal sigue resolviendo necesidades reales del equipo.
