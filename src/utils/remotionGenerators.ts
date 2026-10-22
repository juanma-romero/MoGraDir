import { Project } from '../types';
import { calculateProjectTiming } from './storage';

export function getResolutionForAspectRatio(ratio: '9:16' | '1:1' | '16:9') {
  switch (ratio) {
    case '9:16':
      return { width: 1080, height: 1920, label: 'Vertical (Reels/TikTok/Shorts)' };
    case '1:1':
      return { width: 1080, height: 1080, label: 'Cuadrado (Feed/LinkedIn)' };
    case '16:9':
      return { width: 1920, height: 1080, label: 'Horizontal (YouTube/Web)' };
  }
}

export function generateRemotionCode(project: Project): string {
  const { width, height } = getResolutionForAspectRatio(project.aspectRatio);
  const timing = calculateProjectTiming(project);

  let currentFrame = 0;
  const sceneSequencesCode = project.scenes
    .map((scene, i) => {
      const sceneFrames = Math.round((Number(scene.durationSeconds) || 1) * project.fps);
      const fromFrame = currentFrame;
      currentFrame += sceneFrames;

      return `      {/* Escena ${i + 1}: ${scene.title} (${scene.durationSeconds}s / ${sceneFrames} frames) */}
      <Sequence from={${fromFrame}} durationInFrames={${sceneFrames}}>
        <Scene${i + 1}Component />
      </Sequence>`;
    })
    .join('\n\n');

  const sceneComponentsCode = project.scenes
    .map((scene, i) => {
      const sceneFrames = Math.round((Number(scene.durationSeconds) || 1) * project.fps);
      return `// ==========================================
// Componente: Escena ${i + 1} - ${scene.title}
// Duración: ${scene.durationSeconds}s (${sceneFrames} frames a ${project.fps} fps)
// Locución: "${scene.audioVoiceover || ''}"
// Visual: "${scene.visualAction || ''}"
// ==========================================
export const Scene${i + 1}Component: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animación de entrada con spring elástico
  const entranceSpring = spring({
    frame,
    fps,
    config: {
      damping: 12,
      mass: 0.7,
      stiffness: 100,
    },
  });

  // Interpolación de escala y opacidad
  const scale = interpolate(entranceSpring, [0, 1], [0.85, 1]);
  const opacity = interpolate(entranceSpring, [0, 1], [0, 1]);

  return (
    <AbsoluteFill className="flex flex-col items-center justify-center p-12 bg-slate-950 text-white select-none">
      {/* Capa de fondo o gradiente sutil */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 40%, rgba(99, 102, 241, 0.15), transparent 70%)',
        }}
      />

      {/* Contenedor animado de la escena */}
      <div
        style={{
          transform: \`scale(\${scale})\`,
          opacity,
        }}
        className="relative z-10 flex flex-col items-center text-center max-w-xl"
      >
        <span className="text-xs uppercase tracking-widest text-violet-400 font-mono mb-4">
          Escena ${i + 1} · ${scene.title}
        </span>

        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-balance">
          "${scene.audioVoiceover || 'Texto en pantalla...'}"
        </h2>

        <p className="text-slate-400 text-sm leading-relaxed max-w-md">
          {/* Acción visual sugerida: ${scene.visualAction.slice(0, 100)} */}
          ${scene.visualAction || 'Animación principal de elementos vectoriales.'}
        </p>
      </div>
    </AbsoluteFill>
  );
};`;
    })
    .join('\n\n');

  return `/**
 * Composición de Remotion generada por Kinetix Studio
 * Proyecto: ${project.title}
 * Cliente: ${project.clientOrBrand || 'N/A'}
 * Aspect Ratio: ${project.aspectRatio} (${width}x${height}) @ ${project.fps} FPS
 * Duración Total: ${timing.totalSeconds}s (${timing.totalFrames} frames)
 */

import React from 'react';
import {
  Composition,
  Folder,
  Sequence,
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';

// Root principal que registra las composiciones en Remotion
export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="${project.clientOrBrand ? project.clientOrBrand.replace(/\\s+/g, '') : 'Kinetix'}">
      <Composition
        id="${project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'motion-video'}"
        component={MainVideoComposition}
        durationInFrames={${timing.totalFrames}}
        fps={${project.fps}}
        width={${width}}
        height={${height}}
        defaultProps={{}}
      />
    </Folder>
  );
};

// Composición Principal del Video
export const MainVideoComposition: React.FC = () => {
  return (
    <AbsoluteFill className="bg-slate-950 font-sans">
      {/* Sincronización secuencial de escenas */}
${sceneSequencesCode}
    </AbsoluteFill>
  );
};

${sceneComponentsCode}
`;
}

export function generateRemotionAIAgentPrompt(project: Project): string {
  const { width, height, label } = getResolutionForAspectRatio(project.aspectRatio);
  const timing = calculateProjectTiming(project);

  let currentFrame = 0;
  const scenesSummary = project.scenes
    .map((s, i) => {
      const frames = Math.round((Number(s.durationSeconds) || 1) * project.fps);
      const startF = currentFrame;
      const endF = currentFrame + frames;
      currentFrame = endF;

      return `### Escena ${i + 1}: ${s.title}
- **Rango de Frames**: Frame ${startF} al ${endF} (${frames} frames / ${s.durationSeconds} seg a ${project.fps} FPS)
- **Locución / Texto en pantalla**: "${s.audioVoiceover || 'N/A'}"
- **Acción Visual & Movimiento**: ${s.visualAction || 'Sin descripción'}
- **Curvas de Animación / Easing**: ${s.motionNotes || 'spring({ damping: 12, mass: 0.7 })'}
- **Transición de Salida**: ${s.transitionOut}
- **SFX & Audio**: ${s.sfxMusic || 'Whoosh suave'}
- **Consejo Técnico**: ${s.remotionTip || 'Usa spring() para entradas elásticas.'}`;
    })
    .join('\n\n');

  return `# PROMPT PARA AGENTE DE IA (REMOTION CODE BUILDER)

Actúa como un Desarrollador Frontend Senior experto en Remotion, React 19, TypeScript y Tailwind CSS para animación de Motion Graphics.
Tu objetivo es implementar el código completo de la composición de video para este proyecto de publicidad en redes sociales.

## 1. Especificaciones de la Composición Remotion
- **Proyecto**: ${project.title}
- **Cliente / Marca**: ${project.clientOrBrand || 'Marca Digital'}
- **Objetivo**: ${project.goal || 'Maximizar retención y clics'}
- **Formato**: ${project.aspectRatio} ${label} (${width}x${height} píxeles)
- **FPS**: ${project.fps} frames por segundo
- **Duración Total**: ${timing.totalSeconds} segundos (${timing.totalFrames} frames en total)
- **Gancho Inicial (0-3s)**: "${project.hook03s || 'Gancho de impacto visual inmediato'}"
- **Paleta de Color**: ${project.colorPalette || 'Fondo oscuro #0F172A con acentos vibrantes'}
- **Estilo de Audio**: ${project.audioStyle || 'Beat dinámico moderno'}

---

## 2. Desglose Detallado de Secuencias (Frames Exactos)

${scenesSummary}

---

## 3. Instrucciones de Implementación Obligatorias
1. **Uso de Primitivas Remotion**:
   - Usa siempre \`useCurrentFrame()\` y \`useVideoConfig()\` dentro de cada componente de escena.
   - Para movimientos elásticos y orgánicos, usa \`spring({ frame, fps, config: { damping, mass, stiffness } })\` en lugar de transiciones CSS lineales.
   - Para progresiones de valor (rotaciones, opacidades, traslaciones), usa \`interpolate(frame, inputRange, outputRange, { extrapolateRight: 'clamp' })\`.
2. **Estructura de Componentes**:
   - Envuelve cada escena dentro de su propio \`<Sequence from={startFrame} durationInFrames={sceneFrames}>\`.
   - Utiliza \`<AbsoluteFill>\` como contenedor raíz en cada escena para asegurar alineación precisa dentro del canvas de ${width}x${height}.
3. **Calidad Visual & Tipografía**:
   - La tipografía debe estar bien jerarquizada con textos sin huérfanos (\`text-balance\`).
   - Usa acentos gráficos, trazos SVG animados y gradientes sutiles.
4. **Responde**:
   - Genera los archivos TypeScript (\`Root.tsx\`, \`MainComposition.tsx\` y componentes por cada escena \`Scene1.tsx\`, etc.) listos para compilar sin errores de tipos.
`;
}

export function generateMarkdownSpecSheet(project: Project): string {
  const { width, height, label } = getResolutionForAspectRatio(project.aspectRatio);
  const timing = calculateProjectTiming(project);

  let currentSeconds = 0;
  const sceneRows = project.scenes
    .map((s, i) => {
      const dur = Number(s.durationSeconds) || 1;
      const startS = currentSeconds;
      const endS = currentSeconds + dur;
      currentSeconds = endS;
      const frames = Math.round(dur * project.fps);

      return `| ${i + 1} | ${s.title} | ${startS.toFixed(1)}s - ${endS.toFixed(1)}s (${frames}f) | ${s.audioVoiceover.replace(/\n/g, ' ')} | ${s.visualAction.replace(/\n/g, ' ')} | ${s.sfxMusic} | ${s.transitionOut} |`;
    })
    .join('\n');

  return `# FICHA TÉCNICA DE PRODUCCIÓN: ${project.title.toUpperCase()}
**Cliente / Marca:** ${project.clientOrBrand || 'N/A'}
**Fecha de Actualización:** ${new Date(project.updatedAt).toLocaleDateString('es-ES')}
**Objetivo:** ${project.goal || 'Campaña de Motion Graphics'}
**Formato:** ${project.aspectRatio} (${width}x${height} px) - ${label}
**FPS:** ${project.fps} fps
**Duración Total:** ${timing.totalSeconds} segundos (${timing.totalFrames} frames) - Meta: ${timing.targetSeconds}s

---

## GANCHO DE RETENCIÓN (0-3 SEGUNDOS)
${project.hook03s || 'Gancho visual para evitar que el usuario deslice en el feed.'}

---

## GUION & BEAT SHEET SINCRONIZADO

| # | Escena | Timecode & Frames | Locución / Copy | Acción Visual & Motion | SFX / Música | Transición |
|---|--------|-------------------|-----------------|------------------------|--------------|------------|
${sceneRows}

---

## ESTILO VISUAL & AUDIO
- **Paleta de Color:** ${project.colorPalette || 'Modo oscuro con acentos cinéticos'}
- **Estilo de Audio:** ${project.audioStyle || 'Uptempo sincronizado'}
`;
}
