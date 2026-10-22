# Kinetix Studio - Flujo de Trabajo y Producción de Motion Graphics

Kinetix Studio es una aplicación integral diseñada específicamente para creadores y diseñadores de motion graphics enfocados en publicidad y formatos cortos (Reels, TikToks, Stories y anuncios digitales). Estructura el proceso creativo de punta a punta: desde la concepción del brief y la redacción del guion audiovisual sincronizado por tiempos, hasta el storyboard de secuencias, el cronograma de producción por fases con checklist de hitos de entrega y la exportación de especificaciones técnicas para After Effects.

## Decisiones Críticas y Preferencias Confirmadas

> [!IMPORTANT]
> A continuación se detallan las decisiones acordadas a partir de tus respuestas:

- **Tipo de Contenido**: Optimizado para publicidad y formatos cortos de redes sociales (ratios 9:16 vertical, 1:1 cuadrado y 16:9 widescreen; duraciones típicas de 15s, 30s y 60s con foco en retención y ganchos en los primeros 3 segundos).
- **Estructura del Guion y Storyboard**: Vista combinada escena por escena con sincronización de tiempos en tiempo real (timecodes acumulados, voz en off/copy en pantalla, acción visual/motion notes, paleta y efectos de sonido/SFX).
- **Gestión de Producción**: Fases secuenciales con checklist de hitos de entrega (Pre-producción, Diseño & Styleframes, Animación & Curvas, Audio & SFX, Render & Entrega final) con medidor de avance y alertas de estado.
- **Asistencia con Inteligencia Artificial**: Integración de Gemini 3.8 Flash en el backend para generar conceptos creativos, proponer transiciones de motion graphics, calcular ritmo de locución y sugerir metáforas visuales por escena.
- **Plantillas Preconfiguradas**: Inclusión de plantillas listas para usar (Anuncio de Producto 15s, Reel Educativo Dinámico 30s, Promo de Evento/Oferta 15s) para arrancar proyectos con un solo clic.

---

## 1. Visión General y Flujo de Trabajo

### El Problema
En motion graphics, pasar de una idea abstracta al software de animación (After Effects, Blender o Cinema 4D) suele generar bloqueos creativos, pérdida de coherencia visual, desajustes de tiempo con la locución y retrabajos costosos.

### La Solución Kinetix
Kinetix divide la producción en 4 etapas lógicas y guiadas:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             FLUJO DE PRODUCCIÓN                             │
├───────────────┬──────────────────────┬───────────────────────┬──────────────┤
│ 1. CONCEPTO   │ 2. GUION & TIEMPOS   │ 3. CRONOGRAMA & HITOS │ 4. ENTREGA   │
│ • Brief & Hook│ • Beat Sheet         │ • Fases de producción │ • Spec Sheet │
│ • Target & Dim│ • Audio vs Video     │ • Checklist de tareas │ • Export PDF │
│ • Asistente IA│ • Timecode dinámico  │ • Control de progreso │ • Backup JSON│
└───────────────┴──────────────────────┴───────────────────────┴──────────────┘
```

1. **Brief & Concepto Creativo**:
   - Nombre de proyecto, cliente/marca, objetivo comercial y formato (9:16 Reels/TikTok, 1:1 Feed, 16:9 YouTube).
   - Definición del gancho visual inicial (*Hook* 0-3 segundos) crucial para retención en redes.
   - Generador IA de lluvia de ideas: amplía el concepto y propone tres ángulos creativos y metáforas visuales.

2. **Guion Audiovisual & Storyboard Sincronizado**:
   - Editor de escenas en línea de tiempo vertical con cálculo automático de timecode acumulado (ej. Escena 1: 0:00 - 0:03, Escena 2: 0:03 - 0:08).
   - Campos estructurados por escena:
     - **Audio / Copy**: Locución o texto cinético en pantalla.
     - **Acción Visual & Motion**: Dirección de movimiento, easing, cámaras, transiciones (morphing, whip pan, match cut).
     - **Assets & Color**: Elementos necesarios (iconos vectoriales, renders 3D, tipografía, paleta cromática).
     - **SFX & Música**: Efectos sonoros (whoosh, pop, riser, bass drop) y acentos rítmicos.
     - **Duración (segundos)**: Barra de duración total interactiva que alerta si se supera la meta (ej. 15s o 30s).
   - Herramientas por escena: duplicar, reordenar con controles de posición, sugerir visual con IA, estimador de ritmo de locución.

3. **Cronograma de Producción & Checklist de Hitos**:
   - 5 Fases profesionales secuenciales con hitos específicos:
     - **Fase 1: Pre-Producción**: Brief validado, guion cerrado, voz en off grabada/sintetizada, selección de música.
     - **Fase 2: Diseño & Styleframes**: Paleta definida, moodboard de referencias, styleframes clave creados, assets vectoriales listos en capas para animación.
     - **Fase 3: Animación & Rigging**: Animatic inicial con audio, animación de elementos principales, pulido de curvas de velocidad (graph editor) y transiciones.
     - **Fase 4: Audio & Post-procesado**: Sincronización de SFX con impactos visuales, mezcla sonora, efectos de glow/texturas/motion blur.
     - **Fase 5: Render & Entrega**: Export ProRes master, compresión H.264 optimizada para móviles, adaptaciones de aspect ratio, empaquetado de proyecto fuente.
   - Cada hito cuenta con estado interactivo (Pendiente, En Proceso, Completado), fecha estimada, notas y cálculo de avance general del proyecto.

4. **Exportación & Especificación Técnica ("Motion Spec Sheet")**:
   - Generación de resumen de producción listo para compartir con clientes o abrir en el segundo monitor mientras animas en After Effects.
   - Exportación de guion a formato texto/Markdown estructurado.
   - Exportación/Importación de proyectos en formato JSON para respaldar o continuar más tarde en cualquier navegador.

---

## 2. Experiencia de Usuario y Diseño Visual

Siguiendo las directrices de `frontend-design` y la estética de un estudio creativo de motion design:

- **Atmósfera y Paleta de Color (60-30-10)**:
  - *Lienzo neutral (60%)*: Dark slate profundo y profesional (`bg-slate-950` / `bg-neutral-900`) que evoca la interfaz de software de postproducción (After Effects, Premiere, DaVinci).
  - *Superficies estructurales (30%)*: Contenedores planos con bordes sutiles de 1px (`border-slate-800` / `bg-slate-900/60`), sin degradados artificiales ni sombras pesadas.
  - *Acentos intencionados (10%)*: Violeta eléctrico y cian cinético (`violet-500` / `cyan-400` y `amber-400` para alertas de tiempo), aplicados estrictamente a puntos de interacción (playhead, botón de acción primaria, fase activa).
- **Tipografía y Jerarquía**:
  - Encabezados: `Plus Jakarta Sans` en peso semibold/bold para títulos limpios y modernos.
  - Cuerpo: `Public Sans` / `Inter-free DM Sans` para máxima legibilidad en descripciones de animación.
  - Tiempos y Métricas: Cifras tabulares estrictas (`font-mono tabular-nums`) para timecodes (`00:03.5`, `00:15.0`) y duraciones.
- **Disciplina Anti-Slop**:
  - Sin píldoras flotantes estáticas ni badges coloridos redundantes; los metadatos se presentan en texto plano con separadores elegantes (`·`).
  - Navegación clara de 3 zonas en la barra superior: Marca (Kinetix Studio) — 4 enlaces de vista (Concepto, Guion & Beat, Cronograma, Exportar) — Acción principal ("+ Nueva Escena" o "Asistente IA").
  - Barra de duración global fija o contextual que indica la duración total vs la meta seleccionada (15s/30s/60s) con barra de progreso fluida.

---

## 3. Decisiones Técnicas y de Arquitectura

### A. Persistencia y Estado Local
- Almacenamiento en `localStorage` con autoguardado instantáneo y soporte de exportación/importación JSON.
- Proyectos múltiples con posibilidad de cambiar de proyecto, duplicar o resetear a plantillas de inicio.

### B. Integración con Servidor y Gemini API
- Arquitectura full-stack con proxy server en `server.ts` utilizando Express y `@google/genai` con el modelo `gemini-3.8-flash`.
- Endpoints dedicados:
  - `POST /api/ai/brainstorm`: Recibe el brief (producto, objetivo, audiencia, formato) y retorna 3 conceptos creativos con ganchos iniciales.
  - `POST /api/ai/scene-suggest`: Recibe una escena y sugiere ideas de movimiento visual, transiciones y efectos sonoros que refuercen el mensaje.
  - `POST /api/ai/script-pacing`: Estima la cantidad de palabras y velocidad de lectura para ajustar el texto al tiempo exacto en segundos.

### C. Diagrama de Arquitectura de Componentes

```
┌────────────────────────────────────────────────────────────────────────┐
│                          KINETIX STUDIO UI                             │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ TopBar: Wordmark | Pestañas de Vista | Selector Proyecto & Acc   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Global Project Banner: Proyecto actual, Aspecto (9:16) & Tiempo   │  │
│  │ [========= Total: 00:14.5s / Meta: 00:15.0s =========]           │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                    │                                   │
│            ┌───────────────────────┼───────────────────────┐           │
│            ▼                       ▼                       ▼           │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐  │
│  │  1. VISTA BRIEF  │    │  2. VISTA GUION  │    │ 3. VISTA TIEMPOS │  │
│  │ • Datos clave    │    │ • Timecode rail  │    │ • 5 Fases pro    │  │
│  │ • Hook 0-3s      │    │ • Escena Cards   │    │ • Checklists     │  │
│  │ • Brainstorm IA  │    │ • Audio / Video  │    │ • % Progreso     │  │
│  │ • Plantillas     │    │ • SFX & Motion   │    │ • Fechas límite  │  │
│  └──────────────────┘    └──────────────────┘    └──────────────────┘  │
│                                    │                                   │
│                                    ▼                                   │
│                          ┌──────────────────┐                          │
│                          │ 4. VISTA ENTREGA │                          │
│                          │ • Spec Sheet     │                          │
│                          │ • Copiar Markdown│                          │
│                          │ • Backup JSON    │                          │
│                          └──────────────────┘                          │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ fetch /api/ai/*
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        EXPRESS SERVER (server.ts)                      │
│   • GoogleGenAI SDK ('gemini-3.8-flash', User-Agent: aistudio-build)   │
│   • Rutas: /api/ai/brainstorm, /api/ai/scene-suggest                   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Fases de Desarrollo Planificadas

1. **Configuración del Servidor Full-Stack**:
   - Crear `server.ts` con Express y `@google/genai` conectando a `process.env.GEMINI_API_KEY`.
   - Modificar `package.json` para ejecutar desarrollo y producción full-stack con `tsx`.
   - Registrar la capacidad en `metadata.json` (`MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`).

2. **Modelos de Datos y Estado Global**:
   - Tipos TypeScript para `Project`, `Scene`, `ProductionMilestone`, `Phase` y `Brief`.
   - Motor de persistencia en `localStorage` con proyectos demo precargados (ej. Anuncio de Lanzamiento de App Móvil 15s en 9:16).

3. **Interfaz de Usuario y Módulos**:
   - **Header & Navigation**: Barra superior con navegación entre las 4 fases y control de duración.
   - **Módulo 1 (Brief & Concepto)**: Formulario de parámetros de campaña, selector de aspect ratio visual (9:16, 1:1, 16:9), definición de gancho y modal de ideas con IA.
   - **Módulo 2 (Editor de Guion & Beat Sheet Sincronizado)**: Lista interactiva de escenas con timecodes dinámicos, cálculo automático de tiempos, inputs de audio/video/motion/sfx y sugerencias de IA.
   - **Módulo 3 (Cronograma & Checklist de Producción)**: 5 fases ordenadas con tareas marcables, barra de progreso general y cálculo de estado.
   - **Módulo 4 (Exportación y Ficha Técnica)**: Vista de impresión limpia, copia rápida de especificaciones para After Effects y exportación/importación de archivos JSON.

4. **Verificación y Pulido**:
   - Compilación con `compile_applet`.
   - Comprobación de diseño accesible, tipografía tabular en tiempos y respuesta en pantallas de escritorio y tablets.
