import { Project } from '../types';
import { TEMPLATE_PROJECTS } from './initialData';

const STORAGE_KEY = 'kinetix_motion_projects_v1';
const ACTIVE_PROJECT_KEY = 'kinetix_active_project_id_v1';

export function loadProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveProjects(TEMPLATE_PROJECTS);
      return TEMPLATE_PROJECTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      saveProjects(TEMPLATE_PROJECTS);
      return TEMPLATE_PROJECTS;
    }
    return parsed;
  } catch (error) {
    console.error('Error loading projects from localStorage:', error);
    return TEMPLATE_PROJECTS;
  }
}

export function saveProjects(projects: Project[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error('Error saving projects to localStorage:', error);
  }
}

export function loadActiveProjectId(availableProjects: Project[]): string {
  try {
    const savedId = localStorage.getItem(ACTIVE_PROJECT_KEY);
    if (savedId && availableProjects.some((p) => p.id === savedId)) {
      return savedId;
    }
    return availableProjects[0]?.id || TEMPLATE_PROJECTS[0].id;
  } catch {
    return availableProjects[0]?.id || TEMPLATE_PROJECTS[0].id;
  }
}

export function saveActiveProjectId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_PROJECT_KEY, id);
  } catch (error) {
    console.error('Error saving active project ID:', error);
  }
}

export function calculateProjectTiming(project: Project) {
  const totalSeconds = project.scenes.reduce((acc, sc) => acc + (Number(sc.durationSeconds) || 0), 0);
  const totalFrames = Math.round(totalSeconds * project.fps);
  const targetSeconds = project.targetDuration || 15;
  const targetFrames = Math.round(targetSeconds * project.fps);
  const diffSeconds = Number((totalSeconds - targetSeconds).toFixed(1));

  let status: 'optimal' | 'under' | 'over' = 'optimal';
  if (diffSeconds > 1.0) status = 'over';
  else if (diffSeconds < -1.0) status = 'under';

  return {
    totalSeconds: Number(totalSeconds.toFixed(1)),
    totalFrames,
    targetSeconds,
    targetFrames,
    diffSeconds,
    status,
  };
}

export function formatTimecode(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const tenths = Math.floor((seconds % 1) * 10);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${tenths}`;
}

export function formatFrame(frame: number): string {
  return `F${frame.toString().padStart(3, '0')}`;
}
