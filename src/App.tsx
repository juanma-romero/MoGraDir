import React, { useState, useEffect } from 'react';
import { Project } from './types';
import {
  loadProjects,
  saveProjects,
  loadActiveProjectId,
  saveActiveProjectId,
} from './utils/storage';
import { DEFAULT_MILESTONES, TEMPLATE_PROJECTS } from './utils/initialData';
import { TopNavigation } from './components/TopNavigation';
import { ProjectTimingBar } from './components/ProjectTimingBar';
import { BriefView } from './components/BriefView';
import { StoryboardView } from './components/StoryboardView';
import { ProductionScheduleView } from './components/ProductionScheduleView';
import { RemotionExportView } from './components/RemotionExportView';
import { RhythmSimulatorModal } from './components/RhythmSimulatorModal';
import { Plus, Sparkles, X, Check } from 'lucide-react';

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'brief' | 'storyboard' | 'schedule' | 'remotion'>('storyboard');
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  // Load projects on startup
  useEffect(() => {
    const loaded = loadProjects();
    setProjects(loaded);
    const initialId = loadActiveProjectId(loaded);
    setActiveProjectId(initialId);
  }, []);

  const activeProject =
    projects.find((p) => p.id === activeProjectId) || projects[0] || TEMPLATE_PROJECTS[0];

  const handleUpdateProject = (updatedFields: Partial<Project>) => {
    setProjects((prevProjects) => {
      const next = prevProjects.map((p) => {
        if (p.id === activeProject.id) {
          return {
            ...p,
            ...updatedFields,
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });
      saveProjects(next);
      return next;
    });
  };

  const handleSelectProject = (id: string) => {
    setActiveProjectId(id);
    saveActiveProjectId(id);
  };

  const handleCreateNewProject = (template?: Project) => {
    const newProj: Project = template
      ? {
          ...template,
          id: `proj-${Date.now()}`,
          title: `${template.title} (Nuevo)`,
          updatedAt: new Date().toISOString(),
        }
      : {
          id: `proj-${Date.now()}`,
          title: 'Nuevo Anuncio de Redes 15s',
          clientOrBrand: 'Mi Marca',
          goal: 'Generar conversiones y clics en el perfil de Instagram/TikTok.',
          audience: 'Audiencia general de redes sociales',
          aspectRatio: '9:16',
          targetDuration: 15,
          fps: 30,
          hook03s: 'Texto animado con spring de impacto que detiene el scroll en 0-3 segundos.',
          colorPalette: '#0F172A, #06B6D4, #8B5CF6, #FFFFFF',
          audioStyle: 'Beat dinámico moderno a 124 BPM con drops marcados.',
          updatedAt: new Date().toISOString(),
          scenes: [
            {
              id: `sc-${Date.now()}-1`,
              order: 1,
              title: 'Gancho Inicial (0-3s)',
              durationSeconds: 3.0,
              audioVoiceover: '¿Sigues buscando cómo destacar tus videos en redes?',
              visualAction: 'Texto gigante que escala con spring elástico y sacudida sutil de cámara. Partículas que explotan.',
              motionNotes: 'spring({ damping: 11, mass: 0.6 }) con desenfoque de movimiento.',
              sfxMusic: 'Whoosh rápido + bass drop sutil.',
              transitionOut: 'whip-pan',
              colorTag: '#6366F1',
              remotionTip: 'Usa <AbsoluteFill> con interpolate() en escala.',
            },
            {
              id: `sc-${Date.now()}-2`,
              order: 2,
              title: 'Presentación de la Solución',
              durationSeconds: 4.0,
              audioVoiceover: 'Conoce la herramienta definitiva para animar con Remotion y React.',
              visualAction: 'Tarjetas de interfaz flotantes que se ordenan solas con animación secuencial.',
              motionNotes: 'Stagger de 3 frames entre tarjetas con interpolación en eje Y.',
              sfxMusic: 'Sonido de clic táctil suave.',
              transitionOut: 'morph',
              colorTag: '#06B6D4',
              remotionTip: 'Aplica spring a cada tarjeta con delay en frames.',
            },
            {
              id: `sc-${Date.now()}-3`,
              order: 3,
              title: 'Beneficio Principal',
              durationSeconds: 5.0,
              audioVoiceover: 'Ahorra horas de animación y genera videos profesionales en minutos.',
              visualAction: 'Iconos de velocidad y cohete espacial con estela brillante. Números que giran.',
              motionNotes: 'Rotación continua y resplandor con glow dinámico.',
              sfxMusic: 'Riser ascendente y acorde positivo.',
              transitionOut: 'zoom-blur',
              colorTag: '#10B981',
              remotionTip: 'Combina SVG strokeDasharray con interpolate().',
            },
            {
              id: `sc-${Date.now()}-4`,
              order: 4,
              title: 'Llamado a la Acción (CTA)',
              durationSeconds: 3.0,
              audioVoiceover: 'Comienza ahora gratis. Enlace directo en la biografía.',
              visualAction: 'Logo principal y botón animado con efecto de pulso continuo y flecha apuntando.',
              motionNotes: 'Pulsación constante con Math.sin() en scale.',
              sfxMusic: 'Doble chime de éxito y campana final.',
              transitionOut: 'cut',
              colorTag: '#EC4899',
              remotionTip: 'Congela el último fotograma para que no parpadee al terminar.',
            },
          ],
          milestones: DEFAULT_MILESTONES.map((m) => ({ ...m, status: 'pending' })),
        };

    const nextProjects = [newProj, ...projects];
    setProjects(nextProjects);
    saveProjects(nextProjects);
    handleSelectProject(newProj.id);
    setShowNewProjectModal(false);
    setActiveTab('brief');
  };

  const handleImportProject = (imported: Project) => {
    const validProject: Project = {
      ...imported,
      id: `proj-imported-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    const nextProjects = [validProject, ...projects];
    setProjects(nextProjects);
    saveProjects(nextProjects);
    handleSelectProject(validProject.id);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-violet-500 selection:text-white">
      {/* Top Navigation */}
      <TopNavigation
        projects={projects}
        activeProject={activeProject}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSelectProject={handleSelectProject}
        onCreateProject={() => setShowNewProjectModal(true)}
        onOpenRhythmSimulator={() => setIsSimulatorOpen(true)}
      />

      {/* Global Project Timing HUD */}
      <ProjectTimingBar project={activeProject} />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {activeTab === 'brief' && (
          <BriefView
            project={activeProject}
            onUpdateProject={handleUpdateProject}
            onProceedToStoryboard={() => setActiveTab('storyboard')}
          />
        )}

        {activeTab === 'storyboard' && (
          <StoryboardView
            project={activeProject}
            onUpdateProject={handleUpdateProject}
            onOpenRhythmSimulator={() => setIsSimulatorOpen(true)}
          />
        )}

        {activeTab === 'schedule' && (
          <ProductionScheduleView
            project={activeProject}
            onUpdateProject={handleUpdateProject}
            onProceedToRemotion={() => setActiveTab('remotion')}
          />
        )}

        {activeTab === 'remotion' && (
          <RemotionExportView
            project={activeProject}
            onImportProject={handleImportProject}
          />
        )}
      </main>

      {/* Rhythm Simulator Teleprompter Modal */}
      <RhythmSimulatorModal
        project={activeProject}
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
      />

      {/* New Project / Template Selection Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-display font-bold text-white tracking-tight">
                  Crear Nuevo Proyecto
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Elige una plantilla optimizada para redes o empieza en blanco.
                </p>
              </div>
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleCreateNewProject()}
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-violet-500/80 text-left transition-all group cursor-pointer flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-mono font-bold text-violet-400 uppercase">
                    Personalizado
                  </span>
                  <h4 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">
                    Proyecto en Blanco (15s · 9:16)
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Estructura limpia con 4 escenas base listas para personalizar.
                  </p>
                </div>
                <Plus className="w-5 h-5 text-slate-500 group-hover:text-violet-400 transition-colors" />
              </button>

              {TEMPLATE_PROJECTS.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => handleCreateNewProject(tpl)}
                  className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/80 text-left transition-all group cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                        Plantilla
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {tpl.targetDuration}s · {tpl.aspectRatio}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {tpl.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                      {tpl.goal}
                    </p>
                  </div>
                  <Sparkles className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quiet, clean footer */}
      <footer className="border-t border-slate-900 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Kinetix Studio</span>
            <span>·</span>
            <span>Flujo de Trabajo para Motion Graphics & Remotion</span>
          </div>
          <p className="text-[11px] text-slate-600">
            Diseñado para optimizar la retención en publicidad y formatos cortos.
          </p>
        </div>
      </footer>
    </div>
  );
}
