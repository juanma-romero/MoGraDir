import React, { useState } from 'react';
import { Project, Milestone, MilestoneStatus } from '../types';
import { PHASES } from '../utils/initialData';
import {
  CheckCircle2,
  Clock,
  Circle,
  Plus,
  Calendar,
  FileText,
  Palette,
  Boxes,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface ProductionScheduleViewProps {
  project: Project;
  onUpdateProject: (updated: Partial<Project>) => void;
  onProceedToRemotion: () => void;
}

export const ProductionScheduleView: React.FC<ProductionScheduleViewProps> = ({
  project,
  onUpdateProject,
  onProceedToRemotion,
}) => {
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPhase, setNewTaskPhase] = useState<'phase-1' | 'phase-2' | 'phase-3' | 'phase-4' | 'phase-5'>('phase-1');
  const [newTaskDesc, setNewTaskDesc] = useState('');

  // Overall progress
  const totalMilestones = project.milestones.length;
  const completedMilestones = project.milestones.filter((m) => m.status === 'completed').length;
  const inProgressMilestones = project.milestones.filter((m) => m.status === 'in_progress').length;
  const progressPct = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  const handleToggleStatus = (milestoneId: string) => {
    const updated = project.milestones.map((m) => {
      if (m.id === milestoneId) {
        const nextStatus: MilestoneStatus =
          m.status === 'pending'
            ? 'in_progress'
            : m.status === 'in_progress'
            ? 'completed'
            : 'pending';
        return { ...m, status: nextStatus };
      }
      return m;
    });
    onUpdateProject({ milestones: updated });
  };

  const handleUpdateNotes = (milestoneId: string, notes: string) => {
    const updated = project.milestones.map((m) => (m.id === milestoneId ? { ...m, notes } : m));
    onUpdateProject({ milestones: updated });
  };

  const handleUpdateDeadline = (milestoneId: string, deadline: string) => {
    const updated = project.milestones.map((m) => (m.id === milestoneId ? { ...m, deadline } : m));
    onUpdateProject({ milestones: updated });
  };

  const handleAddNewMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newMilestone: Milestone = {
      id: `m-custom-${Date.now()}`,
      phaseId: newTaskPhase,
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim() || 'Hito personalizado de producción',
      status: 'pending',
    };

    onUpdateProject({ milestones: [...project.milestones, newMilestone] });
    setNewTaskTitle('');
    setNewTaskDesc('');
    setShowAddModal(false);
  };

  const getPhaseIcon = (id: string) => {
    switch (id) {
      case 'phase-1':
        return FileText;
      case 'phase-2':
        return Palette;
      case 'phase-3':
        return Boxes;
      case 'phase-4':
        return Sparkles;
      case 'phase-5':
        return CheckCircle2;
      default:
        return Layers;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            3. Cronograma de Producción & Hitos
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Flujo estructurado de 5 fases para pasar del concepto al render final en Remotion sin bloqueos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-violet-400" />
            <span>Agregar Tarea</span>
          </button>

          <button
            onClick={onProceedToRemotion}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold shadow-md shadow-cyan-600/20 transition-all cursor-pointer"
          >
            <span>Generar Código Remotion</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Global Progress Dashboard Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        <div className="md:col-span-2 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono tracking-wider text-slate-400">
              Progreso General de Producción
            </span>
            <span className="text-sm font-bold font-mono text-emerald-400 tabular-nums">
              {progressPct}% Completado
            </span>
          </div>

          <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-violet-600 to-emerald-400 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
            <span>
              <strong className="text-white tabular-nums">{completedMilestones}</strong> de{' '}
              <strong className="text-white tabular-nums">{totalMilestones}</strong> hitos listos
            </span>
            <span>·</span>
            <span className="text-amber-400">
              <strong className="tabular-nums">{inProgressMilestones}</strong> en proceso
            </span>
          </div>
        </div>

        {/* Phase Filter Segmented Control */}
        <div className="md:col-span-2 flex flex-wrap gap-1.5 justify-start md:justify-end">
          <button
            onClick={() => setSelectedPhaseFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              selectedPhaseFilter === 'all'
                ? 'bg-violet-600 text-white'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Todas ({totalMilestones})
          </button>

          {PHASES.map((p) => {
            const count = project.milestones.filter((m) => m.phaseId === p.id).length;
            const isDone = project.milestones
              .filter((m) => m.phaseId === p.id)
              .every((m) => m.status === 'completed');

            return (
              <button
                key={p.id}
                onClick={() => setSelectedPhaseFilter(p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  selectedPhaseFilter === p.id
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>Fase {p.number}</span>
                {isDone && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Phases Stack */}
      <div className="space-y-6">
        {PHASES.filter(
          (phase) => selectedPhaseFilter === 'all' || selectedPhaseFilter === phase.id
        ).map((phase) => {
          const PhaseIcon = getPhaseIcon(phase.id);
          const phaseMilestones = project.milestones.filter((m) => m.phaseId === phase.id);
          const phaseCompleted = phaseMilestones.filter((m) => m.status === 'completed').length;
          const phaseTotal = phaseMilestones.length;
          const phasePct = phaseTotal > 0 ? Math.round((phaseCompleted / phaseTotal) * 100) : 0;

          return (
            <div
              key={phase.id}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4"
            >
              {/* Phase Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-violet-950/80 border border-violet-800/60 flex items-center justify-center text-violet-300">
                    <PhaseIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-violet-400 uppercase tracking-wider">
                        Fase {phase.number}
                      </span>
                      <h2 className="text-base font-display font-bold text-white tracking-tight">
                        {phase.name}
                      </h2>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {phase.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-400 tabular-nums">
                    {phaseCompleted} de {phaseTotal} ({phasePct}%)
                  </span>
                  <div className="w-20 h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-emerald-400 transition-all duration-300"
                      style={{ width: `${phasePct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Milestones List */}
              <div className="space-y-2.5 pt-1">
                {phaseMilestones.map((m) => {
                  const isDone = m.status === 'completed';
                  const isInProgress = m.status === 'in_progress';

                  return (
                    <div
                      key={m.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isDone
                          ? 'bg-slate-950/40 border-slate-800/60 opacity-80 hover:opacity-100'
                          : isInProgress
                          ? 'bg-slate-950 border-violet-700/60 shadow-sm'
                          : 'bg-slate-950/80 border-slate-800/80'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        {/* Status Checkbox / Toggle */}
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(m.id)}
                          className="mt-0.5 shrink-0 transition-transform active:scale-90 cursor-pointer"
                          title="Cambiar estado: Pendiente → En Proceso → Completado"
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : isInProgress ? (
                            <Clock className="w-5 h-5 text-violet-400 animate-pulse" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-600 hover:text-slate-400" />
                          )}
                        </button>

                        {/* Title & Description */}
                        <div className="flex-1 space-y-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span
                              className={`text-sm font-semibold tracking-tight ${
                                isDone ? 'text-slate-400 line-through' : 'text-slate-100'
                              }`}
                            >
                              {m.title}
                            </span>

                            {/* Status label button */}
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(m.id)}
                              className={`text-[10px] font-mono px-2 py-0.5 rounded cursor-pointer ${
                                isDone
                                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                                  : isInProgress
                                  ? 'bg-violet-950/60 text-violet-300 border border-violet-800/60'
                                  : 'bg-slate-900 text-slate-400 border border-slate-800'
                              }`}
                            >
                              {isDone ? 'Completado' : isInProgress ? 'En Proceso' : 'Pendiente'}
                            </button>
                          </div>

                          <p className="text-xs text-slate-400 leading-relaxed">
                            {m.description}
                          </p>

                          {/* Editable notes & deadline bar */}
                          <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-slate-500">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              <input
                                type="date"
                                value={m.deadline || ''}
                                onChange={(e) => handleUpdateDeadline(m.id, e.target.value)}
                                className="bg-transparent border-b border-transparent hover:border-slate-700 text-slate-300 focus:outline-none focus:border-violet-500 text-[11px] font-mono"
                              />
                            </div>

                            <div className="flex items-center gap-1 flex-1 min-w-[200px]">
                              <span className="text-slate-600">Nota:</span>
                              <input
                                type="text"
                                value={m.notes || ''}
                                onChange={(e) => handleUpdateNotes(m.id, e.target.value)}
                                placeholder="Escribe notas de progreso o detalles..."
                                className="w-full bg-transparent border-b border-transparent hover:border-slate-700 text-slate-300 focus:outline-none focus:border-violet-500 text-[11px] placeholder-slate-600"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-white tracking-tight">
              Agregar Tarea al Cronograma
            </h3>

            <form onSubmit={handleAddNewMilestone} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Fase de Producción
                </label>
                <select
                  value={newTaskPhase}
                  onChange={(e) => setNewTaskPhase(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                >
                  {PHASES.map((p) => (
                    <option key={p.id} value={p.id}>
                      Fase {p.number}: {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Título del Hito / Tarea
                </label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Ej. Revisión de animación con el director creativo"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Descripción (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="Detalles de entrega o requerimientos..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-colors shadow-md shadow-violet-600/20"
                >
                  Guardar Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
