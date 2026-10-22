export type AspectRatioType = '9:16' | '1:1' | '16:9';

export interface Scene {
  id: string;
  order: number;
  title: string;
  durationSeconds: number; // e.g. 3.0
  audioVoiceover: string; // Locución / Copy en pantalla
  visualAction: string; // Descripción visual / Motion graphics
  motionNotes: string; // Easing, cámaras, capas
  sfxMusic: string; // Efectos de sonido y notas musicales
  transitionOut: 'cut' | 'morph' | 'whip-pan' | 'zoom-blur' | 'kinetic-glitch' | 'fade-cross';
  colorTag: string; // Hex o nombre de color para identificar la escena
  remotionTip?: string; // Consejo técnico para codificar en Remotion
}

export type MilestoneStatus = 'pending' | 'in_progress' | 'completed';

export interface Milestone {
  id: string;
  phaseId: 'phase-1' | 'phase-2' | 'phase-3' | 'phase-4' | 'phase-5';
  title: string;
  description: string;
  status: MilestoneStatus;
  deadline?: string;
  notes?: string;
}

export interface Phase {
  id: 'phase-1' | 'phase-2' | 'phase-3' | 'phase-4' | 'phase-5';
  number: number;
  name: string;
  subtitle: string;
  iconName: string;
}

export interface Project {
  id: string;
  title: string;
  clientOrBrand: string;
  goal: string;
  audience: string;
  aspectRatio: AspectRatioType;
  targetDuration: number; // e.g. 15, 30, 60
  fps: 30 | 60;
  hook03s: string; // Gancho visual & sonoro de los primeros 3 segundos
  colorPalette: string;
  audioStyle: string;
  scenes: Scene[];
  milestones: Milestone[];
  updatedAt: string;
}

export interface AIConcept {
  title: string;
  coreIdea: string;
  hook03s: string;
  visualMetaphor: string;
  colorPalette: string;
  audioVibe: string;
  remotionTip: string;
}
