import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI client (only with API key if present)
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Endpoint 1: Brainstorm concepts & hooks
app.post('/api/ai/brainstorm', async (req, res) => {
  try {
    const { title, clientOrBrand, goal, audience, aspectRatio, targetDuration } = req.body;

    if (!ai) {
      return res.json({
        concepts: [
          {
            title: 'Impacto Cinético & Zoom Recursivo',
            coreIdea: 'Un ritmo vertiginoso donde cada palabra del gancho se convierte en un objeto tridimensional que detona la propuesta de valor.',
            hook03s: 'Texto gigante que se contrae con spring elástico mientras una alerta sonora capta la atención del scroll.',
            visualMetaphor: 'Metáfora de interruptor o velocímetro que pasa de 0 a 100 con estela de partículas.',
            colorPalette: 'Deep Slate #0F172A, Electric Cyan #06B6D4, Accent Lime #84CC16',
            audioVibe: 'Bass drop inicial con riser sintetizado y percusión glitch rápida a 128 BPM',
            remotionTip: 'Utiliza useCurrentFrame con interpolaciones no lineales (spring) y transiciones con wipe vertical.',
          },
          {
            title: 'Split-Screen & Desglose Dinámico',
            coreIdea: 'División de pantalla en 2 o 3 franjas que se deslizan a destiempo mostrando el antes vs después en formato 9:16.',
            hook03s: 'Franja superior cae a 60fps con la pregunta dolor del cliente mientras la inferior muestra la solución.',
            visualMetaphor: 'Un cursor o target que hace clic y expande una tarjeta flotante de interfaz de usuario.',
            colorPalette: 'Dark Indigo #1E1B4B, Neon Violet #A855F7, Clean White #FFFFFF',
            audioVibe: 'Whoosh de aire seguido de un clic táctil y bajo rítmico moderno tipo Lo-fi tech',
            remotionTip: 'Crea un componente reutilizable <CardStrip> animado con spring({ damping: 14, mass: 0.8 }).',
          },
          {
            title: 'Minimalista Tipográfico High-End',
            coreIdea: 'Tipografía cinética de gran escala con recortes de máscara, gradientes suaves y movimientos de cámara sutiles.',
            hook03s: 'Una sola palabra clave aparece con máscara de opacidad en 0.8 segundos con sonido de tape rewind.',
            visualMetaphor: 'Cajas de texto que se apilan con física de rebote y revelan el producto central.',
            colorPalette: 'Monochrome Dark #09090B, Vibrant Orange #F97316, Soft Slate #94A3B8',
            audioVibe: 'Beat de trap minimalista con claps secos y acentos de campana en cada corte de escena',
            remotionTip: 'Mapea cada palabra como un span individual animando su translateY con interpolate().',
          },
        ],
      });
    }

    const prompt = `Actúa como un Director Creativo experto en Motion Graphics y animación para publicidad y formatos cortos (Reels, TikTok, Stories, Ads en 9:16 y 1:1) que utiliza Remotion (React).
Genera 3 conceptos de video altamente creativos y con ganchos de alta retención para el siguiente proyecto:
- Título o Proyecto: ${title || 'Campaña de Motion Graphics'}
- Marca/Cliente: ${clientOrBrand || 'Marca Digital'}
- Objetivo: ${goal || 'Generar conversiones y captar leads'}
- Audiencia: ${audience || 'Usuarios de redes sociales'}
- Formato/Aspect Ratio: ${aspectRatio || '9:16'}
- Duración meta: ${targetDuration || 15} segundos

Responde estrictamente en formato JSON con la siguiente estructura:
{
  "concepts": [
    {
      "title": "Nombre del concepto",
      "coreIdea": "Idea central y narrativa visual",
      "hook03s": "Gancho de los primeros 0 a 3 segundos (crucial para evitar que el usuario deslice)",
      "visualMetaphor": "Metáfora gráfica o estilo de transición principal",
      "colorPalette": "Colores sugeridos",
      "audioVibe": "Estilo de audio, ritmo musical y SFX",
      "remotionTip": "Recomendación técnica para programar en Remotion"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error) {
    console.error('Error in /api/ai/brainstorm:', error);
    return res.status(500).json({ error: 'Error al generar conceptos con IA' });
  }
});

// Endpoint 2: Scene suggestion & motion breakdown
app.post('/api/ai/scene-suggest', async (req, res) => {
  try {
    const { sceneIndex, audioText, durationSeconds, fps, aspectRatio, previousSceneSummary } = req.body;

    if (!ai) {
      return res.json({
        visualAction: `La cámara hace un zoom dinámico hacia el elemento central. Aparece tipografía cinética sincronizada con cada palabra de la locución ("${audioText ? audioText.slice(0, 30) : 'Impacto'}...").`,
        motionNotes: `Spring elástico (mass: 0.6, damping: 11). El fondo rota 4 grados y se estabiliza. Salida con whip-pan horizontal hacia la derecha.`,
        sfx: `Whoosh ascendente al inicio + sub drop de impacto a los 0.8s + click suave en los textos.`,
        remotionTip: `Usa interpolate(frame, [0, 15], [0.8, 1], { extrapolateRight: 'clamp' }) combinado con spring().`,
      });
    }

    const prompt = `Actúa como animador senior de Motion Graphics que programa animaciones con Remotion en React.
El usuario está creando la Escena #${sceneIndex + 1} de un video para redes sociales.
Detalles de la escena:
- Duración: ${durationSeconds} segundos (${Math.round(durationSeconds * (fps || 30))} frames a ${fps || 30} fps)
- Formato: ${aspectRatio || '9:16 vertical'}
- Locución / Voz en off actual: "${audioText || 'Sin texto aún'}"
- Contexto previo: "${previousSceneSummary || 'Inicio o escena previa'}"

Proporciona sugerencias profesionales y ejecutables para esta escena.
Responde estrictamente en formato JSON con las claves:
{
  "visualAction": "Descripción gráfica detallada de lo que se ve en pantalla (capas, formas, tipografía, composición)",
  "motionNotes": "Dirección de movimiento, curvas de easing, comportamiento de cámara y transición de salida",
  "sfx": "Efectos sonoros específicos (whoosh, pop, riser, glitch, etc.) sincronizados",
  "remotionTip": "Consejo técnico para codificar este movimiento en Remotion (ej. uso de spring, interpolate, Sequence, componentes SVG)"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error) {
    console.error('Error in /api/ai/scene-suggest:', error);
    return res.status(500).json({ error: 'Error al sugerir detalles de la escena' });
  }
});

// Endpoint 3: Pacing & word count estimator
app.post('/api/ai/pacing-check', (req, res) => {
  const { audioText, durationSeconds } = req.body;
  const words = (audioText || '').trim().split(/\s+/).filter(Boolean).length;
  const duration = Number(durationSeconds) || 1;
  const wordsPerSecond = words / duration;
  const wordsPerMinute = wordsPerSecond * 60;

  // Typical professional Spanish voiceover: 130 to 155 words per minute (2.2 - 2.6 words/sec)
  let status: 'too_fast' | 'optimal' | 'too_slow' = 'optimal';
  let message = 'Ritmo ideal de locución para redes sociales.';

  if (wordsPerMinute > 175) {
    status = 'too_fast';
    message = `Muy rápido (${Math.round(wordsPerMinute)} palabras/min). Te sugerimos recortar unas ${Math.ceil(words - duration * 2.5)} palabras o aumentar ${((words / 2.5) - duration).toFixed(1)}s.`;
  } else if (wordsPerMinute < 100 && words > 0) {
    status = 'too_slow';
    message = `Ritmo pausado (${Math.round(wordsPerMinute)} palabras/min). Hay espacio para pausas dramáticas o para añadir más detalle.`;
  }

  res.json({
    wordCount: words,
    wordsPerSecond: Number(wordsPerSecond.toFixed(1)),
    wordsPerMinute: Math.round(wordsPerMinute),
    status,
    message,
  });
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
