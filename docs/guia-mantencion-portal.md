# Guía de mantención del portal

## Flujo recomendado

1. Crear una rama de trabajo para el cambio.
2. Actualizar archivos JSON en `data/` o documentos Markdown en `docs/`.
3. Validar sintaxis JSON antes de publicar.
4. Ejecutar `python3 scripts/validate-static-portal.py` desde la raíz del repositorio.
5. Probar localmente con un servidor estático.
6. Solicitar revisión del equipo antes de fusionar.


## Publicación en SharePoint

Mantener `index.html` y las carpetas `assets/`, `data/`, `docs/` y `templates/` en el mismo nivel de la biblioteca de documentos. Las rutas del portal son relativas al `index.html` y no deben convertirse en rutas absolutas dependientes de localhost, raíz del dominio o una URL específica de SharePoint.


## Relación con monitoreo en tiempo real

Grafana es la fuente oficial para estados vivos, métricas actuales, últimas ejecuciones y errores recientes. El portal debe mantener solo conocimiento operativo: dónde revisar, cómo interpretar dashboards, qué revisar primero, criterios documentales, runbooks y rutas de escalamiento.

## Reglas de contenido

- No incluir secretos, tokens, credenciales, cadenas de conexión ni suscripciones completas.
- No publicar rutas internas sensibles o información productiva innecesaria.
- Usar nombres descriptivos y genéricos cuando el detalle real sea confidencial.
- Mantener responsables, criticidades y enlaces actualizados.
- Preferir evidencias resumidas y referencias a sistemas oficiales de gestión.
- Usar `templates/monitoreo.template.json` para nuevas entradas del catálogo de observabilidad.

## Validación local

Ejecutar desde la raíz del repositorio:

```bash
python3 -m http.server 8080
```

Luego abrir `http://localhost:8080` en el navegador. Usar servidor local es importante porque el portal carga archivos JSON mediante `fetch`.
