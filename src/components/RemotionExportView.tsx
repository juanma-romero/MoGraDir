import React, { useState } from 'react';
import { Project } from '../types';
import {
  generateRemotionCode,
  generateRemotionAIAgentPrompt,
  generateMarkdownSpecSheet,
  getResolutionForAspectRatio,
} from '../utils/remotionGenerators';
import { calculateProjectTiming } from '../utils/storage';
import {
  Bot,
  Code2,
  FileText,
  Copy,
  Check,
  Download,
  Upload,
  Printer,
  Sparkles,
  Terminal,
  ExternalLink,
} from 'lucide-react';

interface RemotionExportViewProps {
  project: Project;
  onImportProject: (imported: Project) => void;
}

export const RemotionExportView: React.FC<RemotionExportViewProps> = ({
  project,
  onImportProject,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'prompt' | 'code' | 'spec' | 'json'>('prompt');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const timing = calculateProjectTiming(project);
  const resolution = getResolutionForAspectRatio(project.aspectRatio);

  const agentPrompt = generateRemotionAIAgentPrompt(project);
  const remotionCode = generateRemotionCode(project);
  const specSheetMarkdown = generateMarkdownSpecSheet(project);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute(
      'download',
      `kinetix_${project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}_backup.json`
    );
    dlAnchorElem.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.scenes && Array.isArray(parsed.scenes)) {
          onImportProject(parsed);
          alert('Proyecto importado exitosamente.');
        } else {
          alert('El archivo no parece ser un proyecto válido de Kinetix.');
        }
      } catch (err) {
        console.error(err);
        alert('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight flex items-center gap-3">
            <span>4. Remotion Hub & Exportación</span>
            <span className="text-xs font-mono font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800/60 px-2 py-0.5 rounded-full">
              AI Agent Ready
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Configurado especialmente para pasarle las especificaciones a tu agente de IA y generar código Remotion en React.
          </p>
        </div>

        {/* Quick Specs Summary Chip */}
        <div className="bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl text-xs font-mono flex items-center gap-2 tabular-nums">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-300">{resolution.width}x{resolution.height}</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-300">{project.fps} FPS</span>
          <span className="text-slate-600">·</span>
          <span className="text-cyan-400 font-bold">{timing.totalFrames} frames</span>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => setActiveSubTab('prompt')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'prompt'
                ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-cyan-200" />
            <span>Prompt para Agente IA</span>
          </button>

          <button
            onClick={() => setActiveSubTab('code')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'code'
                ? 'bg-slate-800 text-cyan-300 border border-cyan-700/50 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Código Base Remotion (TSX)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('spec')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'spec'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Ficha Técnica (Spec Sheet)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('json')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'json'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Respaldo JSON</span>
          </button>
        </div>

        {/* Global Action on active sub-tab */}
        <div>
          {activeSubTab === 'prompt' && (
            <button
              onClick={() => handleCopy(agentPrompt, 'prompt')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold shadow-md shadow-cyan-600/20 transition-all cursor-pointer"
            >
              {copiedKey === 'prompt' ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'prompt' ? '¡Prompt Copiado!' : 'Copiar Prompt para Agente'}</span>
            </button>
          )}

          {activeSubTab === 'code' && (
            <button
              onClick={() => handleCopy(remotionCode, 'code')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-bold shadow-md shadow-violet-600/20 transition-all cursor-pointer"
            >
              {copiedKey === 'code' ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'code' ? '¡Código Copiado!' : 'Copiar Código TSX'}</span>
            </button>
          )}

          {activeSubTab === 'spec' && (
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir / PDF</span>
              </button>
              <button
                onClick={() => handleCopy(specSheetMarkdown, 'spec')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                {copiedKey === 'spec' ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'spec' ? 'Copiado' : 'Copiar Markdown'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tab 1: AI Agent Prompt View */}
      {activeSubTab === 'prompt' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-violet-950/60 to-cyan-950/40 border border-violet-800/40 rounded-2xl p-5 text-xs text-slate-300 leading-relaxed space-y-2">
            <div className="flex items-center gap-2 text-cyan-300 font-bold font-mono text-sm">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Instrucciones para usar con tu Agente de IA</span>
            </div>
            <p>
              Copia este prompt y pégalo directamente en tu agente de programación (Cursor, Claude, Gemini, Windsurf, etc.). Contiene la arquitectura completa de frames para que el agente escriba los componentes de Remotion con animación exacta de resortes (<code className="text-cyan-300 font-mono">spring</code>), cálculo de duraciones y sincronización de locución.
            </p>
          </div>

          <div className="relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>prompt_remotion_agent.md</span>
              <span>{agentPrompt.split('\n').length} líneas</span>
            </div>
            <pre className="p-5 text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre leading-relaxed max-h-[550px]">
              {agentPrompt}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 2: Remotion TypeScript Code View */}
      {activeSubTab === 'code' && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 text-xs text-slate-300 leading-relaxed space-y-2">
            <div className="flex items-center gap-2 text-violet-300 font-bold font-mono text-sm">
              <Code2 className="w-4 h-4 text-violet-400" />
              <span>Código Base para tu Proyecto Remotion</span>
            </div>
            <p>
              Este archivo define la <code className="text-violet-300 font-mono">&lt;Composition&gt;</code> principal y cada <code className="text-violet-300 font-mono">&lt;Sequence&gt;</code> calculada frame por frame. Pégalo en tu carpeta <code className="text-slate-400 font-mono">src/Root.tsx</code> o en un nuevo archivo de composición en tu proyecto Remotion.
            </p>
          </div>

          <div className="relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Root.tsx</span>
              <span>TypeScript + Remotion + Tailwind</span>
            </div>
            <pre className="p-5 text-xs font-mono text-emerald-300/90 overflow-x-auto whitespace-pre leading-relaxed max-h-[550px]">
              {remotionCode}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 3: Spec Sheet View */}
      {activeSubTab === 'spec' && (
        <div className="space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 print:bg-white print:text-black">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-display font-extrabold text-white print:text-black">
                {project.title}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono mt-1 print:text-gray-700">
                <span>Cliente: {project.clientOrBrand || 'N/A'}</span>
                <span>·</span>
                <span>Aspecto: {project.aspectRatio} ({resolution.width}x{resolution.height})</span>
                <span>·</span>
                <span>FPS: {project.fps}</span>
                <span>·</span>
                <span>Duración: {timing.totalSeconds}s ({timing.totalFrames} frames)</span>
              </div>
            </div>

            {project.hook03s && (
              <div className="bg-slate-900/60 print:bg-gray-100 p-4 rounded-xl border border-slate-800 print:border-gray-300 space-y-1">
                <span className="text-xs font-mono font-bold text-violet-400 print:text-violet-700 uppercase">
                  Gancho de Retención (0-3 Segundos)
                </span>
                <p className="text-xs text-slate-200 print:text-gray-800 leading-relaxed">
                  {project.hook03s}
                </p>
              </div>
            )}

            {/* Scenes Spec Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                    <th className="py-2 px-2">#</th>
                    <th className="py-2 px-2">Escena</th>
                    <th className="py-2 px-2">Timecode & Frames</th>
                    <th className="py-2 px-2">Locución / Copy</th>
                    <th className="py-2 px-2">Acción Visual</th>
                    <th className="py-2 px-2">SFX</th>
                    <th className="py-2 px-2">Transición</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300 print:text-gray-900">
                  {project.scenes.map((s, i) => (
                    <tr key={s.id} className="hover:bg-slate-900/40">
                      <td className="py-3 px-2 font-mono font-bold text-violet-400">{i + 1}</td>
                      <td className="py-3 px-2 font-semibold text-white print:text-black">{s.title}</td>
                      <td className="py-3 px-2 font-mono text-[11px] tabular-nums whitespace-nowrap">
                        {s.durationSeconds}s
                      </td>
                      <td className="py-3 px-2 max-w-xs leading-relaxed">{s.audioVoiceover || '-'}</td>
                      <td className="py-3 px-2 max-w-xs leading-relaxed text-slate-400 print:text-gray-700">
                        {s.visualAction}
                      </td>
                      <td className="py-3 px-2 text-slate-400 text-[11px] whitespace-nowrap">{s.sfxMusic || '-'}</td>
                      <td className="py-3 px-2 font-mono text-[11px] text-cyan-400">{s.transitionOut}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Backup JSON View */}
      {activeSubTab === 'json' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div>
            <h2 className="text-base font-display font-bold text-white tracking-tight">
              Exportar e Importar Proyecto
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Guarda tus guiones, cronogramas y especificaciones en un archivo JSON para respaldar tu trabajo o compartirlo con tu equipo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                Exportar Respaldo
              </span>
              <p className="text-xs text-slate-400">
                Descarga un archivo JSON con toda la información del proyecto activo.
              </p>
              <button
                onClick={handleDownloadJson}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Descargar Archivo JSON</span>
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
              <span className="text-xs font-mono font-bold text-violet-400 uppercase">
                Importar Proyecto
              </span>
              <p className="text-xs text-slate-400">
                Carga un archivo JSON de respaldo para abrirlo en Kinetix Studio.
              </p>
              <label className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer">
                <Upload className="w-4 h-4 text-violet-400" />
                <span>Subir Archivo JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
