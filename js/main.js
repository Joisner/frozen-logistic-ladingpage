(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky header ---------- */
  var header = document.getElementById("siteHeader");
  function onScroll() {
    if (window.scrollY > 40) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal-up");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Animated stat counters ---------- */
  var statEls = document.querySelectorAll(".stat-num[data-count]");
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    if (reduceMotion) { el.textContent = target; return; }
    var duration = 1400;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (statEls.length && "IntersectionObserver" in window) {
    var statIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            statIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    statEls.forEach(function (el) { statIO.observe(el); });
  }

  /* ---------- Gallery carousel (desktop + mobile) ---------- */
  (function initGalleryCarousel() {
    var gallery = document.getElementById("gallery");
    var dotsWrap = document.getElementById("galleryDots");
    if (!gallery || !dotsWrap) return;

    var imgs = Array.prototype.slice.call(gallery.querySelectorAll("img"));
    if (!imgs.length) return;

    var pageLang = (document.documentElement.lang || "es").slice(0, 2);
    var photoWord = pageLang === "en" ? "Photo" : "Foto";
    var prevWord = pageLang === "en" ? "Previous photo" : "Foto anterior";
    var nextWord = pageLang === "en" ? "Next photo" : "Siguiente foto";

    var dots = imgs.map(function (img, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "gallery-dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("aria-label", photoWord + " " + (i + 1));
      dot.addEventListener("click", function () {
        goToSlide(i);
        restartAutoplay();
      });
      dotsWrap.appendChild(dot);
      return dot;
    });
    imgs[0].classList.add("is-active");

    var prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.className = "gallery-arrow gallery-arrow--prev";
    prevBtn.setAttribute("aria-label", prevWord);
    prevBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>';

    var nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "gallery-arrow gallery-arrow--next";
    nextBtn.setAttribute("aria-label", nextWord);
    nextBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>';

    gallery.appendChild(prevBtn);
    gallery.appendChild(nextBtn);

    var current = 0;
    var timer = null;

    function goToSlide(index) {
      current = (index + imgs.length) % imgs.length;
      imgs.forEach(function (img, i) { img.classList.toggle("is-active", i === current); });
      dots.forEach(function (dot, i) { dot.classList.toggle("is-active", i === current); });
    }

    function nextSlide() { goToSlide(current + 1); }
    function prevSlide() { goToSlide(current - 1); }

    function startAutoplay() {
      stopAutoplay();
      if (reduceMotion || imgs.length < 2) return;
      timer = setInterval(nextSlide, 4200);
    }
    function stopAutoplay() {
      if (timer) { clearInterval(timer); timer = null; }
    }
    function restartAutoplay() { startAutoplay(); }

    prevBtn.addEventListener("click", function () { prevSlide(); restartAutoplay(); });
    nextBtn.addEventListener("click", function () { nextSlide(); restartAutoplay(); });

    /* Swipe support */
    var touchStartX = null;
    gallery.addEventListener("touchstart", function (e) {
      touchStartX = e.touches[0].clientX;
      stopAutoplay();
    }, { passive: true });
    gallery.addEventListener("touchend", function (e) {
      if (touchStartX === null) return;
      var delta = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) > 40) {
        goToSlide(delta < 0 ? current + 1 : current - 1);
      }
      touchStartX = null;
      restartAutoplay();
    }, { passive: true });

    gallery.addEventListener("mouseenter", stopAutoplay);
    gallery.addEventListener("mouseleave", restartAutoplay);

    startAutoplay();
  })();

  /* ---------- Frost particles ---------- */
  var particleWrap = document.getElementById("frostParticles");
  if (particleWrap && !reduceMotion) {
    var count = window.innerWidth < 640 ? 12 : 26;
    for (var i = 0; i < count; i++) {
      var span = document.createElement("span");
      span.style.left = Math.random() * 100 + "%";
      span.style.animationDuration = 9 + Math.random() * 10 + "s";
      span.style.animationDelay = Math.random() * 12 + "s";
      span.style.opacity = (0.2 + Math.random() * 0.5).toFixed(2);
      particleWrap.appendChild(span);
    }
  }

  /* ---------- Contact form → mailto / Gmail (sin backend) ---------- */
  var form = document.getElementById("contactForm");
  var formNote = document.getElementById("formNote");
  var gmailFallback = document.getElementById("gmailFallback");
  var DEST_EMAIL = "gerencia@frozencargotransport.com";

  var I18N = {
    es: {
      fillError: "Por favor complete su nombre, un correo válido y su mensaje.",
      note: "Hemos abierto su programa de correo con la solicitud lista para enviar. Si no se abrió, use el enlace de Gmail de abajo.",
      subjectPrefix: "Solicitud de cotización — ",
      greeting: "Hola, quiero solicitar una cotización con los siguientes datos:",
      fields: { name: "Nombre completo", company: "Empresa", phone: "Teléfono", email: "Correo electrónico", service: "Servicio de interés", message: "Mensaje" },
      services: { almacenamiento: "Almacenamiento en frío", transporte: "Transporte de carga", inventario: "Gestión de inventario", otro: "Otro" },
      notProvided: "No especificado",
      signOff: "Quedo atento(a) a su respuesta. Gracias.",
      gmailLabel: "¿No se abrió su correo? Ábralo en Gmail →"
    },
    en: {
      fillError: "Please fill in your name, a valid email and your message.",
      note: "We've opened your email app with the request ready to send. If it didn't open, use the Gmail link below.",
      subjectPrefix: "Quote request — ",
      greeting: "Hi, I'd like to request a quote with the following details:",
      fields: { name: "Full name", company: "Company", phone: "Phone", email: "Email", service: "Service of interest", message: "Message" },
      services: { storage: "Cold storage", transport: "Cargo transport", inventory: "Inventory management", other: "Other" },
      notProvided: "Not specified",
      signOff: "Looking forward to your reply. Thank you.",
      gmailLabel: "Email didn't open? Open it in Gmail →"
    }
  };

  if (form) {
    var pageLang = (document.documentElement.lang || "es").slice(0, 2);
    var t = I18N[pageLang] || I18N.es;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var company = form.company.value.trim();
      var phone = form.phone.value.trim();
      var email = form.email.value.trim();
      var serviceValue = form.service.value;
      var message = form.message.value.trim();
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (gmailFallback) gmailFallback.hidden = true;

      if (!name || !email || !message || !emailPattern.test(email)) {
        formNote.textContent = t.fillError;
        formNote.classList.add("is-error");
        return;
      }

      formNote.classList.remove("is-error");

      var serviceLabel = t.services[serviceValue] || serviceValue;
      var bodyLines = [
        t.greeting,
        "",
        t.fields.name + ": " + name,
        t.fields.company + ": " + (company || t.notProvided),
        t.fields.phone + ": " + (phone || t.notProvided),
        t.fields.email + ": " + email,
        t.fields.service + ": " + serviceLabel,
        "",
        t.fields.message + ":",
        message,
        "",
        t.signOff
      ];
      var subject = t.subjectPrefix + name;
      var body = bodyLines.join("\n");

      var mailtoUrl = "mailto:" + DEST_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      var gmailUrl = "https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(DEST_EMAIL) +
        "&su=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);

      /*
        SIN BACKEND POR DISEÑO: este formulario no envía datos a ningún
        servidor. Al enviarlo, abre el cliente de correo predeterminado del
        usuario (mailto:) con el asunto y el cuerpo ya redactados a partir de
        los campos del formulario. Como respaldo, se muestra un enlace directo
        a Gmail (compose) con la misma información, por si el navegador no
        tiene un cliente de correo asociado a los enlaces mailto:.
      */
      window.location.href = mailtoUrl;

      formNote.textContent = t.note;

      if (gmailFallback) {
        gmailFallback.href = gmailUrl;
        gmailFallback.textContent = t.gmailLabel;
        gmailFallback.hidden = false;
      }
    });
  }
})();
