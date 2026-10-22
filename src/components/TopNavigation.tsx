import React from 'react';
import { Project } from '../types';
import { Play, Plus, Film, Clock, CheckSquare, Code2, Sparkles } from 'lucide-react';
import { calculateProjectTiming, formatTimecode } from '../utils/storage';

interface TopNavigationProps {
  projects: Project[];
  activeProject: Project;
  activeTab: 'brief' | 'storyboard' | 'schedule' | 'remotion';
  setActiveTab: (tab: 'brief' | 'storyboard' | 'schedule' | 'remotion') => void;
  onSelectProject: (id: string) => void;
  onCreateProject: () => void;
  onOpenRhythmSimulator: () => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  projects,
  activeProject,
  activeTab,
  setActiveTab,
  onSelectProject,
  onCreateProject,
  onOpenRhythmSimulator,
}) => {
  const timing = calculateProjectTiming(activeProject);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="flex items-center justify-between gap-6 max-w-7xl mx-auto">
        {/* Zone 1: Wordmark Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-lg tracking-tight text-white whitespace-nowrap">
                Kinetix<span className="text-violet-400">.Studio</span>
              </span>
              <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                Remotion Ready
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Flujo de Motion Graphics & Storyboard
            </p>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Single-Line 4-step workflow) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('brief')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'brief'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1. Brief & Concepto</span>
          </button>

          <button
            onClick={() => setActiveTab('storyboard')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'storyboard'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>2. Guion & Tiempos</span>
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'schedule'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>3. Cronograma & Hitos</span>
          </button>

          <button
            onClick={() => setActiveTab('remotion')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              activeTab === 'remotion'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>4. Remotion Hub & IA</span>
          </button>
        </nav>

        {/* Zone 3: Actions & Project Selector */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Project dropdown */}
          <div className="relative">
            <select
              value={activeProject.id}
              onChange={(e) => onSelectProject(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 hover:border-slate-600 text-slate-200 text-xs rounded-lg px-3 py-1.5 pr-8 focus:outline-none focus:ring-1 focus:ring-violet-500 appearance-none cursor-pointer max-w-[160px] sm:max-w-[200px] truncate"
              title="Cambiar proyecto activo"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-slate-200">
                  {p.title}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
              ▼
            </div>
          </div>

          {/* New project button */}
          <button
            onClick={onCreateProject}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Crear nuevo proyecto"
            aria-label="Nuevo Proyecto"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Rehearse rhythm simulator */}
          <button
            onClick={onOpenRhythmSimulator}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-violet-900/30 transition-all whitespace-nowrap shrink-0"
            title="Abrir teleprompter dinámico para probar el ritmo de voz"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Simular Ritmo</span>
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      <div className="flex md:hidden items-center justify-around mt-2 pt-2 border-t border-slate-800/60 text-xs">
        <button
          onClick={() => setActiveTab('brief')}
          className={`px-2 py-1 ${activeTab === 'brief' ? 'text-violet-400 font-bold' : 'text-slate-400'}`}
        >
          1. Brief
        </button>
        <button
          onClick={() => setActiveTab('storyboard')}
          className={`px-2 py-1 ${activeTab === 'storyboard' ? 'text-violet-400 font-bold' : 'text-slate-400'}`}
        >
          2. Guion ({formatTimecode(timing.totalSeconds)})
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-2 py-1 ${activeTab === 'schedule' ? 'text-violet-400 font-bold' : 'text-slate-400'}`}
        >
          3. Hitos
        </button>
        <button
          onClick={() => setActiveTab('remotion')}
          className={`px-2 py-1 ${activeTab === 'remotion' ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
        >
          4. Remotion
        </button>
      </div>
    </header>
  );
};
