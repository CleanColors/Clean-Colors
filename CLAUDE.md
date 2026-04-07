# CLAUDE.md — Clean Colors Website

Instrucciones específicas para trabajar en este proyecto. Leer antes de hacer cualquier cambio.

---

## Estructura del proyecto

Sitio web estático de **Clean Colors Lavandería** (cleancolors.mx), desplegado en **Netlify** con auto-deploy desde **GitHub**.

### Páginas

| Archivo | URL | Descripción |
|---|---|---|
| `index.html` | cleancolors.mx/ | Home principal |
| `productos.html` | cleancolors.mx/productos.html | Línea de productos marca propia ← NUEVA |
| `autoempleo.html` | cleancolors.mx/autoempleo.html | Programa de autoempleo |
| `empresas.html` | cleancolors.mx/empresas.html | Servicio a empresas |
| `lealtad.html` | cleancolors.mx/lealtad.html | Plan de lealtad / cashback |
| `aviso-de-privacidad.html` | cleancolors.mx/aviso-de-privacidad.html | Aviso legal |
| `gracias.html` | cleancolors.mx/gracias.html | Confirmación de formulario (sin nav) |
| `404.html` | — | Página de error |

### Archivos clave

- **`styles.css`** — Hoja de estilos global. Contiene todos los estilos base del sitio. **No modificar sin revisar el impacto en todas las páginas.**
- **`logo.png`** — Logo principal usado en el nav (recortado, sin márgenes transparentes, 800×222px).
- **`logo-horizontal.png`** — Versión horizontal del logo (usada en `aviso-de-privacidad.html`).
- **`favicon.png`** — Ícono del sitio.
- **`productos-botellas.svg`** — Ilustración SVG de las 4 botellas 10ml marca propia (inline o como `<img>`).
- Imágenes del local: `local-fachada.webp`, `local-entrada.webp`, `local-panoramica.webp`, `local-equipos.webp`, `local-maquinas.webp`, `local-clientes.webp`.
- Galería: `galeria-1.png` a `galeria-4.png`.
- Carpeta `/img/`: versiones adicionales de imágenes y logos.

---

## Arquitectura CSS — CRÍTICO

### Regla principal
Cada página tiene su propio bloque `<style>` en el `<head>`. **Ese bloque contiene CSS crítico específico de la página** — NO reemplazarlo completo. Solo agregar o modificar líneas puntuales con `sed` o edición directa.

### Estructura del nav (consistente en todas las páginas)
```css
nav { padding: 0 5% !important; }
.nav-logo img { height: 55px !important; width: auto !important; }
@media(max-width:768px) {
  .nav-logo img { height: 45px !important; }
}
```
- El logo base en `styles.css` es `height: 40px` — las páginas lo sobreescriben a 55px.
- El nav tiene **9 ítems** (sin dropdown): Servicios · Instalaciones · Promociones · **Productos** · Plan de Lealtad · Autoempleo · Servicio a Empresas · Reseñas · Contacto.
- **Hamburger activo en `≤1140px`** (breakpoint en `styles.css`). En móvil/tablet se despliega panel lateral desde la derecha (280px).
- El botón hamburger es un `<button id="nav-hamburger">` con 3 `<span>`. IDs estandarizados: `nav-hamburger`, `nav-links`, `nav-overlay`.
- Hay un `<div class="nav-overlay" id="nav-overlay"></div>` inmediatamente después del `</nav>` en todas las páginas — sirve de backdrop oscuro para cerrar el menú móvil al tocar fuera.
- El JS del hamburger va al final de cada página (antes de `</body>`). Función `closeMenu()` compartida.

**HTML de nav estándar:**
```html
<nav>
  <a href="index.html" class="nav-logo"><img src="logo.png" alt="Clean Colors Logo"/></a>
  <button class="nav-hamburger" id="nav-hamburger" aria-label="Abrir menú" aria-expanded="false">
    <span></span><span></span><span></span>
  </button>
  <ul class="nav-links" id="nav-links">
    <li><a href="index.html#servicios">Servicios</a></li>       <!-- o #servicios si es index -->
    <li><a href="index.html#instalaciones">Instalaciones</a></li>
    <li><a href="index.html#promociones">Promociones</a></li>
    <li><a href="productos.html">Productos</a></li>
    <li><a href="lealtad.html">Plan de Lealtad</a></li>
    <li><a href="autoempleo.html">Autoempleo</a></li>
    <li><a href="empresas.html">Servicio a Empresas</a></li>
    <li><a href="index.html#testimonios">Reseñas</a></li>
    <li><a href="index.html#contacto">Contacto</a></li>
  </ul>
</nav>
<div class="nav-overlay" id="nav-overlay"></div>
```

**JS del hamburger (al final de cada página):**
```javascript
const hamburger=document.getElementById('nav-hamburger'),navLinks=document.getElementById('nav-links'),overlay=document.getElementById('nav-overlay');
function closeMenu(){hamburger.classList.remove('active');hamburger.setAttribute('aria-expanded','false');navLinks.classList.remove('open');overlay.classList.remove('open');document.body.style.overflow='';}
hamburger.addEventListener('click',function(){const isOpen=navLinks.classList.toggle('open');hamburger.classList.toggle('active');hamburger.setAttribute('aria-expanded',isOpen);overlay.classList.toggle('open');document.body.style.overflow=isOpen?'hidden':'';});
overlay.addEventListener('click',closeMenu);
navLinks.querySelectorAll('a').forEach(function(a){a.addEventListener('click',closeMenu);});
```

### Hero de index.html (`#hero`)
```css
#hero {
  padding-top: 4.5rem !important;
  justify-content: flex-start !important;
  background: linear-gradient(170deg,#1A3A55 0%,#1E4A70 50%,#153D5A 100%) !important;
}
```
- El hero original en `styles.css` usa `#0A1E30` (más oscuro). El override lo aclara.
- `justify-content: flex-start` empuja el contenido hacia arriba.

### Hero de páginas internas (`.page-hero`)
Cada página interna tiene sus propios estilos de `.page-hero` dentro de su bloque `<style>`. Son diferentes entre sí. **No tocar el diseño de las páginas internas a menos que se pida explícitamente.**

---

## Deploy

### Flujo
1. Editar archivos localmente en esta carpeta (`CLEAN COLORS_Web`).
2. Copiar al repo git en `/sessions/magical-ecstatic-cannon/cc-deploy/` ← **NO usar /tmp/ (permisos)**
3. Commit + push → Netlify auto-despliega en ~30 segundos.

### Repo git (directorio de sesión)
```bash
DEPLOY=/sessions/magical-ecstatic-cannon/cc-deploy
# Si no existe, clonar con token:
git clone https://[TOKEN_EN_ARCHIVO_LOCAL_NO_COMPARTIR]@github.com/CleanColors/Clean-Colors.git $DEPLOY
# Configurar identidad (primera vez por sesión):
cd $DEPLOY && git config user.email "cleancolors@cleancolors.mx" && git config user.name "Clean Colors"
```

### Credenciales GitHub
- **Token PAT**: `[TOKEN_EN_ARCHIVO_LOCAL_NO_COMPARTIR]`
- **Remote**: `https://github.com/CleanColors/Clean-Colors.git`
- **Branch**: `main`

### Flujo completo de push
```bash
DEPLOY=/sessions/magical-ecstatic-cannon/cc-deploy
WEB="/sessions/magical-ecstatic-cannon/mnt/CLEAN COLORS_Web"
cp "$WEB/archivo.html" $DEPLOY/
cd $DEPLOY
git add archivo.html
git commit -m "Descripción del cambio"
git push origin main
```

---

## Reglas de trabajo — aprendidas a las malas

1. **Nunca reemplazar el bloque `<style>` completo** de ninguna página. Cada uno tiene CSS crítico de diseño que no está en `styles.css`.
2. **Nunca tocar `styles.css`** sin analizar el impacto en todas las páginas. Todos los overrides van en el `<style>` inline de cada página.
3. **Las páginas internas** (autoempleo, empresas, lealtad, productos) tienen diseños propios. Cambios en el nav o logo → solo modificar los valores específicos (`height`, `padding`), no la estructura del bloque.
4. **Verificar en el sitio live** antes de declarar algo listo. Netlify tarda ~30 segundos.
5. **Antes de cualquier cambio**, revisar el git log: `git log --oneline -10`
6. **Respaldo**: Esta carpeta (`CLEAN COLORS_Web`) es el respaldo local. Sincronizar después de cada sesión de cambios.
7. **`empresas.html` tenía el script de burbujas truncado** — ya fue reparado (Abril 2026). Si algo parece truncado al final de un archivo, verificar con Python antes de editar.
8. **El repo git en sesión temporal** no puede estar en `/tmp/` — usar `/sessions/magical-ecstatic-cannon/cc-deploy/` (clonar si no existe).
9. **Al agregar ítems al nav**, reconsiderar el breakpoint del hamburger en `styles.css`. Con 9 ítems el breakpoint es `1140px`.
10. **`gracias.html` no tiene nav** — no incluirla en actualizaciones de navegación.

---

## Estado actual (Abril 2026)

### Visual y estructura
- Logo recortado a 800×222px (sin márgenes transparentes).
- Hero de index: gradiente azul aclarado (`#1A3A55` → `#1E4A70`).
- Badges del hero: 5 burbujas (2 grandes: 1,000+ Clientes / 5★; 3 normales: 3H / 100% Eco / +10 Máquinas).
- Nav: logo 55px desktop / 45px móvil. Breakpoint hamburger: **1140px**.
- Páginas internas: diseño original restaurado.

### Navegación
- **9 ítems** en nav, sin dropdown: Servicios · Instalaciones · Promociones · Productos · Plan de Lealtad · Autoempleo · Servicio a Empresas · Reseñas · Contacto.
- Hamburger funcional en todas las páginas (excepto `gracias.html`). Con overlay y bloqueo de scroll.

### Contenido — cambios sesión Abril 2026
- `autoempleo.html` → "Sin contratos" cambiado a **"Sin compromiso de largo plazo"**.
- `index.html` → Título "Nuestro Espacio" ahora en un solo renglón (quitado `<br>`).
- `empresas.html` → Botones "Solicitar cotización" → **"Contáctanos"**, email `info_ventas@cleancolors.mx`. Emoji salones de belleza: 💅. Script de burbujas estaba truncado → **reparado**.
- `productos.html` → **Página nueva**. Línea de productos marca propia Clean Colors: Detergente, Detergente Neutro, Suavizante, Desengrasante. Todos biodegradables. CTA: solo en tienda.
- `productos-botellas.svg` → **Archivo nuevo**. Ilustración SVG de 4 botellas 10ml con branding Clean Colors, usada en `productos.html`.
- `index.html` → Nueva sección `#productos` (teaser de 4 cards) antes de `#testimonios`.

### Emails configurados
- Contacto general (formulario index.html): pendiente de revisar (Cloudflare obfuscation).
- Empresas: `info_ventas@cleancolors.mx` (botón "Contáctanos" en hero y CTA final).

### Último commit
`d9d3196` — "Sección y página de Productos Clean Colors: botellas SVG, biodegradables, marca propia, nav 9 ítems"
