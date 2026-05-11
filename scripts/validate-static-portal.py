#!/usr/bin/env python3
"""Valida estructura mínima del portal estático AMSA sin dependencias externas."""
from __future__ import annotations

import json
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

JSON_FILES = [
    "data/productos.json",
    "data/fuentes.json",
    "data/producto-fuente.json",
    "data/documentacion.json",
    "data/links-interes.json",
    "data/escalamientos.json",
    "data/runbooks.json",
    "data/modelo-operativo.json",
    "data/monitoreo.json",
    "data/modelos-monitoreo.json",
    "data/capacitaciones.json",
    "templates/producto.template.json",
    "templates/fuente.template.json",
    "templates/producto-fuente.template.json",
    "templates/runbook.template.json",
    "templates/escalamiento.template.json",
    "templates/documentacion.template.json",
    "templates/monitoreo.template.json",
]

REQUIRED_DATA_SOURCES = [
    "./data/productos.json",
    "./data/fuentes.json",
    "./data/producto-fuente.json",
    "./data/documentacion.json",
    "./data/links-interes.json",
    "./data/escalamientos.json",
    "./data/runbooks.json",
    "./data/modelo-operativo.json",
    "./data/monitoreo.json",
    "./data/modelos-monitoreo.json",
    "./data/capacitaciones.json",
]

REQUIRED_AMSA_COLORS = ["#C8102E", "#008C95", "#009CA6", "#E5A823", "#63666A", "#000000"]
VALID_ENVIRONMENTS = {"PRD", "UAT", "STAGE", "DEV"}
VALID_SUPPORT_PHASES = {"Follow", "En toma de control", "Soporte activo", "Soporte parcial", "Pendiente de traspaso", "Sin soporte formal", "Retirado"}

REQUIRED_PRODUCT_FIELDS = [
    "id", "nombre", "sigla", "faena", "descripcion", "ambientesDisponibles", "ambienteSoportado", "estadoSoporte", "faseSoporte", "nivelSoporte", "criticidad", "responsableFuncional", "responsableTecnico", "responsableSoporte", "equipoDesarrolloProveedor", "horarioSoporte", "tieneGuardia", "dashboardPrincipal", "runbookPrincipal", "documentacionAsociada", "fuentesAsociadas", "ultimaRevision", "tags",
]
REQUIRED_SOURCE_FIELDS = [
    "id", "nombre", "tipo", "faena", "descripcion", "sistemaOrigen", "ambientesDisponibles", "ambienteSoportado", "estadoSoporte", "faseSoporte", "criticidad", "responsableFuncional", "responsableTecnico", "responsableSoporte", "equipoProveedorIntegracion", "frecuenciaEsperada", "metodoRecepcion", "formatoDatos", "dashboardAsociado", "runbookAsociado", "documentacionAsociada", "productosConsumidores", "ultimaRevision", "tags",
]
REQUIRED_RELATION_FIELDS = [
    "productoId", "fuenteId", "faena", "ambiente", "tipoDependencia", "criticidadRelacion", "fuenteObligatoria", "componenteAfectado", "impactoSiFalla", "sintomaVisible", "dashboardDondeSeDetecta", "validacionInicial", "runbookAsociado", "escalamiento", "evidenciaMinima", "observaciones",
]
REQUIRED_MONITORING_FIELDS = ["producto", "dashboardPrincipal", "objetivoDashboard", "componentesMonitoreados", "revisarPrimero", "frecuenciaEsperada", "criterios", "runbookAsociado", "responsable", "linkGrafana", "observaciones"]
REQUIRED_MONITORING_MODEL_FIELDS = ["id", "nombre", "descripcion", "fuenteOficial", "estado", "responsable", "ultimaRevision", "documentos", "tags"]
REQUIRED_MONITORING_MODEL_DOC_FIELDS = ["titulo", "archivo", "tipo", "descripcion", "markdownUrl", "viewerUrl", "tags"]
REQUIRED_ESCALATION_FIELDS = ["tipoEntidad", "productoId", "fuenteId", "ambiente", "faena", "tipoProblema", "sintomaVisible", "diagnosticoInicial", "evidenciaMinima", "equipoEscalamiento", "canal", "cuandoEscalar", "cuandoNoEscalarTodavia", "urgencia", "horarioAplicable", "observaciones"]

PROHIBITED_TERMS = ["local" + "Storage", "content" + "editable", "modo " + "edición", "data " + "governance"]


class Parser(HTMLParser):
    pass


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def load_json(path: str):
    with (ROOT / path).open(encoding="utf-8") as handle:
        return json.load(handle)


def assert_true(condition: bool, message: str) -> None:
    if not condition:
        raise SystemExit(message)


def validate_fields(collection, fields, label):
    assert_true(isinstance(collection, list), f"{label} debe ser un arreglo")
    for entry in collection:
        missing = [field for field in fields if field not in entry]
        assert_true(not missing, f"Entrada incompleta en {label}: {missing}")


def validate_environment(value: str, label: str) -> None:
    assert_true(value in VALID_ENVIRONMENTS, f"Ambiente inválido en {label}: {value}")


def validate_support_phase(value: str, label: str) -> None:
    assert_true(value in VALID_SUPPORT_PHASES, f"Fase de soporte inválida en {label}: {value}")


def main() -> None:
    for path in JSON_FILES:
        load_json(path)

    html = read("index.html")
    Parser().feed(html)

    app_js = read("assets/js/app.js")
    missing_sources = [source for source in REQUIRED_DATA_SOURCES if source not in app_js]
    assert_true(not missing_sources, f"Faltan rutas relativas en app.js: {missing_sources}")

    css = read("assets/css/styles.css")
    missing_colors = [color for color in REQUIRED_AMSA_COLORS if color not in css]
    assert_true(not missing_colors, f"Faltan colores AMSA en CSS: {missing_colors}")

    products = load_json("data/productos.json")
    sources = load_json("data/fuentes.json")
    relations = load_json("data/producto-fuente.json")
    monitoring = load_json("data/monitoreo.json")
    monitoring_models = load_json("data/modelos-monitoreo.json")
    escalations = load_json("data/escalamientos.json")

    validate_fields(products, REQUIRED_PRODUCT_FIELDS, "data/productos.json")
    validate_fields(sources, REQUIRED_SOURCE_FIELDS, "data/fuentes.json")
    validate_fields(relations, REQUIRED_RELATION_FIELDS, "data/producto-fuente.json")
    validate_fields(monitoring, REQUIRED_MONITORING_FIELDS, "data/monitoreo.json")
    validate_fields(monitoring_models, REQUIRED_MONITORING_MODEL_FIELDS, "data/modelos-monitoreo.json")
    validate_fields(escalations, REQUIRED_ESCALATION_FIELDS, "data/escalamientos.json")

    product_ids = {item["id"] for item in products}
    source_ids = {item["id"] for item in sources}

    for product in products:
        validate_environment(product["ambienteSoportado"], product["id"])
        validate_support_phase(product["faseSoporte"], product["id"])
        assert_true("Follow" not in product.get("ambientesDisponibles", []), f"Follow no debe ser ambiente en {product['id']}")
        assert_true(all(source_id in source_ids for source_id in product["fuentesAsociadas"]), f"Fuente inexistente en producto {product['id']}")

    for source in sources:
        validate_environment(source["ambienteSoportado"], source["id"])
        validate_support_phase(source["faseSoporte"], source["id"])
        assert_true("Follow" not in source.get("ambientesDisponibles", []), f"Follow no debe ser ambiente en {source['id']}")
        assert_true(all(product_id in product_ids for product_id in source["productosConsumidores"]), f"Producto inexistente en fuente {source['id']}")

    for relation in relations:
        validate_environment(relation["ambiente"], f"relación {relation['productoId']} -> {relation['fuenteId']}")
        assert_true(relation["productoId"] in product_ids, f"Producto inexistente en relación: {relation['productoId']}")
        assert_true(relation["fuenteId"] in source_ids, f"Fuente inexistente en relación: {relation['fuenteId']}")

    for entry in monitoring:
        criteria = entry.get("criterios", {})
        assert_true(all(key in criteria for key in ["ok", "warn", "alert"]), "Cada criterio debe incluir ok, warn y alert")

    for entry in monitoring_models:
        assert_true(isinstance(entry["documentos"], list) and entry["documentos"], f"Modelo de monitoreo sin documentos: {entry['id']}")
        assert_true(entry["fuenteOficial"].startswith("docs/modelo-monitoreo/"), f"fuenteOficial inválida: {entry['fuenteOficial']}")
        validate_fields(entry["documentos"], REQUIRED_MONITORING_MODEL_DOC_FIELDS, f"documentos de {entry['id']}")
        for document in entry["documentos"]:
            assert_true(document["markdownUrl"].startswith("./docs/modelo-monitoreo/") and document["markdownUrl"].endswith(".md"), f"markdownUrl inválida en modelo de monitoreo: {document['markdownUrl']}")
            assert_true(document["viewerUrl"].startswith("./documento.html?doc=docs/modelo-monitoreo/") and document["viewerUrl"].endswith(".md"), f"viewerUrl inválida en modelo de monitoreo: {document['viewerUrl']}")
            assert_true("../" not in document["viewerUrl"], f"viewerUrl insegura en modelo de monitoreo: {document['viewerUrl']}")
            assert_true((ROOT / document["markdownUrl"].removeprefix("./")).exists(), f"Documento Markdown inexistente: {document['markdownUrl']}")

    Parser().feed(read("documento.html"))
    read("assets/js/markdown-viewer.js")
    read("assets/css/markdown.css")
    read("assets/vendor/marked.min.js")
    read("assets/vendor/purify.min.js")

    combined_text = "\n".join([html, app_js, read("README.md"), read("docs/modelo-operativo.md"), read("docs/guia-mantencion-portal.md")])
    for term in PROHIBITED_TERMS:
        assert_true(term.lower() not in combined_text.lower(), f"Término prohibido encontrado: {term}")

    print("Validación del portal estático OK")


if __name__ == "__main__":
    main()
