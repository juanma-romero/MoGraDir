import React, { useState, useEffect, useRef } from 'react';
import { Project } from '../types';
import { formatTimecode, formatFrame, calculateProjectTiming } from '../utils/storage';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, X, Volume2, Film, Clock } from 'lucide-react';

interface RhythmSimulatorModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export const RhythmSimulatorModal: React.FC<RhythmSimulatorModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [elapsedInScene, setElapsedInScene] = useState(0);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const timing = calculateProjectTiming(project);
  const scenes = project.scenes;
  const currentScene = scenes[currentSceneIndex] || scenes[0];

  // Calculate start times for scenes
  let acc = 0;
  const sceneStartTimes = scenes.map((s) => {
    const start = acc;
    acc += Number(s.durationSeconds) || 1;
    return start;
  });

  const resetPlayback = () => {
    setIsPlaying(false);
    setCurrentSceneIndex(0);
    setElapsedInScene(0);
    setTotalElapsed(0);
    lastTimeRef.current = null;
  };

  useEffect(() => {
    if (!isOpen) {
      resetPlayback();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isPlaying) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      lastTimeRef.current = null;
      return;
    }

    const animate = (time: number) => {
      if (lastTimeRef.current !== null) {
        const deltaSeconds = ((time - lastTimeRef.current) / 1000) * playbackSpeed;

        setElapsedInScene((prevElapsed) => {
          const sceneDur = Number(currentScene.durationSeconds) || 1;
          const newElapsed = prevElapsed + deltaSeconds;

          if (newElapsed >= sceneDur) {
            // Move to next scene
            if (currentSceneIndex < scenes.length - 1) {
              setCurrentSceneIndex((idx) => idx + 1);
              return 0;
            } else {
              // Video ended
              setIsPlaying(false);
              return sceneDur;
            }
          }
          return newElapsed;
        });

        setTotalElapsed((prev) => Math.min(timing.totalSeconds, prev + deltaSeconds));
      }

      lastTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, currentSceneIndex, scenes, playbackSpeed, currentScene, timing.totalSeconds]);

  if (!isOpen) return null;

  const sceneDuration = Number(currentScene.durationSeconds) || 1;
  const sceneProgressPct = Math.min(100, (elapsedInScene / sceneDuration) * 100);
  const totalProgressPct = Math.min(100, (totalElapsed / timing.totalSeconds) * 100);

  const currentFrame = Math.round(totalElapsed * project.fps);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-white">
                Simulador de Ritmo & Locución
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                {project.title} · {project.aspectRatio} @ {project.fps} FPS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Live Timecode & Frame */}
            <div className="text-right font-mono text-xs tabular-nums">
              <span className="font-bold text-violet-400">
                {formatTimecode(totalElapsed)}
              </span>
              <span className="text-slate-500"> / {formatTimecode(timing.totalSeconds)}</span>
              <div className="text-[10px] text-slate-400">
                {formatFrame(currentFrame)} / {formatFrame(timing.totalFrames)}
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Video Progress Bar */}
        <div className="h-1.5 w-full bg-slate-950">
          <div
            className="h-full bg-cyan-400 transition-all duration-75"
            style={{ width: `${totalProgressPct}%` }}
          />
        </div>

        {/* Scene Prompter Content */}
        <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
          {/* Current Scene Header */}
          <div className="flex items-center justify-between text-xs font-mono">
            <span
              style={{ backgroundColor: currentScene.colorTag || '#6366F1' }}
              className="px-2.5 py-1 rounded-lg text-white font-bold"
            >
              Escena {currentSceneIndex + 1} de {scenes.length}: {currentScene.title}
            </span>

            <span className="text-slate-400 tabular-nums">
              {elapsedInScene.toFixed(1)}s / {sceneDuration}s ({Math.round(elapsedInScene * project.fps)}f)
            </span>
          </div>

          {/* Scene Progress Rail */}
          <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-500 transition-all duration-75"
              style={{ width: `${sceneProgressPct}%` }}
            />
          </div>

          {/* Teleprompter Big Text Area */}
          <div className="min-h-[160px] flex items-center justify-center p-6 bg-slate-950/70 border border-slate-800/80 rounded-2xl text-center">
            {currentScene.audioVoiceover ? (
              <p className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-relaxed text-balance">
                "{currentScene.audioVoiceover}"
              </p>
            ) : (
              <p className="text-sm text-slate-500 italic">
                (Esta escena no tiene texto de locución registrado)
              </p>
            )}
          </div>

          {/* Visual Action & SFX helper cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/60 space-y-1">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase flex items-center gap-1">
                <Film className="w-3 h-3" />
                <span>Acción Visual en Remotion</span>
              </span>
              <p className="text-slate-300 line-clamp-2 leading-relaxed">
                {currentScene.visualAction || 'Sin descripción visual'}
              </p>
            </div>

            <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/60 space-y-1">
              <span className="text-[10px] font-mono text-violet-400 font-bold uppercase flex items-center gap-1">
                <Volume2 className="w-3 h-3" />
                <span>Audio Cues & SFX</span>
              </span>
              <p className="text-slate-300 line-clamp-2 leading-relaxed">
                {currentScene.sfxMusic || 'Sin efectos sonoros asignados'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Controls */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-4">
          {/* Speed selector */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-500 text-[11px] mr-1">Velocidad:</span>
            {[1, 1.15, 1.25].map((speed) => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-2 py-1 rounded text-[11px] font-mono cursor-pointer ${
                  playbackSpeed === speed
                    ? 'bg-violet-600 text-white font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Play / Pause / Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (currentSceneIndex > 0) {
                  setCurrentSceneIndex((idx) => idx - 1);
                  setElapsedInScene(0);
                  setTotalElapsed(sceneStartTimes[currentSceneIndex - 1]);
                }
              }}
              disabled={currentSceneIndex === 0}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-30 cursor-pointer"
              title="Escena anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-violet-600/30 transition-all cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pausar</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>{totalElapsed >= timing.totalSeconds ? 'Repetir' : 'Reproducir'}</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                if (currentSceneIndex < scenes.length - 1) {
                  setCurrentSceneIndex((idx) => idx + 1);
                  setElapsedInScene(0);
                  setTotalElapsed(sceneStartTimes[currentSceneIndex + 1]);
                }
              }}
              disabled={currentSceneIndex === scenes.length - 1}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-30 cursor-pointer"
              title="Escena siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={resetPlayback}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer ml-1"
              title="Reiniciar simulador"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
