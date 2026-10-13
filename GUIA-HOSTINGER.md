# FROZEN LOGÍSTICA — Guía de análisis, entrega y migración a Hostinger

## Actualización — Logo real de la marca

- Se incorporó el logo oficial (la cinta infinita azul + wordmark) en todos los lugares donde antes había un ícono genérico o referencia temporal al sitio viejo:
  - **Navbar:** ícono de la cinta junto al texto "FROZEN LOGÍSTICA" (header en ambos idiomas).
  - **Pestaña del navegador / favicon:** `favicon.ico` en la raíz + versiones PNG en 16, 32 y 192px para pantallas de alta densidad.
  - **Ícono al agregar a pantalla de inicio (iOS/Android):** `apple-touch-icon.png` (180×180).
  - **Datos estructurados (schema.org):** el campo `logo` ahora apunta al logo real en vez del placeholder del sitio anterior.
- Los archivos del logo quedaron en `assets/images/` (`logo-navbar.png`, `favicon-16.png`, `favicon-32.png`, `favicon-192.png`, `apple-touch-icon.png`) y `favicon.ico` en la raíz del proyecto — súbelos junto con el resto de `assets/` a Hostinger.

## Actualización — WhatsApp + corrección de estructura bilingüe

- **Botón flotante de WhatsApp:** fijo en la esquina inferior derecha en ambas versiones (ES/EN), visible en toda la navegación, con mensaje predefinido según el idioma. Abre `wa.me` en una pestaña nueva.
- **Número del navbar:** ahora abre WhatsApp directamente (antes marcaba con `tel:`).
- **Corrección importante:** en el `.zip` que enviaste, los archivos `index.html` y `es/index.html` habían quedado **intercambiados** (la raíz tenía el contenido en español con metadatos apuntando a `/es/`, y `/es/` tenía el contenido en inglés apuntando a la raíz) — probablemente al renombrar/mover archivos localmente. Restauré el orden correcto: raíz = inglés (como el sitio real hoy), `/es/` = español. Verifica siempre, antes de subir a Hostinger, que `index.html` (raíz) abra en inglés y que `es/index.html` abra en español.
- **Formulario de cotización:** ya estaba corregido para ocupar el ancho completo desde el ajuste anterior (grid de 3 columnas en escritorio, colapsando a 2 y luego 1 en tablet/móvil) — revisé que no genere overflow horizontal en ningún breakpoint, incluidos móviles pequeños (320px).



- Se agregó la **versión en inglés completa** en `index.html` (raíz del paquete), replicando la estructura del sitio actual: la raíz del dominio (`/`) sirve el inglés y `/es/` sirve el español — igual que hoy en `frozencargotransport.com`.
- Se agregó un selector de idioma (**ES / EN**) visible en el header (desktop y mobile) y en el footer de ambas versiones, además de etiquetas `hreflang` para que Google indexe correctamente cada idioma.
- Se rediseñó la sección de **Contacto**: tarjetas con ícono, fondo con más contraste respecto al formulario, y bloque de correo/dirección con íconos — para que se vea menos plana y más equilibrada visualmente frente al formulario.



## 1. Lo que pude verificar sobre el sitio actual

Sí pude analizar el contenido, estructura y HTML del sitio (`https://frozencargotransport.com/es/`) mediante lectura directa de la página. **No pude determinar con certeza el proveedor de hosting ni el proveedor de DNS actuales**, porque no tengo acceso a herramientas de red en tiempo real (whois, `dig`/`nslookup`, o escaneo de IP) desde este entorno — solo puedo leer páginas web ya indexadas o dadas por ti, no ejecutar consultas DNS/whois en vivo. Esto es una limitación mía en esta conversación, no un dato sobre el sitio.

**Cómo obtenerlo tú en 2 minutos (y pegarme el resultado si quieres que lo interprete):**
1. Ve a `https://who.is/whois/frozencargotransport.com` o `https://www.whois.com/whois/frozencargotransport.com` → sección "Name Servers" te dice el DNS actual (ej. si ves `ns1.dinahosting.com`, `dns1.registrar-servers.com`, `ns1.hostgator.com`, etc., eso identifica al proveedor).
2. Ve a `https://www.whatsmydns.net`, escribe el dominio, tipo **A** → te da la IP del servidor. Con esa IP en `https://hostingchecker.co/` obtienes el proveedor de hosting.
3. Si me pegas aquí el resultado (nameservers e IP), te confirmo exactamente qué migrar y qué registros DNS tocar en Hostinger.

**Metadato que sí encontré en el HTML:** el sitio fue construido/gestionado por *"Jon Velas Web Agency"* (aparece como `meta-author`), lo cual sugiere que es probable que el hosting y dominio estén contratados a través de esa agencia o de un proveedor gestionado por ella — vale la pena preguntarles directamente, o revisar la factura/registro original del dominio.

## 2. Análisis del sitio actual

| Aspecto | Hallazgo |
|---|---|
| **Tecnología** | HTML generado por un constructor de plantillas tipo "sección por bloque" (posiblemente un CMS/builder no headless, dado el patrón de clases e IDs como `#features03-3`, `#contacts01-b`). No es WordPress estándar visible en el marcado. |
| **Idiomas** | Existen dos versiones: `/es/` (español, la que revisé) y raíz `/` (inglés). Cualquier despliegue nuevo debe conservar ambos idiomas o redirigir correctamente. |
| **Contenido a conservar** | Textos de servicios (almacenamiento, transporte, gestión de inventario), datos de capacidad (600/135 palets, 3 muelles), dirección, teléfonos por área, correo, mapa embebido, video de YouTube. |
| **Problemas de SEO detectados** | Faltan encabezados jerárquicos claros en varias secciones (mucho texto suelto sin `h2`/`h3`); no hay `sitemap.xml` ni `robots.txt` visibles; enlaces de redes sociales apuntan a URLs genéricas (`web.facebook.com/`, sin perfil específico) — hay que corregirlos con los perfiles reales; falta un `alt` descriptivo consistente en imágenes. |
| **Problemas de rendimiento probables** | Imágenes servidas en tamaños grandes sin formato moderno (`.jpg`/`.jpeg` sin WebP/AVIF), carrusel de imágenes pesado en el hero, sin lazy-loading visible. |
| **Elementos a mejorar/retirar** | Bloques largos de texto legal/operativo (política de inventario) mezclados en medio del contenido comercial — mejor moverlos a una sección o documento aparte, no en la landing principal. |

## 3. Lo que se entrega en este paquete

```
frozen-logistica-landing/
├── index.html          → Landing page en INGLÉS (raíz del dominio, como el sitio actual)
├── es/index.html         → Landing page en ESPAÑOL (carpeta /es/, como el sitio actual)
├── css/style.css        → Estilos compartidos (responsive, animaciones, sistema de diseño)
├── js/main.js            → Interacciones compartidas (menú, scroll reveal, contador, formulario)
├── robots.txt
├── sitemap.xml           → Incluye ambas versiones de idioma con anotaciones hreflang
└── GUIA-HOSTINGER.md     → Este documento
```

**Directorio de destino en Hostinger:** sube `index.html`, `css/`, `js/`, `robots.txt`, `sitemap.xml` y la carpeta `assets/` (una vez la crees, ver más abajo) a `public_html/`. Sube la carpeta `es/` completa también a `public_html/es/` — así se conserva exactamente la misma estructura de URLs que tiene el sitio hoy.

**Notas sobre las imágenes:** para que puedas ver el resultado de inmediato, el HTML referencia temporalmente las imágenes que ya están públicas en `frozencargotransport.com`. Antes de publicar en Hostinger, descarga esas imágenes, optimízalas (te recomiendo convertir a **WebP**, máx. ~1600px de ancho) y colócalas en una carpeta local `assets/images/` dentro de este mismo paquete, actualizando las rutas `src` en `index.html` de `https://frozencargotransport.com/es/assets/images/...` a `assets/images/...`.

**Formulario de contacto (sin backend, por decisión del cliente):** el formulario no envía datos a ningún servidor. Al hacer clic en "Enviar solicitud", arma automáticamente el asunto y el cuerpo del correo con todos los datos ingresados (nombre, empresa, teléfono, correo, servicio y mensaje) y abre el programa de correo predeterminado del visitante (`mailto:`) con ese mensaje ya redactado y listo para enviar a `gerencia@frozencargotransport.com`. Como respaldo, debajo del botón aparece un enlace "Ábralo en Gmail" que abre la misma solicitud directamente en Gmail (compose), por si el navegador del visitante no tiene un cliente de correo asociado. Funciona igual en español e inglés. Si en el futuro quieren un formulario que guarde las solicitudes en una base de datos o las envíe sin depender del correo del visitante, ahí sí se necesitaría un backend (script PHP en Hostinger o un servicio como Web3Forms/Formspree).

## 4. Pasos para desplegar en Hostinger

1. **Archivos a subir:** todo el contenido de la carpeta `frozen-logistica-landing/` (no la carpeta en sí, sino lo que hay dentro).
2. **Directorio de destino:** en hPanel de Hostinger → **Archivos → Administrador de archivos** → carpeta `public_html/` (si el dominio es el principal de la cuenta) o `public_html/es/` si quieres conservar la misma ruta que el sitio actual para no romper enlaces indexados.
3. **Dominio:** en hPanel → **Dominios**, agrega o confirma que `frozencargotransport.com` esté conectado como dominio principal de esa cuenta de hosting.
4. **DNS a revisar/modificar:**
   - Si el dominio se transfiere/gestiona en Hostinger: cambia los **nameservers** del dominio (en el registrador actual) a los que te indique Hostinger (normalmente `ns1.dns-parking.com` / `ns2.dns-parking.com` durante la configuración, luego los definitivos del plan).
   - Si el dominio se queda en el registrador actual: en vez de cambiar nameservers, apunta el registro **A** de `@` a la IP del hosting de Hostinger, y el registro **CNAME** de `www` al dominio o a la IP según indique Hostinger. Revisa también registros **MX** si usas correo con ese dominio, para no perder el correo al migrar.
5. **HTTPS/SSL:** en hPanel → **Seguridad → SSL**, activa el certificado SSL gratuito (Let's Encrypt) una vez el dominio apunte correctamente al hosting; Hostinger lo emite automáticamente en minutos. Verifica que el sitio fuerce `https://` (Hostinger tiene una opción de "Forzar HTTPS").
6. **Verificar que el dominio apunta al nuevo hosting:** usa `https://www.whatsmydns.net` con el dominio y tipo **A** — cuando la mayoría de ubicaciones muestre la IP del hosting de Hostinger, la propagación está lista (puede tardar de minutos a 24-48h).
7. **Verificar que la página funciona:** entra directamente por la IP o por un dominio temporal de Hostinger antes de cambiar el DNS definitivo, revisa que cargue el CSS/JS (rutas relativas), prueba el formulario, y revisa en móvil real.
8. **Google Search Console:** en `search.google.com/search-console`, agrega la propiedad `https://frozencargotransport.com/`, verifica por **archivo HTML** (Hostinger te deja subirlo a `public_html/`) o por **registro DNS TXT** (más robusto si vas a cambiar de hosting en el futuro).
9. **Enviar el sitemap:** dentro de Search Console → **Sitemaps** → escribe `sitemap.xml` y envía. Verifica que `https://frozencargotransport.com/robots.txt` sea accesible y apunte al sitemap correcto.

## 5. Orden recomendado de trabajo

**Analizar → desarrollar → probar en Hostinger (subdominio temporal o IP) → configurar dominio y DNS → verificar propagación y SSL → publicar → enviar a Search Console → retirar la página antigua solo cuando la nueva esté verificada y funcionando.**

No se ha tocado ni eliminado nada del sitio actual — este paquete es completamente independiente y listo para revisión antes de publicarse.
