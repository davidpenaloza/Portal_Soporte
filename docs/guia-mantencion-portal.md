# Guía de mantención del portal

## Flujo recomendado

1. Crear una rama de trabajo para el cambio.
2. Actualizar archivos JSON en `data/` o documentos Markdown en `docs/`.
3. Validar sintaxis JSON antes de publicar.
4. Probar localmente con un servidor estático.
5. Solicitar revisión del equipo antes de fusionar.

## Reglas de contenido

- No incluir secretos, tokens, credenciales, cadenas de conexión ni suscripciones completas.
- No publicar rutas internas sensibles o información productiva innecesaria.
- Usar nombres descriptivos y genéricos cuando el detalle real sea confidencial.
- Mantener responsables, criticidades y enlaces actualizados.
- Preferir evidencias resumidas y referencias a sistemas oficiales de gestión.

## Validación local

Ejecutar desde la raíz del repositorio:

```bash
python3 -m http.server 8080
```

Luego abrir `http://localhost:8080` en el navegador. Usar servidor local es importante porque el portal carga archivos JSON mediante `fetch`.
