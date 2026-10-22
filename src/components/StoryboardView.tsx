import React, { useState } from 'react';
import { Project, Scene } from '../types';
import {
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Clock,
  Volume2,
  Film,
  Zap,
  Code2,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Layers,
} from 'lucide-react';
import { formatTimecode, formatFrame } from '../utils/storage';

interface StoryboardViewProps {
  project: Project;
  onUpdateProject: (updated: Partial<Project>) => void;
  onOpenRhythmSimulator: () => void;
}

export const StoryboardView: React.FC<StoryboardViewProps> = ({
  project,
  onUpdateProject,
  onOpenRhythmSimulator,
}) => {
  const [loadingSceneAiId, setLoadingSceneAiId] = useState<string | null>(null);

  // Recalculate time offsets for all scenes
  let accumulatedSeconds = 0;
  const scenesWithOffsets = project.scenes.map((scene) => {
    const startSec = accumulatedSeconds;
    const dur = Number(scene.durationSeconds) || 1;
    const endSec = startSec + dur;
    accumulatedSeconds = endSec;

    const startFrame = Math.round(startSec * project.fps);
    const endFrame = Math.round(endSec * project.fps);
    const framesCount = endFrame - startFrame;

    // Word count calculation
    const words = (scene.audioVoiceover || '').trim().split(/\s+/).filter(Boolean).length;
    const wordsPerMinute = dur > 0 ? (words / dur) * 60 : 0;
    const isTooFast = wordsPerMinute > 170;
    const isTooSlow = wordsPerMinute < 95 && words > 0;

    return {
      ...scene,
      startSec,
      endSec,
      startFrame,
      endFrame,
      framesCount,
      words,
      wordsPerMinute: Math.round(wordsPerMinute),
      isTooFast,
      isTooSlow,
    };
  });

  const handleUpdateScene = (sceneId: string, updates: Partial<Scene>) => {
    const updatedScenes = project.scenes.map((s) => (s.id === sceneId ? { ...s, ...updates } : s));
    onUpdateProject({ scenes: updatedScenes });
  };

  const handleAddScene = () => {
    const newScene: Scene = {
      id: `sc-${Date.now()}`,
      order: project.scenes.length + 1,
      title: `Escena ${project.scenes.length + 1}`,
      durationSeconds: 3.0,
      audioVoiceover: '',
      visualAction: 'Animación de entrada con spring elástico y texto cinético.',
      motionNotes: 'spring({ damping: 12, mass: 0.7 }) con interpolación de escala.',
      sfxMusic: 'Whoosh rápido de transición + pop suave.',
      transitionOut: 'whip-pan',
      colorTag: '#6366F1',
      remotionTip: 'Usa <Sequence> con interpolate() en translateY.',
    };
    onUpdateProject({ scenes: [...project.scenes, newScene] });
  };

  const handleDuplicateScene = (index: number) => {
    const source = project.scenes[index];
    const duplicated: Scene = {
      ...source,
      id: `sc-${Date.now()}`,
      title: `${source.title} (Copia)`,
      order: project.scenes.length + 1,
    };
    const newScenes = [...project.scenes];
    newScenes.splice(index + 1, 0, duplicated);
    onUpdateProject({ scenes: newScenes });
  };

  const handleDeleteScene = (sceneId: string) => {
    if (project.scenes.length <= 1) {
      alert('El proyecto debe contener al menos una escena.');
      return;
    }
    const updated = project.scenes.filter((s) => s.id !== sceneId);
    onUpdateProject({ scenes: updated });
  };

  const handleMoveScene = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= project.scenes.length) return;

    const newScenes = [...project.scenes];
    const [removed] = newScenes.splice(index, 1);
    newScenes.splice(targetIndex, 0, removed);
    onUpdateProject({ scenes: newScenes });
  };

  const handleAiSuggest = async (scene: Scene, index: number) => {
    setLoadingSceneAiId(scene.id);
    try {
      const prevScene = index > 0 ? project.scenes[index - 1] : null;
      const res = await fetch('/api/ai/scene-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sceneIndex: index,
          audioText: scene.audioVoiceover,
          durationSeconds: scene.durationSeconds,
          fps: project.fps,
          aspectRatio: project.aspectRatio,
          previousSceneSummary: prevScene ? `${prevScene.title}: ${prevScene.visualAction}` : 'Inicio del video',
        }),
      });

      if (!res.ok) throw new Error('Fallo la consulta');
      const data = await res.json();

      handleUpdateScene(scene.id, {
        visualAction: data.visualAction || scene.visualAction,
        motionNotes: data.motionNotes || scene.motionNotes,
        sfxMusic: data.sfx || scene.sfxMusic,
        remotionTip: data.remotionTip || scene.remotionTip,
      });
    } catch (err) {
      console.error(err);
      alert('No se pudo generar la sugerencia para esta escena.');
    } finally {
      setLoadingSceneAiId(null);
    }
  };

  const totalVideoSeconds = accumulatedSeconds;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            2. Guion & Storyboard Sincronizado
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Vista combinada de dos columnas: Locución vs Acción Visual con cálculo exacto de timecodes y frames Remotion.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenRhythmSimulator}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-violet-400" />
            <span>Simulador de Ritmo</span>
          </button>

          <button
            onClick={handleAddScene}
            className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold shadow-md shadow-violet-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Escena</span>
          </button>
        </div>
      </div>

      {/* Visual Timeline Track */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold text-slate-200">Línea de Tiempo de Escenas</span>
            <span>·</span>
            <span className="tabular-nums">00:00.0 → {formatTimecode(totalVideoSeconds)}</span>
          </div>
          <span className="tabular-nums">
            {project.fps * Math.round(totalVideoSeconds)} frames totales
          </span>
        </div>

        {/* Visual Blocks proportional to duration */}
        <div className="flex h-11 w-full bg-slate-950 rounded-xl overflow-hidden p-1 gap-1 border border-slate-800">
          {scenesWithOffsets.map((scene, i) => {
            const widthPct = Math.max(5, (scene.durationSeconds / totalVideoSeconds) * 100);
            return (
              <div
                key={scene.id}
                style={{
                  width: `${widthPct}%`,
                  backgroundColor: scene.colorTag || '#4F46E5',
                }}
                className="h-full rounded-lg flex flex-col justify-center px-2 py-0.5 text-white opacity-90 hover:opacity-100 transition-opacity cursor-pointer group relative overflow-hidden"
                title={`${scene.title}: ${scene.durationSeconds}s (${scene.framesCount} frames)`}
              >
                <div className="flex items-center justify-between text-[11px] font-bold font-mono leading-none truncate">
                  <span>#{i + 1}</span>
                  <span className="text-[10px] opacity-80">{scene.durationSeconds}s</span>
                </div>
                <span className="text-[9px] font-sans truncate opacity-90 leading-tight">
                  {scene.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scene Cards Stack */}
      <div className="space-y-6">
        {scenesWithOffsets.map((scene, index) => {
          const isLoadingAi = loadingSceneAiId === scene.id;

          return (
            <div
              key={scene.id}
              className="bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 sm:p-6 space-y-5 transition-colors relative"
            >
              {/* Scene Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  {/* Badge & Order */}
                  <div
                    style={{ backgroundColor: scene.colorTag || '#6366F1' }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs text-white shadow-sm"
                  >
                    {index + 1}
                  </div>

                  {/* Scene Title Input */}
                  <input
                    type="text"
                    value={scene.title}
                    onChange={(e) => handleUpdateScene(scene.id, { title: e.target.value })}
                    className="font-display font-bold text-base text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-violet-500 focus:outline-none transition-colors px-1 max-w-[220px] sm:max-w-xs"
                  />
                </div>

                {/* Right: Timecode & Remotion Frames Badges & Actions */}
                <div className="flex items-center gap-3">
                  {/* Timecode Badge */}
                  <div className="flex items-center gap-2 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-xs font-mono tabular-nums text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-violet-400" />
                    <span>
                      {formatTimecode(scene.startSec)} - {formatTimecode(scene.endSec)}
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400 text-[11px]">
                      {formatFrame(scene.startFrame)} - {formatFrame(scene.endFrame)}
                    </span>
                  </div>

                  {/* Duration adjust buttons */}
                  <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateScene(scene.id, {
                          durationSeconds: Math.max(0.5, Number((scene.durationSeconds - 0.5).toFixed(1))),
                        })
                      }
                      className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white rounded hover:bg-slate-800 text-xs font-mono"
                      title="Reducir 0.5s"
                    >
                      -
                    </button>
                    <span className="text-xs font-mono font-bold px-1 text-white tabular-nums">
                      {scene.durationSeconds}s
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateScene(scene.id, {
                          durationSeconds: Number((scene.durationSeconds + 0.5).toFixed(1)),
                        })
                      }
                      className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white rounded hover:bg-slate-800 text-xs font-mono"
                      title="Aumentar 0.5s"
                    >
                      +
                    </button>
                  </div>

                  {/* Card Controls */}
                  <div className="flex items-center gap-1 text-slate-400">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveScene(index, 'up')}
                      className="p-1 rounded hover:bg-slate-800 hover:text-white disabled:opacity-20 cursor-pointer"
                      title="Mover arriba"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      disabled={index === project.scenes.length - 1}
                      onClick={() => handleMoveScene(index, 'down')}
                      className="p-1 rounded hover:bg-slate-800 hover:text-white disabled:opacity-20 cursor-pointer"
                      title="Mover abajo"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDuplicateScene(index)}
                      className="p-1 rounded hover:bg-slate-800 hover:text-white cursor-pointer"
                      title="Duplicar escena"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteScene(scene.id)}
                      className="p-1 rounded hover:bg-rose-900/50 hover:text-rose-300 text-slate-500 cursor-pointer"
                      title="Eliminar escena"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Two Column Layout: Voiceover vs Visual Action */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Column 1: Voiceover & Copy */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-violet-400" />
                      <span>Audio / Locución / Copy en Pantalla</span>
                    </span>

                    {/* Word pacing indicator */}
                    <div className="flex items-center gap-1.5 font-mono text-[11px] tabular-nums">
                      <span>{scene.words} palabras</span>
                      <span className="text-slate-600">·</span>
                      {scene.isTooFast ? (
                        <span className="text-rose-400 flex items-center gap-1" title="Muy rápido para esta duración">
                          <AlertTriangle className="w-3 h-3 text-rose-400" />
                          <span>{scene.wordsPerMinute} pal/min (Rápido)</span>
                        </span>
                      ) : scene.isTooSlow ? (
                        <span className="text-amber-400 flex items-center gap-1">
                          <span>{scene.wordsPerMinute} pal/min (Lento)</span>
                        </span>
                      ) : (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>{scene.wordsPerMinute} pal/min (Óptimo)</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <textarea
                    rows={4}
                    value={scene.audioVoiceover}
                    onChange={(e) => handleUpdateScene(scene.id, { audioVoiceover: e.target.value })}
                    placeholder="Escribe la locución o el texto cinético que se leerá durante esta escena..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors resize-none leading-relaxed"
                  />
                </div>

                {/* Column 2: Visual Action & Motion Graphics */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Acción Visual & Motion Graphics</span>
                    </span>

                    <button
                      type="button"
                      disabled={isLoadingAi}
                      onClick={() => handleAiSuggest(scene, index)}
                      className="text-[11px] text-cyan-300 hover:text-cyan-200 flex items-center gap-1 font-semibold disabled:opacity-50 cursor-pointer"
                    >
                      {isLoadingAi ? (
                        <Loader2 className="w-3 h-3 animate-spin text-cyan-300" />
                      ) : (
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                      )}
                      <span>{isLoadingAi ? 'Consultando...' : 'Sugerir con IA'}</span>
                    </button>
                  </div>

                  <textarea
                    rows={4}
                    value={scene.visualAction}
                    onChange={(e) => handleUpdateScene(scene.id, { visualAction: e.target.value })}
                    placeholder="Describe los elementos en pantalla, capas, movimientos de cámara y tipografía..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Sub-row: Transition, SFX, Motion Notes & Remotion Tip */}
              <div className="pt-3 border-t border-slate-800/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                {/* Transition Selector */}
                <div>
                  <label className="block text-slate-400 font-mono text-[11px] mb-1">
                    Transición de Salida
                  </label>
                  <select
                    value={scene.transitionOut}
                    onChange={(e) =>
                      handleUpdateScene(scene.id, {
                        transitionOut: e.target.value as Scene['transitionOut'],
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-violet-500 text-xs cursor-pointer"
                  >
                    <option value="cut">Corte Directo (Cut)</option>
                    <option value="whip-pan">Whip Pan (Slide Rápido)</option>
                    <option value="zoom-blur">Zoom In & Blur</option>
                    <option value="morph">Morphing de Formas SVG</option>
                    <option value="kinetic-glitch">Kinetic Glitch</option>
                    <option value="fade-cross">Disolvencia Cruzada</option>
                  </select>
                </div>

                {/* SFX / Music */}
                <div>
                  <label className="block text-slate-400 font-mono text-[11px] mb-1">
                    Efectos de Sonido (SFX)
                  </label>
                  <input
                    type="text"
                    value={scene.sfxMusic}
                    onChange={(e) => handleUpdateScene(scene.id, { sfxMusic: e.target.value })}
                    placeholder="Ej. Whoosh + bass drop"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-violet-500 text-xs"
                  />
                </div>

                {/* Motion Notes / Easing */}
                <div>
                  <label className="block text-slate-400 font-mono text-[11px] mb-1">
                    Curvas de Easing & Capas
                  </label>
                  <input
                    type="text"
                    value={scene.motionNotes}
                    onChange={(e) => handleUpdateScene(scene.id, { motionNotes: e.target.value })}
                    placeholder="Ej. spring({ damping: 12 })"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-violet-500 text-xs font-mono"
                  />
                </div>

                {/* Color Tag / Remotion Tip */}
                <div>
                  <label className="block text-slate-400 font-mono text-[11px] mb-1">
                    Color de Escena & Tip
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={scene.colorTag || '#6366F1'}
                      onChange={(e) => handleUpdateScene(scene.id, { colorTag: e.target.value })}
                      className="w-8 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
                      title="Color identificador para la timeline"
                    />
                    <input
                      type="text"
                      value={scene.remotionTip || ''}
                      onChange={(e) => handleUpdateScene(scene.id, { remotionTip: e.target.value })}
                      placeholder="Tip Remotion..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-violet-500 text-[11px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Scene Bottom Button */}
      <div className="pt-2 text-center">
        <button
          onClick={handleAddScene}
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-dashed border-slate-700 hover:border-violet-500 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-violet-400" />
          <span>Agregar Nueva Escena al Storyboard</span>
        </button>
      </div>
    </div>
  );
};
