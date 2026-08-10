/* ============================================================
   MEDICIÓN — Clean Colors
   ------------------------------------------------------------
   👉 LO ÚNICO QUE HAY QUE CAMBIAR ESTÁ EN LA LÍNEA DE ABAJO.

   Pega entre las comillas el ID que te da Google Analytics.
   Empieza con G- seguido de letras y números. Ejemplo: "G-4XY7ZQ1B2C"

   Mientras diga G-XXXXXXXXXX, la medición queda apagada sola:
   el sitio no carga nada de Google y no pasa absolutamente nada.
   ============================================================ */

var CC_GA_ID = "G-XXXXXXXXXX";

/* ------------------------------------------------------------
   De aquí para abajo no hace falta tocar nada.
   ------------------------------------------------------------ */
(function () {
  "use strict";

  if (!CC_GA_ID || CC_GA_ID.indexOf("XXXX") !== -1) return;   // sin ID → no se mide nada

  // 1 · Carga de Google Analytics 4
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + CC_GA_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", CC_GA_ID, { anonymize_ip: true });

  // 2 · Dónde ocurrió el clic, para saber qué sección convierte
  function zona(el) {
    var n = el;
    while (n && n !== document.body) {
      if (n.id) return n.id;
      if (n.tagName === "FOOTER") return "pie";
      if (n.tagName === "NAV") return "menu";
      n = n.parentElement;
    }
    return "otra";
  }

  // 3 · Eventos que sí importan para una lavandería
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a");
    if (!a || !a.href) return;
    var h = a.href, ev = null, extra = {};

    if (h.indexOf("wa.me") !== -1 || h.indexOf("whatsapp.com") !== -1) {
      ev = "clic_whatsapp";
    } else if (h.indexOf("google.com/maps") !== -1) {
      ev = "clic_como_llegar";
    } else if (h.indexOf("tel:") === 0) {
      ev = "clic_telefono";
    } else if (h.indexOf("mailto:") === 0) {
      ev = "clic_correo";
    } else if (h.indexOf("instagram.com") !== -1) {
      ev = "clic_red_social"; extra.red = "instagram";
    } else if (h.indexOf("facebook.com") !== -1) {
      ev = "clic_red_social"; extra.red = "facebook";
    }

    if (ev) {
      extra.zona = zona(a);
      extra.pagina = location.pathname;
      gtag("event", ev, extra);
    }
  }, true);

  // 4 · Envío del formulario de contacto
  var form = document.querySelector('form[action*="formsubmit"]');
  if (form) {
    form.addEventListener("submit", function () {
      var sel = form.querySelector('[name="servicio"]');
      gtag("event", "generate_lead", {
        metodo: "formulario_web",
        servicio: sel ? sel.value : "sin especificar"
      });
    });
  }

  // 5 · La página de gracias confirma que el mensaje sí salió
  if (location.pathname.indexOf("gracias") !== -1) {
    gtag("event", "lead_confirmado", { metodo: "formulario_web" });
  }

  // 6 · Página no encontrada, para cazar enlaces rotos
  if (document.title.indexOf("404") !== -1 || location.pathname.indexOf("404") !== -1) {
    gtag("event", "pagina_no_encontrada", { ruta: location.pathname + location.search });
  }
})();
