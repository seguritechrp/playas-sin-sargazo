# Playas sin Sargazo · Cancún Live

Maqueta HTML/CSS/JS del sitio de SAiMON VISION (Seguritech). Es estática: no necesita build ni dependencias. Abre `index.html` en el navegador o súbela a cualquier servidor web.

## Estructura

```
playas-sin-sargazo/
├── index.html                 Home: video en loop, buscador, carrusel, costa, cómo funciona, hoteles, FAQ
├── playa.html                 Ficha de cámara (visor con streaming, métricas, lecturas del día y detalles)
├── playa-no-disponible.html   Estado "Esta playa no está disponible ahora"
├── mapa.html                  Mapa en vivo con lista, buscador y popup
├── hoteles.html               Para hoteles: beneficios, pasos, requisitos y formulario
├── aviso.html                 Aviso de privacidad (texto simulado)
├── terminos.html              Términos de uso (texto simulado)
├── sitio-hotel.html           Destino simulado de “Visitar sitio del hotel”
├── css/styles.css             Hoja de estilos única (tokens, componentes, responsivo)
├── design-system/MASTER.md    Tokens y componentes. Fuente del sistema visual.
├── js/main.js                 Interacciones sin dependencias
└── assets/
    ├── img/                   Fotos de playas (tarjetas), cámaras (streaming) y poster del video
    ├── video/hero-olas.mp4    Video del hero (H.264, sin audio, ~7 MB)
    └── svg/                   Textura de olas y mapa ilustrado de la costa
```

## Sistema visual

Los tokens viven en `design-system/MASTER.md` y se aplican desde `css/styles.css` (`--navy`, `--red`, `--green`…). No se inventan colores ni tipografías fuera de ese archivo.

- Tipografía: Manrope (Google Fonts) como sustituto de Avenir Next World. Si la marca tiene licencia web de Avenir, basta con cargarla y dejarla primero en `--font`.
- Fondo con profundidad: `.depth-bg` (textura que se desliza lento) + `.orbs` (brillos turquesa/azul que flotan).
- Superficies de vidrio: `.glass` (claro) y `.glass-dark` (sobre video/foto).
- Se respeta `prefers-reduced-motion`: si el usuario lo tiene activo, todas las animaciones se detienen.
- Responsivo: cortes en 1100, 900 y 640 px. En pantallas de escritorio bajas (altura menor a 820 px) el hero se compacta para que el carrusel entre en la primera vista. En móvil el visor pone el streaming arriba y las lecturas del día pasan a una tarjeta propia.

## Datos de la maqueta

Hoteles, horarios, métricas, teléfono, sitio web y textos legales son simulados para aprobación de diseño. No hay backend. El formulario de afiliación solo muestra el estado de éxito en la página.

## Interacciones (js/main.js)

| Página | Qué hace |
| --- | --- |
| Home | Buscador por hotel o zona (ignora acentos), contador y estado vacío |
| Ficha | Cambio de cámara 01/02/03, selector En vivo / Timelapse, panel Detalles (cierra con Esc), puntos de lecturas generados |
| Mapa | Selección de pin o fila, popup con la playa elegida, buscador |
| Para hoteles | Envío del formulario muestra el estado de éxito (sin backend) |
| FAQ | Acordeón nativo con `<details>` (no requiere JS) |

## Pendientes para producción

- **Datos simulados**: hoteles, horas de lectura, métricas, teléfono y sitio web están escritos en el HTML para la maqueta. En producción deben venir de la API de lecturas (cada 15 min).
- **Streaming**: en `playa.html` la imagen `.stream__img` es un marcador; sustituir por el reproductor de la cámara (HLS/WebRTC). Acercar, alejar y la captura son gestos de la maqueta.
- **Mapa real**: en `mapa.html` el SVG ilustrado se reemplaza por Google Maps o Mapbox/MapLibre con estilo de marca; los pines ya tienen nombre, zona e imagen en atributos `data-*`.
- **Formulario**: conectar `data-affiliate-form` al backend o servicio de formularios (ver comentario en `main.js`).
- **Fotos y video**: son material de referencia; confirmar derechos de uso o sustituir por material del hotel socio.
