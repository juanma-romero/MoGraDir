import React, { useState } from 'react';
import { Project, AspectRatioType, AIConcept } from '../types';
import { Smartphone, Square, Monitor, Sparkles, Loader2, ArrowRight, Zap, Target, Volume2, Palette, Check } from 'lucide-react';
import { getResolutionForAspectRatio } from '../utils/remotionGenerators';

interface BriefViewProps {
  project: Project;
  onUpdateProject: (updated: Partial<Project>) => void;
  onProceedToStoryboard: () => void;
}

export const BriefView: React.FC<BriefViewProps> = ({
  project,
  onUpdateProject,
  onProceedToStoryboard,
}) => {
  const [isBrainstorming, setIsBrainstorming] = useState(false);
  const [aiConcepts, setAiConcepts] = useState<AIConcept[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleBrainstorm = async () => {
    setIsBrainstorming(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/ai/brainstorm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: project.title,
          clientOrBrand: project.clientOrBrand,
          goal: project.goal,
          audience: project.audience,
          aspectRatio: project.aspectRatio,
          targetDuration: project.targetDuration,
        }),
      });

      if (!res.ok) throw new Error('Fallo al consultar el asistente');
      const data = await res.json();
      if (data.concepts && Array.isArray(data.concepts)) {
        setAiConcepts(data.concepts);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('No se pudieron obtener sugerencias de la IA en este momento.');
    } finally {
      setIsBrainstorming(false);
    }
  };

  const applyConcept = (concept: AIConcept) => {
    onUpdateProject({
      hook03s: concept.hook03s,
      colorPalette: concept.colorPalette,
      audioStyle: concept.audioVibe,
      goal: `${project.goal ? project.goal + ' · ' : ''}${concept.coreIdea}`,
    });
  };

  const resolutions = {
    '9:16': getResolutionForAspectRatio('9:16'),
    '1:1': getResolutionForAspectRatio('1:1'),
    '16:9': getResolutionForAspectRatio('16:9'),
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            1. Brief Creativo & Parámetros
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Define la estrategia del anuncio, formato de pantalla para redes y el gancho inicial de retención (0-3s).
          </p>
        </div>

        <button
          onClick={handleBrainstorm}
          disabled={isBrainstorming}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-violet-500/20 transition-all shrink-0 cursor-pointer disabled:opacity-50"
        >
          {isBrainstorming ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            <Sparkles className="w-4 h-4 text-cyan-200" />
          )}
          <span>{isBrainstorming ? 'Generando ideas...' : 'Lluvia de Ideas con IA'}</span>
        </button>
      </div>

      {errorMessage && (
        <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl text-rose-300 text-xs">
          {errorMessage}
        </div>
      )}

      {/* Grid of Main Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Details (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5">
            <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
              <Target className="w-4 h-4 text-violet-400" />
              <span>Identidad del Proyecto</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Título del Video / Campaña
                </label>
                <input
                  type="text"
                  value={project.title}
                  onChange={(e) => onUpdateProject({ title: e.target.value })}
                  placeholder="Ej. Promo App FinTech 15s"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Marca o Cliente
                </label>
                <input
                  type="text"
                  value={project.clientOrBrand}
                  onChange={(e) => onUpdateProject({ clientOrBrand: e.target.value })}
                  placeholder="Ej. Koin Bank"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Objetivo Comercial
              </label>
              <textarea
                rows={2}
                value={project.goal}
                onChange={(e) => onUpdateProject({ goal: e.target.value })}
                placeholder="¿Qué acción debe realizar el usuario? Ej. Descargar la app, registrarse, comprar con descuento..."
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Audiencia Objetivo
              </label>
              <input
                type="text"
                value={project.audience}
                onChange={(e) => onUpdateProject({ audience: e.target.value })}
                placeholder="Ej. Jóvenes profesionales de 22 a 35 años que usan Instagram diariamente"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </div>

          {/* Hook 0-3s Special Card */}
          <div className="bg-gradient-to-br from-violet-950/40 via-slate-900/80 to-slate-900/60 border border-violet-800/40 rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-violet-200 uppercase tracking-wider font-mono flex items-center gap-2">
                <Zap className="w-4 h-4 text-violet-400" />
                <span>Gancho Inicial (Hook 0 a 3 Segundos)</span>
              </h2>
              <span className="text-[11px] text-violet-300/80 bg-violet-900/50 px-2 py-0.5 rounded font-mono">
                Vital para evitar el scroll
              </span>
            </div>

            <p className="text-xs text-slate-400">
              En Reels y TikToks, los primeros 3 segundos deciden el 80% de la retención. Escribe aquí el estímulo visual y auditivo de impacto.
            </p>

            <textarea
              rows={3}
              value={project.hook03s}
              onChange={(e) => onUpdateProject({ hook03s: e.target.value })}
              placeholder="Ej. Texto en tamaño gigante con spring elástico: '¿Dónde está tu sueldo?' con sonido de alarma y monedas cayendo a gran velocidad."
              className="w-full bg-slate-950/90 border border-violet-700/50 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-400 transition-colors resize-none"
            />
          </div>

          {/* Color & Audio Direction */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-slate-300 mb-1.5">
                <Palette className="w-3.5 h-3.5 text-cyan-400" />
                <span>Paleta de Color Sugerida</span>
              </label>
              <input
                type="text"
                value={project.colorPalette}
                onChange={(e) => onUpdateProject({ colorPalette: e.target.value })}
                placeholder="Ej. Dark Slate #0F172A, Neon Cyan #06B6D4, White"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-slate-300 mb-1.5">
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Estilo Musical & SFX</span>
              </label>
              <input
                type="text"
                value={project.audioStyle}
                onChange={(e) => onUpdateProject({ audioStyle: e.target.value })}
                placeholder="Ej. Future Bass 128 BPM, cortes de bajo secos, whooshes"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Aspect Ratio & Duration Settings */}
        <div className="space-y-6">
          {/* Aspect Ratio Selector */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider font-mono">
              Formato & Aspect Ratio
            </h2>

            <div className="grid grid-cols-3 gap-2.5">
              {(['9:16', '1:1', '16:9'] as AspectRatioType[]).map((ratio) => {
                const isSelected = project.aspectRatio === ratio;
                const info = resolutions[ratio];

                return (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => onUpdateProject({ aspectRatio: ratio })}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-violet-600/20 border-violet-500 text-white shadow-md shadow-violet-500/10'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {/* Visual Aspect Ratio Representation */}
                    <div className="h-10 w-full flex items-center justify-center mb-2">
                      {ratio === '9:16' && (
                        <div
                          className={`w-4 h-8 rounded-sm border ${
                            isSelected ? 'border-violet-400 bg-violet-500/20' : 'border-slate-600'
                          }`}
                        />
                      )}
                      {ratio === '1:1' && (
                        <div
                          className={`w-7 h-7 rounded-sm border ${
                            isSelected ? 'border-violet-400 bg-violet-500/20' : 'border-slate-600'
                          }`}
                        />
                      )}
                      {ratio === '16:9' && (
                        <div
                          className={`w-9 h-5 rounded-sm border ${
                            isSelected ? 'border-violet-400 bg-violet-500/20' : 'border-slate-600'
                          }`}
                        />
                      )}
                    </div>
                    <span className="text-xs font-bold font-mono">{ratio}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 font-mono">
                      {info.width}x{info.height}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="text-[11px] text-slate-400 leading-normal">
              {resolutions[project.aspectRatio].label}. Configurado automáticamente para el canvas de Remotion.
            </p>
          </div>

          {/* Target Duration & FPS */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider font-mono">
              Duración Meta & FPS
            </h2>

            <div>
              <label className="block text-xs text-slate-300 mb-2">
                Duración Objetivo del Video
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[10, 15, 30, 60].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => onUpdateProject({ targetDuration: sec })}
                    className={`py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      project.targetDuration === sec
                        ? 'bg-violet-600 text-white shadow-sm'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-2">
                Tasa de Cuadros (Remotion FPS)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {([30, 60] as const).map((fpsVal) => (
                  <button
                    key={fpsVal}
                    type="button"
                    onClick={() => onUpdateProject({ fps: fpsVal })}
                    className={`py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      project.fps === fpsVal
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {fpsVal} FPS {fpsVal === 30 ? '(Estándar)' : '(Fluido)'}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onProceedToStoryboard}
                className="w-full flex items-center justify-center gap-2 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-violet-600/20 transition-all cursor-pointer"
              >
                <span>Continuar a Guion & Storyboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Brainstorming Results Panel */}
      {aiConcepts.length > 0 && (
        <div className="bg-slate-900/80 border border-violet-800/40 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-400" />
              <span>Conceptos Creativos Sugeridos por IA (Gemini 3.8 Flash)</span>
            </h2>
            <span className="text-xs text-slate-400">
              Haz clic en "Aplicar a mi proyecto" para adoptar un ángulo
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {aiConcepts.map((c, i) => (
              <div
                key={i}
                className="bg-slate-950 border border-slate-800 hover:border-violet-600/50 rounded-xl p-4 flex flex-col justify-between space-y-3 transition-colors"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-violet-400 font-bold uppercase">
                    Concepto {i + 1}
                  </span>
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {c.coreIdea}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-[11px]">
                    <p className="text-violet-300">
                      <strong className="text-slate-300">Hook 0-3s:</strong> {c.hook03s}
                    </p>
                    <p className="text-cyan-300">
                      <strong className="text-slate-300">Metáfora:</strong> {c.visualMetaphor}
                    </p>
                    <p className="text-slate-400 font-mono text-[10px]">
                      Tip Remotion: {c.remotionTip}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => applyConcept(c)}
                  className="w-full py-2 bg-slate-800 hover:bg-violet-600 text-slate-200 hover:text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Aplicar a mi proyecto</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
