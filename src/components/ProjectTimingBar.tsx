import React from 'react';
import { Project } from '../types';
import { calculateProjectTiming, formatTimecode, formatFrame } from '../utils/storage';
import { getResolutionForAspectRatio } from '../utils/remotionGenerators';
import { Smartphone, Square, Monitor, Layers, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ProjectTimingBarProps {
  project: Project;
}

export const ProjectTimingBar: React.FC<ProjectTimingBarProps> = ({ project }) => {
  const timing = calculateProjectTiming(project);
  const { width, height } = getResolutionForAspectRatio(project.aspectRatio);

  const percentageOfTarget = Math.min(100, Math.round((timing.totalSeconds / timing.targetSeconds) * 100));

  const AspectIcon =
    project.aspectRatio === '9:16'
      ? Smartphone
      : project.aspectRatio === '1:1'
      ? Square
      : Monitor;

  return (
    <section className="bg-slate-900/60 border-b border-slate-800/80 px-4 lg:px-8 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Left: Project name & specs */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
            <AspectIcon className="w-3.5 h-3.5 text-violet-400" />
            <span className="font-mono">{project.aspectRatio}</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400 font-mono text-[11px]">{width}x{height}</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400 font-mono text-[11px]">{project.fps} FPS</span>
          </div>

          <span className="text-slate-700 hidden sm:inline">|</span>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>{project.scenes.length} escenas</span>
            <span className="text-slate-600">·</span>
            <span className="truncate max-w-[200px] text-slate-300 font-medium">
              {project.title}
            </span>
          </div>
        </div>

        {/* Right: Timing bar & Live Counters */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
          {/* Progress bar */}
          <div className="flex flex-col gap-1 min-w-[140px] sm:min-w-[180px]">
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
              <span>{percentageOfTarget}% de meta</span>
              <span>Meta: {timing.targetSeconds}s</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  timing.status === 'over'
                    ? 'bg-rose-500'
                    : timing.status === 'optimal'
                    ? 'bg-emerald-400'
                    : 'bg-violet-500'
                }`}
                style={{ width: `${percentageOfTarget}%` }}
              />
            </div>
          </div>

          {/* Timecode Box */}
          <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1 rounded-lg border border-slate-800">
            <div className="flex flex-col text-right">
              <span className="text-xs font-mono font-bold text-white tracking-wider tabular-nums">
                {formatTimecode(timing.totalSeconds)}
              </span>
              <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                {formatFrame(timing.totalFrames)} frames
              </span>
            </div>

            {/* Status indicator */}
            {timing.status === 'optimal' ? (
              <span
                className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/40"
                title="Duración perfecta para redes"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span className="hidden md:inline">En tiempo</span>
              </span>
            ) : timing.status === 'over' ? (
              <span
                className="text-[10px] text-rose-400 flex items-center gap-1 font-medium bg-rose-950/40 px-1.5 py-0.5 rounded border border-rose-800/40"
                title={`Excede por +${timing.diffSeconds}s`}
              >
                <AlertCircle className="w-3 h-3 text-rose-400" />
                <span>+{timing.diffSeconds}s</span>
              </span>
            ) : (
              <span
                className="text-[10px] text-amber-400 flex items-center gap-1 font-medium bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-800/40"
                title={`Faltan ${Math.abs(timing.diffSeconds)}s para la meta`}
              >
                <span>{timing.diffSeconds}s</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
