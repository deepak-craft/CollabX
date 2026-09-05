import React, { useState } from 'react';
import { Users, UserPlus, GraduationCap, ShieldCheck, Check, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';

interface TeamMember {
  id: string;
  name: string;
  discipline: string;
  specialization: string;
  role: string;
  email: string;
  isConfirmed: boolean;
}

export const TeamBuilder: React.FC = () => {
  const { currentUser } = useAuth();
  const { t } = useAccessibility();

  const [teamName, setTeamName] = useState('Team JalRakshak');
  const [mentorName, setMentorName] = useState('Dr. Ramesh Verma (Head, Water Resources, BIT Mesra)');
  const [mentorApproved, setMentorApproved] = useState(true);

  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: 'm-1',
      name: 'Amit Kumar',
      discipline: 'Civil & Environmental Engineering',
      specialization: 'Hydraulic Modeling & Siphon Dynamics',
      role: 'Student Lead & Drainage Design',
      email: 'amit.k.ug21@bitmesra.ac.in',
      isConfirmed: true,
    },
    {
      id: 'm-2',
      name: 'Sneha Roy',
      discipline: 'Electronics & Communication Engineering',
      specialization: 'IP68 Ultrasonic Sensors & LoRaWAN Gateway',
      role: 'Hardware & Edge Sensor Lead',
      email: 'sneha.r.ug21@bitmesra.ac.in',
      isConfirmed: true,
    },
    {
      id: 'm-3',
      name: 'Vikas Tudu',
      discipline: 'Computer Science & Engineering',
      specialization: 'Edge AI Telemetry & Municipal Dashboard Integration',
      role: 'Software & Telemetry Lead',
      email: 'vikas.t.ug21@bitmesra.ac.in',
      isConfirmed: true,
    }
  ]);

  const [newMemberName, setNewMemberName] = useState('');
  const [newDiscipline, setNewDiscipline] = useState('Mechanical Engineering');
  const [newRole, setNewRole] = useState('Rapid Prototyping & Flow Testing');
  const [newEmail, setNewEmail] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const newM: TeamMember = {
      id: `m-${Date.now()}`,
      name: newMemberName,
      discipline: newDiscipline,
      specialization: newRole,
      role: newRole,
      email: newEmail || `${newMemberName.toLowerCase().replace(' ', '.')}@bitmesra.ac.in`,
      isConfirmed: true,
    };

    setMembers([...members, newM]);
    setNewMemberName('');
    setNewEmail('');
    setIsAdding(false);
  };

  const handleRemoveMember = (id: string) => {
    if (members.length <= 1) return;
    setMembers(members.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header & Mentor Status */}
      <div className="bg-white p-5 rounded-lg border border-gov-border shadow-gov space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-bold text-gov-blue uppercase tracking-wider">
              Multidisciplinary GovTech Squad
            </span>
            <h2 className="text-xl font-bold text-gov-navy flex items-center space-x-2">
              <Users className="w-5 h-5 text-gov-saffron" />
              <span>{teamName}</span>
            </h2>
            <p className="text-xs text-slate-500">
              Birla Institute of Technology (BIT) Mesra • Ranchi, Jharkhand
            </p>
          </div>

          {/* Mentor Approval Badge */}
          <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center space-x-2 text-xs text-emerald-900">
            <ShieldCheck className="w-5 h-5 text-gov-green flex-shrink-0" />
            <div>
              <div className="font-bold flex items-center space-x-1">
                <span>Faculty Mentor Endorsed</span>
                <Check className="w-3.5 h-3.5 text-gov-green" />
              </div>
              <div className="text-[11px] text-emerald-700">{mentorName}</div>
            </div>
          </div>
        </div>

        {/* Interdisciplinary Matrix Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-blue-50/60 rounded border border-blue-200">
            <span className="text-[10px] uppercase font-bold text-gov-blue">Civil & Hydrology</span>
            <div className="text-xs font-bold text-slate-900 mt-1">Drainage & Siphon Dynamics</div>
            <div className="text-[11px] text-slate-600 mt-0.5">Amit Kumar (Lead)</div>
          </div>

          <div className="p-3 bg-purple-50/60 rounded border border-purple-200">
            <span className="text-[10px] uppercase font-bold text-purple-700">ECE (Sensors & IoT)</span>
            <div className="text-xs font-bold text-slate-900 mt-1">IP68 Ultrasonic Telemetry</div>
            <div className="text-[11px] text-slate-600 mt-0.5">Sneha Roy</div>
          </div>

          <div className="p-3 bg-emerald-50/60 rounded border border-emerald-200">
            <span className="text-[10px] uppercase font-bold text-emerald-700">CSE (Software & AI)</span>
            <div className="text-xs font-bold text-slate-900 mt-1">RMC Control Room Integration</div>
            <div className="text-[11px] text-slate-600 mt-0.5">Vikas Tudu</div>
          </div>
        </div>
      </div>

      {/* Team Members List */}
      <div className="bg-white rounded-lg border border-gov-border shadow-gov p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-gov-navy flex items-center space-x-2">
            <GraduationCap className="w-4 h-4 text-gov-blue" />
            <span>Team Roster ({members.length} Multidisciplinary Innovators)</span>
          </h3>

          <button
            onClick={() => setIsAdding(prev => !prev)}
            className="px-3 py-1.5 bg-gov-navy hover:bg-gov-navy-dark text-white rounded text-xs font-bold flex items-center space-x-1 shadow-sm transition"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{isAdding ? 'Close' : 'Invite Member'}</span>
          </button>
        </div>

        {/* Add Member Form */}
        {isAdding && (
          <form onSubmit={handleAddMember} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
            <div className="text-xs font-bold text-slate-800">Add Cross-Department Teammate</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pooja Hansda"
                  value={newMemberName}
                  onChange={e => setNewMemberName(e.target.value)}
                  className="w-full p-2 text-xs border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Department / Discipline</label>
                <select
                  value={newDiscipline}
                  onChange={e => setNewDiscipline(e.target.value)}
                  className="w-full p-2 text-xs border border-slate-300 rounded"
                >
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Chemical & Material Engg">Chemical & Material Engg</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Architecture & Planning">Architecture & Planning</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Project Role / Specialization</label>
              <input
                type="text"
                required
                value={newRole}
                onChange={e => setNewRole(e.target.value)}
                className="w-full p-2 text-xs border border-slate-300 rounded"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs bg-gov-navy text-white font-bold rounded"
              >
                Confirm & Add
              </button>
            </div>
          </form>
        )}

        {/* Member Cards */}
        <div className="divide-y divide-slate-100">
          {members.map(member => (
            <div key={member.id} className="py-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gov-navy text-white flex items-center justify-center font-bold text-xs">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                    <span>{member.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 text-gov-blue font-semibold border border-blue-100">
                      {member.discipline}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                    {member.role} • <span className="font-mono text-[10px]">{member.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded flex items-center space-x-1">
                  <Check className="w-3 h-3 text-emerald-700" />
                  <span>Enrolled</span>
                </span>

                {members.length > 1 && (
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded"
                    title="Remove member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
