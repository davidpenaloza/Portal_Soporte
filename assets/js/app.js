const dataSources = {
  productos: "./data/productos.json",
  documentacion: "./data/documentacion.json",
  links: "./data/links-interes.json",
  escalamientos: "./data/escalamientos.json",
  runbooks: "./data/runbooks.json",
  modelo: "./data/modelo-operativo.json",
  capacitaciones: "./data/capacitaciones.json"
};

const appState = {
  data: {},
  errors: []
};

const $ = (selector) => document.querySelector(selector);

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function statusClass(value = "") {
  const normalized = value.toLowerCase();
  if (normalized.includes("crítica") || normalized.includes("alert") || normalized.includes("pendiente")) return "alert";
  if (normalized.includes("alta") || normalized.includes("construcción") || normalized.includes("warn")) return "warn";
  if (normalized.includes("base") || normalized.includes("ok")) return "ok";
  return "info";
}

function renderTags(items = []) {
  if (!items.length) return "";
  return `<div class="tag-row">${items.map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("")}</div>`;
}

async function loadJson(name, url) {
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    appState.errors.push({ name, url, message: error.message });
    return Array.isArray(appState.data[name]) ? [] : null;
  }
}

async function loadAllData() {
  const entries = await Promise.all(
    Object.entries(dataSources).map(async ([name, url]) => [name, await loadJson(name, url)])
  );
  appState.data = Object.fromEntries(entries);
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
    ["Productos", appState.data.productos?.length || 0, "Inventario inicial soportado"],
    ["Runbooks", appState.data.runbooks?.length || 0, "Procedimientos operativos"],
    ["Escalamientos", appState.data.escalamientos?.length || 0, "Niveles y criterios"],
    ["Documentos", appState.data.documentacion?.length || 0, "Guías y estándares"]
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
  $("#modeloGrid").innerHTML = principios.map((item) => `
    <article class="card searchable-item">
      <h3>${escapeHtml(item.nombre)}</h3>
      <p>${escapeHtml(item.descripcion)}</p>
      ${renderTags(item.artefactos)}
    </article>
  `).join("");
}

function renderProductos() {
  const productos = appState.data.productos || [];
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
      ${productos.map((producto) => `
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
      `).join("")}
    </tbody>
  `;
}

function renderMonitoreo() {
  const capas = appState.data.modelo?.monitoreo || [];
  $("#monitoreoGrid").innerHTML = capas.map((capa) => `
    <article class="card searchable-item">
      <h3>${escapeHtml(capa.capa)}</h3>
      <p>${escapeHtml(capa.descripcion)}</p>
      ${renderTags(capa.herramientas)}
    </article>
  `).join("");
}

function renderIncidentes() {
  const pasos = appState.data.modelo?.incidentes || [];
  $("#incidentesFlow").innerHTML = pasos.map((paso, index) => `
    <article class="flow-step searchable-item">
      <strong>${index + 1}</strong>
      <h3>${escapeHtml(paso.paso)}</h3>
      <p>${escapeHtml(paso.descripcion)}</p>
    </article>
  `).join("");
}

function renderEscalamientos() {
  const escalamientos = appState.data.escalamientos || [];
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
      ${escalamientos.map((item) => `
        <tr class="searchable-item">
          <td><strong>${escapeHtml(item.nivel)}</strong></td>
          <td>${escapeHtml(item.criterio)}</td>
          <td>${escapeHtml(item.tiempoObjetivo)}</td>
          <td>${escapeHtml(item.responsable)}</td>
          <td>${escapeHtml(item.salidaEsperada)}</td>
        </tr>
      `).join("")}
    </tbody>
  `;
}

function renderRunbooks() {
  const runbooks = appState.data.runbooks || [];
  $("#runbooksGrid").innerHTML = runbooks.map((runbook) => `
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
  `).join("");
}

function renderDocumentacion() {
  const documentos = appState.data.documentacion || [];
  $("#documentacionGrid").innerHTML = documentos.map((doc) => `
    <article class="card searchable-item">
      <span class="status ${statusClass(doc.estado)}">${escapeHtml(doc.estado)}</span>
      <h3>${escapeHtml(doc.titulo)}</h3>
      <p>${escapeHtml(doc.descripcion)}</p>
      <div class="meta-list">
        <div class="meta-item"><span>Tipo</span><strong>${escapeHtml(doc.tipo)}</strong></div>
      </div>
      <p><a class="pill" href="${escapeHtml(doc.url)}">Abrir documento</a></p>
    </article>
  `).join("");
}

function renderLinks() {
  const links = appState.data.links || [];
  $("#linksGrid").innerHTML = links.map((link) => `
    <article class="card searchable-item">
      <span class="tag">${escapeHtml(link.categoria)}</span>
      <h3>${escapeHtml(link.nombre)}</h3>
      <p>${escapeHtml(link.descripcion)}</p>
      <p><a class="pill" href="${escapeHtml(link.url)}" target="_blank" rel="noreferrer">Abrir referencia</a></p>
    </article>
  `).join("");
}

function renderCapacitaciones() {
  const capacitaciones = appState.data.capacitaciones || [];
  $("#capacitacionesGrid").innerHTML = capacitaciones.map((item) => `
    <article class="card searchable-item">
      <h3>${escapeHtml(item.modulo)}</h3>
      <p>${escapeHtml(item.objetivo)}</p>
      <div class="meta-list">
        <div class="meta-item"><span>Audiencia</span><strong>${escapeHtml(item.audiencia)}</strong></div>
        <div class="meta-item"><span>Duración</span><strong>${escapeHtml(item.duracion)}</strong></div>
      </div>
      ${renderTags(item.actividades)}
    </article>
  `).join("");
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

function toggleSidebar() {
  $("#sidebar").classList.toggle("open");
}

window.toggleSidebar = toggleSidebar;
setupSearch();
setupActiveNavigation();
loadAllData();
