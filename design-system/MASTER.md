# Playas sin Sargazo · Design system

Sistema visual de la maqueta **Playas sin Sargazo · Cancún Live** (SAiMON VISION · Seguritech).

- **Criticidad:** estándar. Sitio público de consulta. No aplica la capa de misión crítica.
- **Stack:** HTML, CSS y JavaScript sin framework. Una sola hoja: `css/styles.css`.
- **Alcance de esta versión:** maqueta para aprobación de diseño. Hoteles, horarios, métricas, teléfono, sitio web y textos legales son **datos simulados**. No hay backend.

Los tokens de abajo son los de la maqueta aprobable. No se agregan colores ni tipografías de interfaz fuera de esta lista.

## Color

| Token | Valor | Uso |
|---|---|---|
| `--navy` | `#25356D` | Fondo principal |
| `--navy-2` | `#23336B` | Degradado, tramo medio |
| `--navy-3` | `#1F2D61` | Degradado, tramo bajo |
| `--navy-mid` | `#22316A` | Degradado diagonal de visores |
| `--navy-deep` | `#1B2750` | Fondo inferior y footer |
| `--stream` | `#1B2A4E` | Respaldo del visor de cámara |
| `--blue` | `#2A4A93` | Pines del mapa y respaldo de foto |
| `--red` | `#DB2C34` | Punto de títulos, EN VIVO, marca del isotipo |
| `--green` | `#1FA971` | Estado “Sin sargazo” |
| `--green-bg` | `#DDF3E8` | Fondo del chip verde |
| `--green-ink` | `#0B6E45` | Texto del chip verde |
| `--amber` | `#F2A93B` | Estado “En revisión” |
| `--amber-bg` | `#FCEBD0` | Fondo del chip ámbar |
| `--amber-ink` | `#7A4A06` | Texto del chip ámbar |
| `--white` | `#FFFFFF` | Texto principal, botones claros, isotipo |
| `--paper` | `#F7F9FC` | Etiqueta clara sobre el mapa ilustrado |
| `--sea` | `#7FD9D6` | Agua del minimapa |
| `--text-2` | `#C9D3EA` | Texto secundario sobre navy |
| `--text-3` | `#DCE3F2` | Párrafos y texto terciario |
| `--line` | `rgba(255, 255, 255, 0.18)` | Divisiones |

Atmósfera (no son colores de interfaz; solo brillos de fondo):

| Token | Valor | Uso |
|---|---|---|
| `--orb-teal` | `46, 183, 199` | Brillo turquesa, se usa como `rgba(var(--orb-teal), α)` |
| `--orb-blue` | `58, 96, 190` | Brillo azul |

El blanco con alpha (8% a 30%) construye vidrio, velos y bordes. No es un color nuevo.

El estado nunca viaja solo en el color: “Sin sargazo” y “En revisión” llevan texto, y el punto de color lo refuerza.

## Tipografía

| Token | Valor |
|---|---|
| `--font` | `'Manrope', 'Avenir Next World', 'Avenir Next', system-ui, sans-serif` |

Manrope sustituye a Avenir Next World mientras la marca no tenga la licencia web. Si llega la licencia, se carga Avenir y se deja primero en `--font`.

| Rol | Tamaño | Peso |
|---|---|---|
| Título de hero | `clamp(36px, 4.2vw, 60px)` | 700 |
| Métricas del hero | `clamp(52px, 6vw, 84px)` | 300, las tres con el mismo peso |
| Display de sección | 72–88 px en escritorio; 48 px bajo 640 px | 300 |
| Título de panel (ficha) | 64 px; 56 px en móvil | 300 |
| Subtítulo de paso | 28 px | 400 |
| Cuerpo | 15–17 px | 400–500 |
| Etiqueta (`.eyebrow`, `.label`) | 11–12 px, tracking amplio, mayúsculas | 700 |

El punto rojo (`.dot-red`) cierra los títulos de sección. No se usa como viñeta suelta.

Los nombres de hoteles en la franja de participantes imitan su wordmark. Esa variación es del logo del hotel, no de la interfaz. La interfaz no usa otra familia.

## Espaciado, radio y sombra

| Token | Valor | Uso |
|---|---|---|
| `--gutter` | `48px` | Margen de página. `24px` bajo 900 px. `16px` bajo 640 px. |
| `--radius-pill` | `999px` | Botones, buscador, chips, píldora EN VIVO |
| `--shadow` | `0 10px 28px rgba(10, 16, 40, 0.3)` | Tarjetas |

Radios fijos ya usados: 18 px (tarjeta de cámara), 24 px (visor y diálogos), 16 px (filas y logos), 12 px (campos).

Contenedor de lectura: `max-width: 1344px`. La página de hoteles usa `1440px` (`.container--wide`).

## Componentes

Construir con estas clases. No duplicar el componente con estilos inline.

| Clase | Qué es |
|---|---|
| `.depth-bg` `.orbs` `.orb` | Fondo navy con textura de olas y brillos |
| `.glass` `.glass-dark` | Superficie clara y superficie sobre foto o video |
| `.btn` `.btn--light` `.btn--ghost` `.btn--lg` `.btn--compact` | Acciones |
| `.pill` `.live-dot` `.badge-live` | Indicador EN VIVO |
| `.search` | Buscador en píldora |
| `.cam-card` `.chip-ok` `.chip-warn` | Tarjeta de playa y estados. El cuerpo de la tarjeta es vidrio oscuro al 58% para que se vea el fondo. La foto es un video en bucle, mudo, de una de las tres tomas de ejemplo. |
| `.carousel` | Carrusel horizontal. Avanza una tarjeta y, al pasar la última, sigue con una copia para no saltar al inicio. |
| `.site-header` `.site-footer` `.logo` | Marco del sitio. El encabezado es sticky y lleva fondo de vidrio para seguir visible al bajar. |
| `.to-top` | Botón fijo para volver arriba. Aparece después de bajar unos 480 px. |
| `.map-pin` `.photo-pin` `.map-popup` | Pines del mapa |
| `.viewer` `.stream` `.drawer` | Ficha de cámara. El visor reproduce la misma toma que la tarjeta. La tarjeta del hotel, con Google Maps, va encima de las métricas. La línea de tiempo sigue en el HTML y está oculta con `.is-concealed`. Sobre el video solo quedan las etiquetas y el botón blanco Detalles. |
| `.info-dialog` | Diálogo de “cómo leer el sitio” |
| `.form-grid` `.field` `.success` | Solicitud de afiliación |

## Movimiento

- El fondo de olas se desplaza en 90 s. Los brillos flotan entre 22 y 34 s. El punto EN VIVO pulsa en 1.6 s.
- Al abrir la home, el título, la búsqueda y las tarjetas entran con un ascenso de 0.8 s. Las métricas cuentan de cero a su valor.
- Al bajar, cada bloque aparece con un ascenso de 0.7 s. Los elementos de un mismo grupo entran en secuencia, con 90 ms de diferencia.
- `prefers-reduced-motion: reduce` deja los números en su valor final y muestra los bloques sin animación.
- El foco de teclado es un contorno blanco de 2 px (`:focus-visible`).

## Páginas

| Archivo | Pantalla |
|---|---|
| `index.html` | Home |
| `playa.html` | Ficha de cámara (Hotel Azul Caribe, simulada) |
| `playa-no-disponible.html` | Playa en revisión |
| `mapa.html` | Mapa en vivo |
| `hoteles.html` | Afiliación |
| `sitio-hotel.html` | Destino simulado del botón “Visitar sitio del hotel” |
| `aviso.html` `terminos.html` | Textos legales simulados |

No hay overrides por pantalla en `design-system/pages/`.
