import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { ChallengeExplorer } from './ChallengeExplorer';
import { TeamBuilder } from './TeamBuilder';
import { ProfessorMentorView } from './ProfessorMentorView';
import { SharedWorkspace } from '../project/SharedWorkspace';
import { LinkCollab } from '../community/LinkCollab';
import { storageService } from '../../services/storageService';
import { 
  GraduationCap, 
  Target, 
  Lightbulb, 
  Users, 
  Layers, 
  MessageSquare, 
  Award,
  Sparkles,
  ArrowRight
} from 'lucide-react';

import { useLocation, useNavigate } from 'react-router-dom';

interface UniversityPortalProps {
  initialTab?: string;
}

export const UniversityPortal: React.FC<UniversityPortalProps> = ({ initialTab = 'challenges' }) => {
  const { currentUser, loginAs } = useAuth();
  const { t } = useAccessibility();
  const location = useLocation();
  const navigate = useNavigate();

  const isProfessor = currentUser.role === 'professor';

  const getTabFromPath = () => {
    if (location.pathname.endsWith('/challenges')) return 'challenges';
    if (location.pathname.endsWith('/ideas')) return isProfessor ? 'mentor_ideas' : 'my_ideas';
    if (location.pathname.endsWith('/team')) return 'team';
    if (location.pathname.endsWith('/projects')) return 'project';
    if (location.pathname.endsWith('/link-collab')) return 'link_collab';
    return initialTab;
  };

  const [activeTab, setActiveTab] = useState<string>(getTabFromPath());

  React.useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname, initialTab]);

  const handleTabChange = (tab: string, path: string) => {
    setActiveTab(tab);
    navigate(path);
  };
  const [ideas] = useState(() => storageService.getIdeas());

  const handleSwitchSubRole = (subRole: 'Student' | 'Professor') => {
    if (subRole === 'Student') {
      loginAs('student', 'Student');
    } else {
      loginAs('professor', 'Professor');
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-Role Toggle Header & Navigation Bar */}
      <div className="bg-white rounded-lg border border-gov-border shadow-gov p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded bg-blue-100 text-gov-blue flex items-center justify-center font-bold">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gov-navy">
              {isProfessor ? 'University Faculty & Mentor Portal' : 'Student Innovation & R&D Portal'}
            </h2>
            <p className="text-xs text-slate-500">
              {currentUser.name} • {currentUser.organization}
            </p>
          </div>
        </div>

        {/* Quick Sub-Role Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => handleSwitchSubRole('Student')}
            className={`px-3 py-1.5 rounded font-bold transition ${
              !isProfessor
                ? 'bg-gov-navy text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Student Persona
          </button>
          <button
            onClick={() => handleSwitchSubRole('Professor')}
            className={`px-3 py-1.5 rounded font-bold transition ${
              isProfessor
                ? 'bg-gov-navy text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Professor Persona
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gov-border shadow-gov p-1.5 flex flex-wrap gap-1">
        <button
          onClick={() => handleTabChange('challenges', '/university/challenges')}
          className={`py-2 px-3 sm:px-4 rounded text-xs font-bold flex items-center space-x-2 transition ${
            activeTab === 'challenges'
              ? 'bg-gov-navy text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>{t('Challenges', 'चुनौतियां')}</span>
        </button>

        {isProfessor ? (
          <button
            onClick={() => handleTabChange('proposals', '/university/ideas')}
            className={`py-2 px-3 sm:px-4 rounded text-xs font-bold flex items-center space-x-2 transition ${
              activeTab === 'proposals'
                ? 'bg-gov-navy text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span>{t('Review Proposals', 'प्रस्ताव समीक्षा')}</span>
          </button>
        ) : (
          <button
            onClick={() => handleTabChange('my_ideas', '/university/ideas')}
            className={`py-2 px-3 sm:px-4 rounded text-xs font-bold flex items-center space-x-2 transition ${
              activeTab === 'my_ideas'
                ? 'bg-gov-navy text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span>{t('My Ideas & AI Scores', 'मेरे विचार एवं स्कोर')}</span>
            <span className="ml-1 px-1.5 py-0.2 bg-gov-saffron text-white rounded-full text-[10px]">
              {ideas.length}
            </span>
          </button>
        )}

        <button
          onClick={() => handleTabChange('team', '/university/team')}
          className={`py-2 px-3 sm:px-4 rounded text-xs font-bold flex items-center space-x-2 transition ${
            activeTab === 'team'
              ? 'bg-gov-navy text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{t('Team Builder', 'टीम बिल्डर')}</span>
        </button>

        <button
          onClick={() => handleTabChange('project', '/university/projects')}
          className={`py-2 px-3 sm:px-4 rounded text-xs font-bold flex items-center space-x-2 transition ${
            activeTab === 'project'
              ? 'bg-gov-navy text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{t('Active Pilot Workspace', 'सक्रिय पायलट कार्यक्षेत्र')}</span>
        </button>

        <button
          onClick={() => handleTabChange('link_collab', '/university/link-collab')}
          className={`py-2 px-3 sm:px-4 rounded text-xs font-bold flex items-center space-x-2 transition ${
            activeTab === 'link_collab'
              ? 'bg-gov-navy text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{t('Link Collab Advisory', 'लिंक कोलैब संवाद')}</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'challenges' && (
        <ChallengeExplorer
          onSelectChallengeForProject={() => setActiveTab('project')}
        />
      )}

      {activeTab === 'my_ideas' && !isProfessor && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-gov-border shadow-gov">
            <h3 className="text-base font-bold text-gov-navy">
              Submitted Idea-First Proposals ({ideas.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review your submitted proposals, simulated AI scores, and Domain Expert decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ideas.map(idea => (
              <div
                key={idea.id}
                className="bg-white rounded-lg border-2 border-slate-200 hover:border-gov-blue shadow-gov p-5 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-500 font-bold">{idea.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                        idea.status === 'selected'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-gov-blue'
                      }`}
                    >
                      {idea.status === 'selected' ? 'Selected for Pilot ✓' : 'Under Expert Review'}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-gov-navy">{idea.title}</h4>
                  <div className="text-xs text-slate-500 font-medium">
                    {idea.university} • {idea.teamName}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {idea.proposedSolution}
                  </p>

                  {/* AI Recommendation Badge */}
                  <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700 flex items-center space-x-1">
                        <Sparkles className="w-3.5 h-3.5 text-gov-saffron" />
                        <span>AI Recommendation Score:</span>
                      </span>
                      <span className="font-bold text-gov-navy font-mono text-sm">
                        {idea.aiScores.compositeScore} / 100
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 italic">
                      Feasibility: {idea.aiScores.feasibility}% | Impact: {idea.aiScores.socialImpact}% | Cost Efficacy: {idea.aiScores.costEfficiency}%
                    </div>
                  </div>

                  {/* Expert Evaluation if selected */}
                  {idea.expertScoreTotal && (
                    <div className="p-3 bg-emerald-50 rounded border border-emerald-200 space-y-1">
                      <div className="flex items-center justify-between text-xs text-emerald-950 font-bold">
                        <span>Final Expert Decision Score:</span>
                        <span>{idea.expertScoreTotal} / 100</span>
                      </div>
                      <p className="text-[11px] text-emerald-800 italic">
                        "{idea.expertRemarks}"
                      </p>
                      <div className="text-[10px] text-slate-500 text-right font-medium">
                        — Evaluated by {idea.expertEvaluatorName}
                      </div>
                    </div>
                  )}
                </div>

                {idea.status === 'selected' && (
                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setActiveTab('project')}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center justify-center space-x-1 transition shadow-sm"
                    >
                      <span>Open Live Pilot Workspace →</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'proposals' && isProfessor && (
        <ProfessorMentorView />
      )}

      {activeTab === 'team' && (
        <TeamBuilder />
      )}

      {activeTab === 'project' && (
        <SharedWorkspace />
      )}

      {activeTab === 'link_collab' && (
        <LinkCollab />
      )}
    </div>
  );
};
