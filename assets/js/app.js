const dataSources = {
  productos: "./data/productos.json",
  fuentes: "./data/fuentes.json",
  relaciones: "./data/producto-fuente.json",
  documentacion: "./data/documentacion.json",
  links: "./data/links-interes.json",
  escalamientos: "./data/escalamientos.json",
  runbooks: "./data/runbooks.json",
  modelo: "./data/modelo-operativo.json",
  monitoreo: "./data/monitoreo.json",
  capacitaciones: "./data/capacitaciones.json"
};

const dataDefaults = {
  productos: [],
  fuentes: [],
  relaciones: [],
  documentacion: [],
  links: [],
  escalamientos: [],
  runbooks: [],
  modelo: { principios: [], monitoreo: [], incidentes: [], cadencias: [] },
  monitoreo: [],
  capacitaciones: []
};

const appState = {
  data: { ...dataDefaults },
  errors: []
};

const $ = (selector) => document.querySelector(selector);
const isArraySource = (name) => Array.isArray(dataDefaults[name]);
const asList = (name) => Array.isArray(appState.data[name]) ? appState.data[name] : [];

function escapeHtml(value = "") {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeUrl(value = "", fallback = "#") {
  const url = String(value || "").trim();
  if (!url) return fallback;
  if (url.startsWith("./") || url.startsWith("../") || url.startsWith("#")) return escapeHtml(url);

  try {
    const parsed = new URL(url, window.location.href);
    if (["http:", "https:"].includes(parsed.protocol)) return escapeHtml(parsed.href);
  } catch (error) {
    console.warn("URL inválida omitida", value, error);
  }

  return fallback;
}

function statusClass(value = "") {
  const normalized = String(value).toLowerCase();
  if (normalized.includes("crítica") || normalized.includes("alert") || normalized.includes("pendiente") || normalized.includes("sin soporte")) return "alert";
  if (normalized.includes("alta") || normalized.includes("construcción") || normalized.includes("follow") || normalized.includes("toma de control") || normalized.includes("warn")) return "warn";
  if (normalized.includes("activo") || normalized.includes("base") || normalized.includes("ok")) return "ok";
  return "info";
}

function joinList(items = []) {
  return Array.isArray(items) ? items.join(", ") : String(items || "");
}

function renderTags(items = []) {
  if (!Array.isArray(items) || !items.length) return "";
  return `<div class="tag-row">${items.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("")}</div>`;
}

function renderEmptyCard(message) {
  return `
    <article class="card is-empty searchable-item">
      <h3>Sin contenido registrado</h3>
      <p>${escapeHtml(message)}</p>
    </article>
  `;
}

function renderEmptyTableRow(columns, message) {
  return `<tr class="searchable-item"><td colspan="${columns}">${escapeHtml(message)}</td></tr>`;
}

function maps() {
  return {
    productos: new Map(asList("productos").map((item) => [item.id, item])),
    fuentes: new Map(asList("fuentes").map((item) => [item.id, item]))
  };
}

function displayProducto(id) {
  const producto = maps().productos.get(id);
  return producto ? `${producto.nombre} (${producto.sigla || producto.id})` : (id || "No aplica");
}

function displayFuente(id) {
  const fuente = maps().fuentes.get(id);
  return fuente ? fuente.nombre : (id || "No aplica");
}

async function loadJson(name, url) {
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    if (isArraySource(name) && !Array.isArray(data)) throw new Error("Se esperaba un arreglo JSON");
    if (!isArraySource(name) && (Array.isArray(data) || typeof data !== "object" || data === null)) throw new Error("Se esperaba un objeto JSON");

    return data;
  } catch (error) {
    appState.errors.push({ name, url, message: error.message });
    return dataDefaults[name];
  }
}

async function loadAllData() {
  const entries = await Promise.all(
    Object.entries(dataSources).map(async ([name, url]) => [name, await loadJson(name, url)])
  );
  appState.data = { ...dataDefaults, ...Object.fromEntries(entries) };
  renderPortal();
}

function renderPortal() {
  renderMetrics();
  renderStatusPanel();
  renderModelo();
  renderProductos();
  renderFuentes();
  renderRelaciones();
  renderAmbientes();
  renderMonitoreo();
  renderIncidentes();
  renderEscalamientos();
  renderRunbooks();
  renderDocumentacion();
  renderLinks();
  renderCapacitaciones();
  renderControlOperativo();
}

function renderMetrics() {
  const ambientes = new Set([
    ...asList("productos").flatMap((item) => item.ambientesDisponibles || []),
    ...asList("fuentes").flatMap((item) => item.ambientesDisponibles || [])
  ]);
  const metrics = [
    ["Productos", asList("productos").length, "Productos digitales soportados"],
    ["Fuentes", asList("fuentes").length, "Fuentes modeladas como entidades"],
    ["Relaciones", asList("relaciones").length, "Dependencias producto-fuente"],
    ["Ambientes", ambientes.size, "PRD · UAT · STAGE · DEV"],
    ["Runbooks", asList("runbooks").length, "Transversales, por producto y por fuente"]
  ];

  $("#metricsGrid").innerHTML = metrics
    .map(([title, value, description]) => `
      <article class="metric-card searchable-item">
        <strong>${value}</strong>
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(description)}</p>
      </article>
    `)
    .join("");
}

function renderStatusPanel() {
  const panel = $("#statusPanel");
  if (!appState.errors.length) {
    panel.innerHTML = `<div class="status ok">OK · Todos los archivos JSON configurados cargaron correctamente</div>`;
    return;
  }

  panel.innerHTML = appState.errors
    .map((error) => `
      <div class="error-message">
        <strong>No se pudo cargar ${escapeHtml(error.url)}</strong><br />
        Revisa que el archivo exista, tenga JSON válido y se esté sirviendo desde un servidor local o sitio estático. Detalle: ${escapeHtml(error.message)}.
      </div>
    `)
    .join("");
}

function renderModelo() {
  const principios = appState.data.modelo?.principios || [];
  $("#modeloGrid").innerHTML = principios.length
    ? principios.map((item) => `
      <article class="card searchable-item">
        <h3>${escapeHtml(item.nombre)}</h3>
        <p>${escapeHtml(item.descripcion)}</p>
        ${renderTags(item.artefactos)}
      </article>
    `).join("")
    : renderEmptyCard("Agrega principios del modelo operativo en data/modelo-operativo.json.");
}

function renderProductos() {
  const productos = asList("productos");
  $("#productosTable").innerHTML = `
    <thead>
      <tr>
        <th>Producto</th><th>Faena</th><th>Ambientes</th><th>Ambiente soportado</th><th>Estado / fase</th><th>Criticidad</th><th>Soporte</th><th>Dashboard</th><th>Runbook</th><th>Fuentes</th><th>Última revisión</th>
      </tr>
    </thead>
    <tbody>
      ${productos.length ? productos.map((producto) => `
        <tr class="searchable-item">
          <td><strong>${escapeHtml(producto.nombre)}</strong><br /><small>${escapeHtml(producto.id)} · ${escapeHtml(producto.descripcion)}</small>${renderTags(producto.tags)}</td>
          <td>${escapeHtml(producto.faena)}</td>
          <td>${escapeHtml(joinList(producto.ambientesDisponibles))}</td>
          <td><span class="tag">${escapeHtml(producto.ambienteSoportado)}</span></td>
          <td><span class="status ${statusClass(producto.estadoSoporte)}">${escapeHtml(producto.estadoSoporte)}</span><br /><small>${escapeHtml(producto.faseSoporte)} · ${escapeHtml(producto.nivelSoporte)}</small></td>
          <td><span class="status ${statusClass(producto.criticidad)}">${escapeHtml(producto.criticidad)}</span></td>
          <td>${escapeHtml(producto.responsableSoporte)}<br /><small>${escapeHtml(producto.responsableTecnico)}</small></td>
          <td>${escapeHtml(producto.dashboardPrincipal)}</td>
          <td>${escapeHtml(producto.runbookPrincipal)}</td>
          <td>${escapeHtml((producto.fuentesAsociadas || []).map(displayFuente).join(", "))}</td>
          <td>${escapeHtml(producto.ultimaRevision)}</td>
        </tr>
      `).join("") : renderEmptyTableRow(11, "Agrega productos en data/productos.json.")}
    </tbody>
  `;
}

function renderFuentes() {
  const fuentes = asList("fuentes");
  $("#fuentesTable").innerHTML = `
    <thead>
      <tr>
        <th>Fuente</th><th>Tipo</th><th>Faena</th><th>Ambientes</th><th>Ambiente soportado</th><th>Estado / fase</th><th>Criticidad</th><th>Responsables</th><th>Productos consumidores</th><th>Dashboard</th><th>Runbook</th><th>Última revisión</th>
      </tr>
    </thead>
    <tbody>
      ${fuentes.length ? fuentes.map((fuente) => `
        <tr class="searchable-item">
          <td><strong>${escapeHtml(fuente.nombre)}</strong><br /><small>${escapeHtml(fuente.id)} · ${escapeHtml(fuente.descripcion)}</small>${renderTags(fuente.tags)}</td>
          <td>${escapeHtml(fuente.tipo)}</td>
          <td>${escapeHtml(fuente.faena)}</td>
          <td>${escapeHtml(joinList(fuente.ambientesDisponibles))}</td>
          <td><span class="tag">${escapeHtml(fuente.ambienteSoportado)}</span></td>
          <td><span class="status ${statusClass(fuente.estadoSoporte)}">${escapeHtml(fuente.estadoSoporte)}</span><br /><small>${escapeHtml(fuente.faseSoporte)}</small></td>
          <td><span class="status ${statusClass(fuente.criticidad)}">${escapeHtml(fuente.criticidad)}</span></td>
          <td>${escapeHtml(fuente.responsableSoporte)}<br /><small>${escapeHtml(fuente.responsableTecnico)}</small></td>
          <td>${escapeHtml((fuente.productosConsumidores || []).map(displayProducto).join(", "))}</td>
          <td>${escapeHtml(fuente.dashboardAsociado)}</td>
          <td>${escapeHtml(fuente.runbookAsociado)}</td>
          <td>${escapeHtml(fuente.ultimaRevision)}</td>
        </tr>
      `).join("") : renderEmptyTableRow(12, "Agrega fuentes en data/fuentes.json.")}
    </tbody>
  `;
}

function renderRelaciones() {
  const relaciones = asList("relaciones");
  $("#relacionesTable").innerHTML = `
    <thead>
      <tr>
        <th>Producto</th><th>Fuente</th><th>Faena</th><th>Ambiente</th><th>Dependencia</th><th>Criticidad</th><th>Componente afectado</th><th>Impacto si falla</th><th>Síntoma visible</th><th>Validación inicial</th><th>Runbook</th><th>Escalamiento</th>
      </tr>
    </thead>
    <tbody>
      ${relaciones.length ? relaciones.map((relacion) => `
        <tr class="searchable-item">
          <td>${escapeHtml(displayProducto(relacion.productoId))}</td>
          <td>${escapeHtml(displayFuente(relacion.fuenteId))}</td>
          <td>${escapeHtml(relacion.faena)}</td>
          <td><span class="tag">${escapeHtml(relacion.ambiente)}</span></td>
          <td>${escapeHtml(relacion.tipoDependencia)}<br /><small>${relacion.fuenteObligatoria ? "Fuente obligatoria" : "Fuente complementaria"}</small></td>
          <td><span class="status ${statusClass(relacion.criticidadRelacion)}">${escapeHtml(relacion.criticidadRelacion)}</span></td>
          <td>${escapeHtml(relacion.componenteAfectado)}</td>
          <td>${escapeHtml(relacion.impactoSiFalla)}</td>
          <td>${escapeHtml(relacion.sintomaVisible)}</td>
          <td>${escapeHtml(relacion.validacionInicial)}</td>
          <td>${escapeHtml(relacion.runbookAsociado)}</td>
          <td>${escapeHtml(relacion.escalamiento)}</td>
        </tr>
      `).join("") : renderEmptyTableRow(12, "Agrega relaciones en data/producto-fuente.json.")}
    </tbody>
  `;
}

function renderAmbientes() {
  const entidades = [
    ...asList("productos").map((item) => ({ ...item, entidad: "Producto" })),
    ...asList("fuentes").map((item) => ({ ...item, entidad: "Fuente" }))
  ];
  const ambientes = ["PRD", "UAT", "STAGE", "DEV"];
  $("#ambientesGrid").innerHTML = ambientes.map((ambiente) => {
    const disponibles = entidades.filter((item) => (item.ambientesDisponibles || []).includes(ambiente));
    const soportadas = entidades.filter((item) => item.ambienteSoportado === ambiente);
    return `
      <article class="card searchable-item">
        <h3>${ambiente}</h3>
        <p>Ambiente técnico. Follow no corresponde a ambiente; se documenta como fase de soporte.</p>
        <div class="meta-list">
          <div class="meta-item"><span>Entidades disponibles</span><strong>${disponibles.length}</strong></div>
          <div class="meta-item"><span>Entidades soportadas</span><strong>${soportadas.length}</strong></div>
        </div>
        ${renderTags(soportadas.map((item) => `${item.entidad}: ${item.nombre}`))}
      </article>
    `;
  }).join("");
}

function renderMonitoreo() {
  const catalogo = asList("monitoreo");
  $("#monitoreoGrid").innerHTML = catalogo.length ? catalogo.map((item) => `
    <article class="card monitoring-card searchable-item">
      <span class="tag">${escapeHtml(item.producto)}</span>
      <h3>${escapeHtml(item.dashboardPrincipal)}</h3>
      <p>${escapeHtml(item.objetivoDashboard)}</p>
      <div class="meta-list">
        <div class="meta-item"><span>Frecuencia esperada</span><strong>${escapeHtml(item.frecuenciaEsperada)}</strong></div>
        <div class="meta-item"><span>Runbook asociado</span><strong>${escapeHtml(item.runbookAsociado)}</strong></div>
        <div class="meta-item"><span>Responsable</span><strong>${escapeHtml(item.responsable)}</strong></div>
      </div>
      <h4>Componentes monitoreados</h4>
      ${renderTags(item.componentesMonitoreados)}
      <h4>Qué revisar primero</h4>
      ${renderTags(item.revisarPrimero)}
      <div class="criteria-list">
        <div><span class="status ok">OK</span><p>${escapeHtml(item.criterios?.ok)}</p></div>
        <div><span class="status warn">WARN</span><p>${escapeHtml(item.criterios?.warn)}</p></div>
        <div><span class="status alert">ALERT</span><p>${escapeHtml(item.criterios?.alert)}</p></div>
      </div>
      <p>${escapeHtml(item.observaciones)}</p>
      <p><a class="pill" href="${safeUrl(item.linkGrafana)}" target="_blank" rel="noreferrer">Abrir referencia en Grafana</a></p>
    </article>
  `).join("") : renderEmptyCard("Agrega mapas de monitoreo en data/monitoreo.json.");
}

function renderIncidentes() {
  const pasos = appState.data.modelo?.incidentes || [];
  $("#incidentesFlow").innerHTML = pasos.length ? pasos.map((paso, index) => `
    <article class="flow-step searchable-item">
      <strong>${index + 1}</strong>
      <h3>${escapeHtml(paso.paso)}</h3>
      <p>${escapeHtml(paso.descripcion)}</p>
    </article>
  `).join("") : renderEmptyCard("Agrega el flujo de incidentes en data/modelo-operativo.json.");
}

function renderEscalamientos() {
  const escalamientos = asList("escalamientos");
  $("#escalamientosTable").innerHTML = `
    <thead>
      <tr>
        <th>Entidad</th><th>Producto</th><th>Fuente</th><th>Ambiente</th><th>Faena</th><th>Tipo problema</th><th>Síntoma</th><th>Diagnóstico inicial</th><th>Evidencia mínima</th><th>Equipo</th><th>Cuándo escalar</th><th>Urgencia</th>
      </tr>
    </thead>
    <tbody>
      ${escalamientos.length ? escalamientos.map((item) => `
        <tr class="searchable-item">
          <td>${escapeHtml(item.tipoEntidad)}</td>
          <td>${escapeHtml(displayProducto(item.productoId))}</td>
          <td>${escapeHtml(displayFuente(item.fuenteId))}</td>
          <td><span class="tag">${escapeHtml(item.ambiente)}</span></td>
          <td>${escapeHtml(item.faena)}</td>
          <td>${escapeHtml(item.tipoProblema)}</td>
          <td>${escapeHtml(item.sintomaVisible)}</td>
          <td>${escapeHtml(item.diagnosticoInicial)}</td>
          <td>${escapeHtml(joinList(item.evidenciaMinima))}</td>
          <td>${escapeHtml(item.equipoEscalamiento)}<br /><small>${escapeHtml(item.canal)}</small></td>
          <td>${escapeHtml(item.cuandoEscalar)}<br /><small>No escalar todavía: ${escapeHtml(item.cuandoNoEscalarTodavia)}</small></td>
          <td><span class="status ${statusClass(item.urgencia)}">${escapeHtml(item.urgencia)}</span></td>
        </tr>
      `).join("") : renderEmptyTableRow(12, "Agrega escalamientos en data/escalamientos.json.")}
    </tbody>
  `;
}

function renderRunbooks() {
  const runbooks = asList("runbooks");
  $("#runbooksGrid").innerHTML = runbooks.length ? runbooks.map((runbook) => `
    <article class="card searchable-item">
      <span class="status ${statusClass(runbook.estado)}">${escapeHtml(runbook.estado)}</span>
      <span class="tag">${escapeHtml(runbook.tipoRunbook)}</span>
      <h3>${escapeHtml(runbook.titulo)}</h3>
      <p>${escapeHtml(runbook.objetivo)}</p>
      <div class="meta-list">
        <div class="meta-item"><span>Ambiente</span><strong>${escapeHtml(runbook.ambiente)}</strong></div>
        <div class="meta-item"><span>Producto</span><strong>${escapeHtml(displayProducto(runbook.productoId))}</strong></div>
        <div class="meta-item"><span>Fuente</span><strong>${escapeHtml(displayFuente(runbook.fuenteId))}</strong></div>
        <div class="meta-item"><span>Severidad sugerida</span><strong>${escapeHtml(runbook.severidadSugerida)}</strong></div>
        <div class="meta-item"><span>ID</span><strong>${escapeHtml(runbook.id)}</strong></div>
      </div>
      ${renderTags(runbook.evidenciaMinima)}
    </article>
  `).join("") : renderEmptyCard("Agrega runbooks en data/runbooks.json.");
}

function renderDocumentacion() {
  const documentos = asList("documentacion");
  $("#documentacionGrid").innerHTML = documentos.length ? documentos.map((doc) => `
    <article class="card searchable-item">
      <span class="status ${statusClass(doc.estado)}">${escapeHtml(doc.estado)}</span>
      <h3>${escapeHtml(doc.titulo)}</h3>
      <p>${escapeHtml(doc.descripcion)}</p>
      <div class="meta-list"><div class="meta-item"><span>Tipo</span><strong>${escapeHtml(doc.tipo)}</strong></div></div>
      <p><a class="pill" href="${safeUrl(doc.url)}">Abrir documento</a></p>
    </article>
  `).join("") : renderEmptyCard("Agrega documentos en data/documentacion.json.");
}

function renderLinks() {
  const links = asList("links");
  $("#linksGrid").innerHTML = links.length ? links.map((link) => `
    <article class="card searchable-item">
      <span class="tag">${escapeHtml(link.categoria)}</span>
      <h3>${escapeHtml(link.nombre)}</h3>
      <p>${escapeHtml(link.descripcion)}</p>
      <p><a class="pill" href="${safeUrl(link.url)}" target="_blank" rel="noreferrer">Abrir referencia</a></p>
    </article>
  `).join("") : renderEmptyCard("Agrega links de interés en data/links-interes.json.");
}

function renderCapacitaciones() {
  const capacitaciones = asList("capacitaciones");
  $("#capacitacionesGrid").innerHTML = capacitaciones.length ? capacitaciones.map((item) => `
    <article class="card searchable-item">
      <h3>${escapeHtml(item.modulo)}</h3>
      <p>${escapeHtml(item.objetivo)}</p>
      <div class="meta-list">
        <div class="meta-item"><span>Audiencia</span><strong>${escapeHtml(item.audiencia)}</strong></div>
        <div class="meta-item"><span>Duración</span><strong>${escapeHtml(item.duracion)}</strong></div>
      </div>
      ${renderTags(item.actividades)}
    </article>
  `).join("") : renderEmptyCard("Agrega capacitaciones en data/capacitaciones.json.");
}

function renderControlOperativo() {
  const productos = asList("productos");
  const fuentes = asList("fuentes");
  const escalamientos = asList("escalamientos");
  const productosFollow = productos.filter((item) => item.faseSoporte === "Follow");
  const productosTomaControl = productos.filter((item) => item.faseSoporte === "En toma de control");
  const productosActivos = productos.filter((item) => item.faseSoporte === "Soporte activo");
  const productosSinRunbook = productos.filter((item) => !item.runbookPrincipal || item.runbookPrincipal === "Pendiente");
  const productosSinDashboard = productos.filter((item) => !item.dashboardPrincipal || item.dashboardPrincipal === "Pendiente de documentar");
  const fuentesSinRunbook = fuentes.filter((item) => !item.runbookAsociado || item.runbookAsociado === "Pendiente");
  const fuentesSinResponsable = fuentes.filter((item) => !item.responsableSoporte || item.responsableSoporte === "Por definir");
  const productosSinEscalamiento = productos.filter((producto) => !escalamientos.some((esc) => esc.productoId === producto.id));

  const cards = [
    ["Productos en Follow", productosFollow.length, productosFollow.map((item) => item.nombre)],
    ["Productos en toma de control", productosTomaControl.length, productosTomaControl.map((item) => item.nombre)],
    ["Productos con soporte activo", productosActivos.length, productosActivos.map((item) => item.nombre)],
    ["Productos sin runbook", productosSinRunbook.length, productosSinRunbook.map((item) => item.nombre)],
    ["Productos sin matriz de escalamiento", productosSinEscalamiento.length, productosSinEscalamiento.map((item) => item.nombre)],
    ["Productos sin dashboard documentado", productosSinDashboard.length, productosSinDashboard.map((item) => item.nombre)],
    ["Fuentes sin runbook", fuentesSinRunbook.length, fuentesSinRunbook.map((item) => item.nombre)],
    ["Fuentes sin responsable definido", fuentesSinResponsable.length, fuentesSinResponsable.map((item) => item.nombre)]
  ];

  $("#controlGrid").innerHTML = cards.map(([title, value, items]) => `
    <article class="metric-card searchable-item">
      <strong>${value}</strong>
      <h3>${escapeHtml(title)}</h3>
      <p>${items.length ? escapeHtml(items.join(", ")) : "Sin pendientes identificados"}</p>
    </article>
  `).join("");

  $("#controlChecklist").innerHTML = `
    <article class="card searchable-item">
      <h3>Checklist mínimo de traspaso a soporte</h3>
      ${renderTags(["Entidad con ID", "Ambiente soportado", "Fase de soporte", "Dashboard documentado", "Runbook", "Matriz de escalamiento", "Responsables", "Relaciones producto-fuente"])}
      <p>Para solicitar cambios al portal, crear una rama, actualizar JSON/Markdown, ejecutar el validador y pedir revisión por pull request.</p>
    </article>
  `;
}

function setupSearch() {
  $("#searchInput").addEventListener("input", (event) => {
    const term = event.target.value.toLowerCase().trim();
    let visibleSections = 0;

    document.querySelectorAll("section.searchable").forEach((section) => {
      const matches = section.innerText.toLowerCase().includes(term);
      section.classList.toggle("hidden-by-search", Boolean(term) && !matches);
      if (!term || matches) visibleSections += 1;
    });

    $("#noResults").hidden = visibleSections > 0;
  });
}

function setupActiveNavigation() {
  const sections = Array.from(document.querySelectorAll("section[id]"));
  const links = Array.from(document.querySelectorAll(".nav-links a"));

  window.addEventListener("scroll", () => {
    let current = sections[0]?.id;
    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - 150) current = section.id;
    });
    links.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${current}`));
  });
}

function setupSidebar() {
  const sidebar = $("#sidebar");
  const button = $("#menuButton");
  if (!sidebar || !button) return;

  button.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("open");
    button.setAttribute("aria-expanded", String(isOpen));
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      sidebar.classList.remove("open");
      button.setAttribute("aria-expanded", "false");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupSidebar();
  setupSearch();
  setupActiveNavigation();
  loadAllData();
});
