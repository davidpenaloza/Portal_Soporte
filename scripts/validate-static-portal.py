#!/usr/bin/env python3
"""Valida estructura mínima del portal estático AMSA sin dependencias externas."""
from __future__ import annotations

import json
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

JSON_FILES = [
    "data/productos.json",
    "data/documentacion.json",
    "data/links-interes.json",
    "data/escalamientos.json",
    "data/runbooks.json",
    "data/modelo-operativo.json",
    "data/monitoreo.json",
    "data/capacitaciones.json",
    "templates/producto.template.json",
    "templates/runbook.template.json",
    "templates/escalamiento.template.json",
    "templates/documentacion.template.json",
    "templates/monitoreo.template.json",
]

REQUIRED_DATA_SOURCES = [
    "./data/productos.json",
    "./data/documentacion.json",
    "./data/links-interes.json",
    "./data/escalamientos.json",
    "./data/runbooks.json",
    "./data/modelo-operativo.json",
    "./data/monitoreo.json",
    "./data/capacitaciones.json",
]

REQUIRED_AMSA_COLORS = ["#C8102E", "#008C95", "#009CA6", "#E5A823", "#63666A", "#000000"]

REQUIRED_MONITORING_FIELDS = [
    "producto",
    "dashboardPrincipal",
    "objetivoDashboard",
    "componentesMonitoreados",
    "revisarPrimero",
    "frecuenciaEsperada",
    "criterios",
    "runbookAsociado",
    "responsable",
    "linkGrafana",
    "observaciones",
]


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


def main() -> None:
    for path in JSON_FILES:
        load_json(path)

    Parser().feed(read("index.html"))

    app_js = read("assets/js/app.js")
    missing_sources = [source for source in REQUIRED_DATA_SOURCES if source not in app_js]
    assert_true(not missing_sources, f"Faltan rutas relativas en app.js: {missing_sources}")

    css = read("assets/css/styles.css")
    missing_colors = [color for color in REQUIRED_AMSA_COLORS if color not in css]
    assert_true(not missing_colors, f"Faltan colores AMSA en CSS: {missing_colors}")

    monitoring = load_json("data/monitoreo.json")
    assert_true(isinstance(monitoring, list), "data/monitoreo.json debe ser un arreglo")
    for entry in monitoring:
        missing_fields = [field for field in REQUIRED_MONITORING_FIELDS if field not in entry]
        assert_true(not missing_fields, f"Entrada de monitoreo incompleta: {missing_fields}")
        criteria = entry.get("criterios", {})
        assert_true(all(key in criteria for key in ["ok", "warn", "alert"]), "Cada criterio debe incluir ok, warn y alert")

    print("Validación del portal estático OK")


if __name__ == "__main__":
    main()
