const dataSources = {
  productos: "./data/productos.json",
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
  return String(value)
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
  const normalized = value.toLowerCase();
  if (normalized.includes("crítica") || normalized.includes("alert") || normalized.includes("pendiente")) return "alert";
  if (normalized.includes("alta") || normalized.includes("construcción") || normalized.includes("warn")) return "warn";
  if (normalized.includes("base") || normalized.includes("ok")) return "ok";
  return "info";
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
  renderMonitoreo();
  renderIncidentes();
  renderEscalamientos();
  renderRunbooks();
  renderDocumentacion();
  renderLinks();
  renderCapacitaciones();
}

function renderMetrics() {
  const metrics = [
    ["Productos", asList("productos").length, "Inventario inicial soportado"],
    ["Runbooks", asList("runbooks").length, "Procedimientos operativos"],
    ["Escalamientos", asList("escalamientos").length, "Niveles y criterios"],
    ["Documentos", asList("documentacion").length, "Guías y estándares"],
    ["Mapas de monitoreo", asList("monitoreo").length, "Referencias a Grafana"]
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
        <th>Producto</th>
        <th>Criticidad</th>
        <th>Dueño funcional</th>
        <th>Responsable técnico</th>
        <th>Horario</th>
        <th>Dashboard</th>
        <th>Runbook</th>
        <th>Estado doc.</th>
      </tr>
    </thead>
    <tbody>
      ${productos.length ? productos.map((producto) => `
        <tr class="searchable-item">
          <td><strong>${escapeHtml(producto.nombre)}</strong><br /><small>${escapeHtml(producto.descripcion)}</small></td>
          <td><span class="status ${statusClass(producto.criticidad)}">${escapeHtml(producto.criticidad)}</span></td>
          <td>${escapeHtml(producto.duenoFuncional)}</td>
          <td>${escapeHtml(producto.responsableTecnico)}</td>
          <td>${escapeHtml(producto.horario)}</td>
          <td>${escapeHtml(producto.dashboard)}</td>
          <td>${escapeHtml(producto.runbook)}</td>
          <td><span class="status ${statusClass(producto.estadoDocumentacion)}">${escapeHtml(producto.estadoDocumentacion)}</span></td>
        </tr>
      `).join("") : renderEmptyTableRow(8, "Agrega productos en data/productos.json.")}
    </tbody>
  `;
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
        <th>Nivel</th>
        <th>Criterio</th>
        <th>Tiempo objetivo</th>
        <th>Responsable</th>
        <th>Salida esperada</th>
      </tr>
    </thead>
    <tbody>
      ${escalamientos.length ? escalamientos.map((item) => `
        <tr class="searchable-item">
          <td><strong>${escapeHtml(item.nivel)}</strong></td>
          <td>${escapeHtml(item.criterio)}</td>
          <td>${escapeHtml(item.tiempoObjetivo)}</td>
          <td>${escapeHtml(item.responsable)}</td>
          <td>${escapeHtml(item.salidaEsperada)}</td>
        </tr>
      `).join("") : renderEmptyTableRow(5, "Agrega escalamientos en data/escalamientos.json.")}
    </tbody>
  `;
}

function renderRunbooks() {
  const runbooks = asList("runbooks");
  $("#runbooksGrid").innerHTML = runbooks.length ? runbooks.map((runbook) => `
    <article class="card searchable-item">
      <span class="status ${statusClass(runbook.estado)}">${escapeHtml(runbook.estado)}</span>
      <h3>${escapeHtml(runbook.titulo)}</h3>
      <p>${escapeHtml(runbook.objetivo)}</p>
      <div class="meta-list">
        <div class="meta-item"><span>Producto</span><strong>${escapeHtml(runbook.producto)}</strong></div>
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
      <div class="meta-list">
        <div class="meta-item"><span>Tipo</span><strong>${escapeHtml(doc.tipo)}</strong></div>
      </div>
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
