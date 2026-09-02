import React, { useState } from 'react';
import { Project, ProjectTask, ProjectMilestone } from '../../types';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { 
  Layers, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  FileText, 
  Users, 
  Building, 
  Activity, 
  Plus, 
  Check, 
  Download, 
  Send,
  Droplets,
  Award,
  Sparkles,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const SharedWorkspace: React.FC = () => {
  const { currentUser } = useAuth();
  const { t } = useAccessibility();

  const [project, setProject] = useState<Project>(() => storageService.getProjects()[0]);
  const [activeSection, setActiveSection] = useState<'overview' | 'milestones' | 'tasks' | 'testing' | 'docs'>('overview');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);

  // Toggle task status
  const handleToggleTask = (taskId: string) => {
    const updatedTasks = project.tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: (t.status === 'done' ? 'todo' : 'done') as 'todo' | 'done',
        };
      }
      return t;
    });

    const updatedProject = { ...project, tasks: updatedTasks };
    project.tasks = updatedTasks;
    storageService.saveProject(updatedProject);
    setProject({ ...updatedProject });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: ProjectTask = {
      id: `t-${Date.now()}`,
      title: newTaskTitle,
      assignee: currentUser.name,
      role: currentUser.subRole || currentUser.role,
      status: 'in_progress',
      priority: 'high',
    };

    const updatedProject = {
      ...project,
      tasks: [...project.tasks, newTask],
    };
    storageService.saveProject(updatedProject);
    setProject(updatedProject);
    setNewTaskTitle('');
    setIsAddingTask(false);
  };

  return (
    <div className="space-y-6">
      {/* Workspace Header */}
      <div className="bg-white rounded-lg border-2 border-slate-300 shadow-gov p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold bg-gov-blue text-white px-2 py-0.5 rounded">
                {project.id}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                Phase: Active Pilot Deployment
              </span>
            </div>
            <h2 className="text-xl font-bold text-gov-navy mt-1">{project.title}</h2>
            <p className="text-xs text-slate-500">
              Harmu Bypass Section #4, Ranchi Municipal Ward 14
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="px-3 py-1 bg-slate-100 rounded border font-medium text-slate-700">
              Industry Support: <span className="font-bold text-emerald-700">{project.industrySupportStatus}</span>
            </span>
          </div>
        </div>

        {/* Tri-Partite Stakeholder Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-blue-50/60 rounded border border-blue-200">
            <span className="text-[10px] uppercase font-bold text-gov-blue">University Innovator</span>
            <div className="font-bold text-slate-900 mt-0.5">{project.teamName}</div>
            <div className="text-[11px] text-slate-600">{project.university}</div>
          </div>

          <div className="p-3 bg-amber-50/60 rounded border border-amber-200">
            <span className="text-[10px] uppercase font-bold text-gov-saffron">Industry Sponsor</span>
            <div className="font-bold text-slate-900 mt-0.5">{project.industryPartnerName}</div>
            <div className="text-[11px] text-slate-600">Sensors & Hardware Material Allocation</div>
          </div>

          <div className="p-3 bg-emerald-50/60 rounded border border-emerald-200">
            <span className="text-[10px] uppercase font-bold text-gov-green">Govt Nodal Authority</span>
            <div className="font-bold text-slate-900 mt-0.5">{project.nodalOfficerName}</div>
            <div className="text-[11px] text-slate-600">Ranchi Municipal Corporation Liaison</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg border border-gov-border shadow-gov p-1 flex flex-wrap gap-1">
        <button
          onClick={() => setActiveSection('overview')}
          className={`py-2 px-4 rounded text-xs font-bold transition ${
            activeSection === 'overview' ? 'bg-gov-navy text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Overview & Telemetry
        </button>
        <button
          onClick={() => setActiveSection('milestones')}
          className={`py-2 px-4 rounded text-xs font-bold transition ${
            activeSection === 'milestones' ? 'bg-gov-navy text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Milestones ({project.milestones.filter(m => m.status === 'completed').length}/{project.milestones.length})
        </button>
        <button
          onClick={() => setActiveSection('tasks')}
          className={`py-2 px-4 rounded text-xs font-bold transition ${
            activeSection === 'tasks' ? 'bg-gov-navy text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Collaborative Tasks ({project.tasks.length})
        </button>
        <button
          onClick={() => setActiveSection('testing')}
          className={`py-2 px-4 rounded text-xs font-bold transition ${
            activeSection === 'testing' ? 'bg-gov-navy text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          On-Site Testing & Telemetry Log
        </button>
        <button
          onClick={() => setActiveSection('docs')}
          className={`py-2 px-4 rounded text-xs font-bold transition ${
            activeSection === 'docs' ? 'bg-gov-navy text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Blueprints & Documents ({project.documents.length})
        </button>
      </div>

      {/* SECTION 1: OVERVIEW & TELEMETRY */}
      {activeSection === 'overview' && (
        <div className="space-y-4">
          {/* Key Pilot Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gov-border shadow-gov">
              <span className="text-[10px] uppercase font-bold text-slate-500">Waterlogging Duration</span>
              <div className="text-xl font-bold text-gov-navy mt-1">
                8.0h <span className="text-slate-400 font-normal">→</span>{' '}
                <span className="text-gov-green font-black">1.5 Hours</span>
              </div>
              <span className="text-[11px] font-bold text-gov-green mt-0.5 block">
                ↓ 81.25% Inundation Reduction
              </span>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gov-border shadow-gov">
              <span className="text-[10px] uppercase font-bold text-slate-500">Peak Water Depth</span>
              <div className="text-xl font-bold text-gov-navy mt-1">
                65cm <span className="text-slate-400 font-normal">→</span>{' '}
                <span className="text-gov-green font-black">12 cm</span>
              </div>
              <span className="text-[11px] font-bold text-gov-green mt-0.5 block">
                ↓ 81.5% Depth Reduction
              </span>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gov-border shadow-gov">
              <span className="text-[10px] uppercase font-bold text-slate-500">Ranchi Beneficiaries</span>
              <div className="text-xl font-bold text-gov-navy mt-1 font-mono">45,200+</div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                Harmu Ward 14 residents + school transit
              </span>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gov-border shadow-gov">
              <span className="text-[10px] uppercase font-bold text-slate-500">Field Prototype Status</span>
              <div className="text-lg font-bold text-emerald-700 mt-1 flex items-center space-x-1">
                <CheckCircle2 className="w-5 h-5 text-gov-green" />
                <span>Operational</span>
              </div>
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                4 Siphon check valves primed
              </span>
            </div>
          </div>

          {/* Siphon Architecture Diagram / Explanation */}
          <div className="bg-white rounded-lg border border-gov-border shadow-gov p-5 space-y-3">
            <h3 className="text-sm font-bold text-gov-navy flex items-center space-x-2">
              <Droplets className="w-4 h-4 text-gov-blue" />
              <span>Hydraulic Siphon Architecture & Sensor Placement</span>
            </h3>

            <div className="p-4 bg-slate-50 rounded border border-slate-200 text-xs leading-relaxed space-y-2 text-slate-700">
              <p>
                <span className="font-bold text-gov-navy">1. Passive Priming:</span> High-velocity storm surge creates hydraulic head differential in the dual-chamber retention basin, automatically siphoning excess crest water without requiring grid electrical power.
              </p>
              <p>
                <span className="font-bold text-gov-navy">2. Ultrasonic Silt Monitoring:</span> IP68 ultrasonic depth transducers positioned at inlet sleeves transmit telemetry via LoRaWAN every 90 seconds to the Ranchi Municipal Control Room.
              </p>
              <p>
                <span className="font-bold text-gov-navy">3. Resident Feedback Alignment:</span> Ground validation confirms road passable even during peak monsoon downpours.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: MILESTONES */}
      {activeSection === 'milestones' && (
        <div className="bg-white rounded-lg border border-gov-border shadow-gov p-5 space-y-4">
          <h3 className="text-sm font-bold text-gov-navy">
            Project Phasing & Milestone Delivery Tracking
          </h3>

          <div className="space-y-3">
            {project.milestones.map((m, idx) => (
              <div
                key={m.id}
                className={`p-4 rounded-lg border text-xs flex flex-wrap items-center justify-between gap-3 ${
                  m.status === 'completed'
                    ? 'bg-emerald-50/50 border-emerald-300'
                    : m.status === 'in_progress'
                    ? 'bg-blue-50/50 border-gov-blue shadow-sm ring-1 ring-gov-blue'
                    : 'bg-slate-50 border-slate-200 opacity-75'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-[10px] text-slate-500 uppercase px-1.5 py-0.2 bg-white rounded border">
                      Phase {idx + 1}: {m.phase}
                    </span>
                    <span
                      className={`font-bold text-[10px] px-2 py-0.2 rounded ${
                        m.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : m.status === 'in_progress'
                          ? 'bg-blue-100 text-gov-blue'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {m.status.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{m.title}</h4>
                  <p className="text-slate-600">{m.description}</p>
                  <div className="text-[11px] text-slate-500">
                    Deliverable: <span className="font-semibold text-slate-700">{m.deliverable}</span>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="text-slate-500 block">Due Date: {m.dueDate}</span>
                  {m.completedAt && (
                    <span className="text-emerald-700 font-bold block">✓ Completed {m.completedAt}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: TASKS KANBAN / LIST */}
      {activeSection === 'tasks' && (
        <div className="bg-white rounded-lg border border-gov-border shadow-gov p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-gov-navy">Collaborative Execution Tasks</h3>
            <button
              onClick={() => setIsAddingTask(prev => !prev)}
              className="px-3 py-1.5 bg-gov-navy hover:bg-gov-navy-dark text-white rounded text-xs font-bold flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAddingTask ? 'Cancel' : 'Add Task'}</span>
            </button>
          </div>

          {isAddingTask && (
            <form onSubmit={handleAddTask} className="p-3 bg-slate-50 rounded border border-slate-200 flex gap-2">
              <input
                type="text"
                required
                placeholder="Task description..."
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                className="flex-1 p-2 text-xs border border-slate-300 rounded"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gov-navy text-white text-xs font-bold rounded hover:bg-gov-navy-dark"
              >
                Save Task
              </button>
            </form>
          )}

          <div className="divide-y divide-slate-100 text-xs">
            {project.tasks.map(task => (
              <div key={task.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleToggleTask(task.id)}
                    className={`w-5 h-5 rounded border flex items-center justify-center transition ${
                      task.status === 'done'
                        ? 'bg-gov-green border-gov-green text-white'
                        : 'border-slate-400 hover:border-gov-navy'
                    }`}
                  >
                    {task.status === 'done' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <div>
                    <div className={`font-bold ${task.status === 'done' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {task.title}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Assigned to: <span className="font-semibold text-slate-700">{task.assignee}</span> ({task.role})
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    task.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {task.priority} Priority
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: TESTING & TELEMETRY */}
      {activeSection === 'testing' && (
        <div className="bg-white rounded-lg border border-gov-border shadow-gov p-5 space-y-4 text-xs">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-gov-navy">Live On-Site Telemetry & Municipal Sensor Feeds</h3>
            <p className="text-slate-500 text-[11px]">Streamed from Harmu Bypass Siphon Sleeve #4 LoRa Node</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 text-[10px] font-bold uppercase">Culvert Water Level</span>
              <div className="text-lg font-bold text-gov-navy mt-1">11.4 cm</div>
              <span className="text-[10px] text-emerald-700 font-semibold">Normal (Baseline 65 cm)</span>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 text-[10px] font-bold uppercase">Siphon Flow Velocity</span>
              <div className="text-lg font-bold text-gov-navy mt-1">1,240 L/sec</div>
              <span className="text-[10px] text-emerald-700 font-semibold">Active Gravitational Evacuation</span>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 text-[10px] font-bold uppercase">Telemetry Health</span>
              <div className="text-lg font-bold text-gov-green mt-1">99.8% Uptime</div>
              <span className="text-[10px] text-slate-500">Solar Battery 13.8V</span>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: BLUEPRINTS & DOCS */}
      {activeSection === 'docs' && (
        <div className="bg-white rounded-lg border border-gov-border shadow-gov p-5 space-y-4">
          <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gov-navy">Technical Dossiers & Municipal NOCs</h3>
            <span className="text-xs text-slate-500">{project.documents.length} Files</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {project.documents.map(doc => (
              <div key={doc.id} className="py-3 flex items-center justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gov-blue" />
                  <div>
                    <div className="font-bold text-slate-800">{doc.name}</div>
                    <div className="text-[11px] text-slate-500">
                      {doc.type} • {doc.size} • Uploaded by {doc.uploadedBy} on {doc.date}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Simulating secure GovTech download of ${doc.name}`)}
                  className="px-3 py-1 text-xs border border-slate-300 rounded text-slate-700 hover:bg-slate-50 flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
