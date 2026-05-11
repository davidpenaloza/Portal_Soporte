const params = new URLSearchParams(window.location.search);
const rawDocPath = params.get("doc") || "";

const titleElement = document.querySelector("#documentTitle");
const pathElement = document.querySelector("#documentPath");
const statusElement = document.querySelector("#documentStatus");
const contentElement = document.querySelector("#markdownContent");
const tocElement = document.querySelector("#documentToc");
const openMarkdownLink = document.querySelector("#openMarkdown");

function escapeHtml(value = "") {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeDocPath(value) {
  const path = String(value || "").trim().replace(/^\.\//, "");
  if (!path) throw new Error("No se indicó el parámetro doc en la URL.");
  if (!path.startsWith("docs/")) throw new Error("Solo se permite cargar documentación ubicada dentro de docs/.");
  if (path.startsWith("/") || path.includes("../") || path.includes("..\\") || path.includes("\\")) throw new Error("La ruta del documento contiene segmentos inseguros.");
  if (!path.toLowerCase().endsWith(".md")) throw new Error("El visor solo acepta archivos Markdown con extensión .md.");
  return path;
}

function titleFromPath(path) {
  return path.split("/").pop().replace(/\.md$/i, "").replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function slugify(value, usedIds) {
  const base = String(value || "seccion")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "seccion";
  let slug = base;
  let index = 2;
  while (usedIds.has(slug)) {
    slug = `${base}-${index}`;
    index += 1;
  }
  usedIds.add(slug);
  return slug;
}

function showStatus(message, isError = false) {
  statusElement.hidden = false;
  statusElement.textContent = message;
  statusElement.classList.toggle("is-error", isError);
}

function clearStatus() {
  statusElement.hidden = true;
  statusElement.textContent = "";
  statusElement.classList.remove("is-error");
}

function resolveMarkdownLink(href, currentDocPath) {
  const value = String(href || "").trim();
  if (!value || value.startsWith("#") || /^[a-z][a-z0-9+.-]*:/i.test(value) || !value.toLowerCase().endsWith(".md")) return value;
  if (value.startsWith("/")) return value;

  const baseParts = currentDocPath.split("/").slice(0, -1);
  const parts = (value.startsWith("docs/") ? value.split("/") : [...baseParts, ...value.replace(/^\.\//, "").split("/")]);
  const normalized = [];
  for (const part of parts) {
    if (!part || part === ".") continue;
    if (part === "..") return value;
    normalized.push(part);
  }
  const target = normalized.join("/");
  return target.startsWith("docs/") ? `./documento.html?doc=${target}` : value;
}

function rewriteMarkdownLinks(currentDocPath) {
  contentElement.querySelectorAll("a[href]").forEach((link) => {
    const resolved = resolveMarkdownLink(link.getAttribute("href"), currentDocPath);
    link.setAttribute("href", resolved);
  });
}

function buildToc() {
  const headings = Array.from(contentElement.querySelectorAll("h2, h3"));
  const usedIds = new Set();

  headings.forEach((heading) => {
    heading.id = heading.id || slugify(heading.textContent, usedIds);
  });

  if (!headings.length) {
    tocElement.innerHTML = "<p>Este documento no contiene encabezados h2 o h3.</p>";
    return;
  }

  tocElement.innerHTML = headings.map((heading) => `
    <a class="toc-${heading.tagName.toLowerCase()}" href="#${escapeHtml(heading.id)}">${escapeHtml(heading.textContent)}</a>
  `).join("");
}

async function loadMarkdown() {
  let docPath;
  try {
    docPath = normalizeDocPath(rawDocPath);
  } catch (error) {
    titleElement.textContent = "Documento no disponible";
    pathElement.textContent = rawDocPath || "Sin ruta";
    showStatus(error.message, true);
    tocElement.innerHTML = "<p>No hay contenido para mostrar.</p>";
    return;
  }

  titleElement.textContent = titleFromPath(docPath);
  pathElement.textContent = docPath;
  openMarkdownLink.href = `./${docPath}`;
  openMarkdownLink.hidden = false;

  try {
    showStatus("Cargando contenido Markdown...");
    const response = await fetch(`./${docPath}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`No se pudo cargar el documento (HTTP ${response.status}).`);

    const markdown = await response.text();
    const unsafeHtml = window.marked?.parse ? window.marked.parse(markdown) : `<pre>${escapeHtml(markdown)}</pre>`;
    const safeHtml = window.DOMPurify?.sanitize ? window.DOMPurify.sanitize(unsafeHtml) : unsafeHtml;
    contentElement.innerHTML = safeHtml;
    rewriteMarkdownLinks(docPath);
    const firstHeading = contentElement.querySelector("h1");
    if (firstHeading?.textContent) titleElement.textContent = firstHeading.textContent;
    buildToc();
    clearStatus();
  } catch (error) {
    contentElement.innerHTML = "";
    tocElement.innerHTML = "<p>No hay contenido para mostrar.</p>";
    showStatus(`${error.message} Verifica que la ruta exista, esté dentro de docs/ y se publique junto al portal estático.`, true);
  }
}

loadMarkdown();
