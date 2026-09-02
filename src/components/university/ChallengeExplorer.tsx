import React, { useState } from 'react';
import { Challenge, IdeaProposal } from '../../types';
import { storageService } from '../../services/storageService';
import { IdeaSubmissionModal } from './IdeaSubmissionModal';
import { useAccessibility } from '../../context/AccessibilityContext';
import { 
  Target, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Lightbulb, 
  ExternalLink, 
  Search, 
  Filter, 
  Sparkles,
  Layers,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface ChallengeExplorerProps {
  onIdeaSubmitted?: (idea: IdeaProposal) => void;
  onSelectChallengeForProject?: (challengeId: string) => void;
}

export const ChallengeExplorer: React.FC<ChallengeExplorerProps> = ({
  onIdeaSubmitted,
  onSelectChallengeForProject,
}) => {
  const [challenges, setChallenges] = useState<Challenge[]>(() => storageService.getChallenges());
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useAccessibility();

  const filteredChallenges = challenges.filter(c => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.district.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeFilter === 'ranchi') return matchesSearch && c.district.toLowerCase().includes('ranchi');
    if (activeFilter === 'funding') return matchesSearch && c.supportStatus === 'Confirmed Funding';
    if (activeFilter === 'support') return matchesSearch && c.supportStatus === 'Support Available';
    return matchesSearch;
  });

  const handleOpenSubmit = (c: Challenge) => {
    setSelectedChallenge(c);
    setIsSubmitModalOpen(true);
  };

  const handleIdeaCreated = (newIdea: IdeaProposal) => {
    setChallenges(storageService.getChallenges());
    if (onIdeaSubmitted) onIdeaSubmitted(newIdea);
  };

  const getSupportBadgeStyle = (status: string) => {
    switch (status) {
      case 'Confirmed Funding':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Support Available':
        return 'bg-blue-100 text-gov-blue border-blue-300';
      case 'Not Allocated':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="space-y-5">
      {/* Header & Filter Bar */}
      <div className="bg-white p-4 rounded-lg border border-gov-border shadow-gov space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-gov-saffron" />
              <h2 className="text-lg font-bold text-gov-navy">
                {t('Open GovTech Challenges (Statewide Challenge Pool)', 'खुली राज्यस्तरीय चुनौतियाँ')}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {t(
                'Verified civic problems converted into research & development challenges for university teams.',
                'नागरिक समस्याओं से उत्पन्न सत्यापित चुनौतियां। विकास से पूर्व प्रस्ताव जमा करें।'
              )}
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder={t('Search challenges...', 'चुनौतियाँ खोजें...')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:border-gov-blue"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 text-xs rounded border transition ${
              activeFilter === 'all'
                ? 'bg-gov-navy text-white border-gov-navy font-bold'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {t('All Challenges', 'सभी चुनौतियाँ')}
          </button>
          <button
            onClick={() => setActiveFilter('ranchi')}
            className={`px-3 py-1 text-xs rounded border transition ${
              activeFilter === 'ranchi'
                ? 'bg-gov-navy text-white border-gov-navy font-bold'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Ranchi District
          </button>
          <button
            onClick={() => setActiveFilter('funding')}
            className={`px-3 py-1 text-xs rounded border transition ${
              activeFilter === 'funding'
                ? 'bg-gov-navy text-white border-gov-navy font-bold'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Confirmed Funding
          </button>
          <button
            onClick={() => setActiveFilter('support')}
            className={`px-3 py-1 text-xs rounded border transition ${
              activeFilter === 'support'
                ? 'bg-gov-navy text-white border-gov-navy font-bold'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            Support Available
          </button>
        </div>
      </div>

      {/* Challenge Cards Grid */}
      <div className="space-y-4">
        {filteredChallenges.map(challenge => (
          <div
            key={challenge.id}
            className="bg-white rounded-lg border-2 border-gov-border hover:border-slate-400 shadow-gov p-5 space-y-4 transition"
          >
            {/* Top Meta */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold bg-gov-blue-50 text-gov-blue px-2.5 py-0.5 rounded border border-gov-border">
                  {challenge.id}
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  {challenge.domain}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {/* Support Status Tag */}
                <span className={`text-xs px-2.5 py-0.5 rounded-full border font-bold ${getSupportBadgeStyle(challenge.supportStatus)}`}>
                  {challenge.supportStatus}
                </span>

                <span className="text-xs text-slate-500 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Deadline: {challenge.deadline}</span>
                </span>
              </div>
            </div>

            {/* Title & Summary */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-base sm:text-lg font-bold text-gov-navy">
                  {challenge.title}
                </h3>
                <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono flex-shrink-0">
                  {challenge.district}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {challenge.summary}
              </p>
            </div>

            {/* Expected Outcomes & Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-slate-50 rounded border border-slate-200 text-xs">
              <div>
                <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider block mb-1">
                  Key Deliverable Outcomes:
                </span>
                <ul className="space-y-1 text-slate-600">
                  {challenge.expectedOutcomes.slice(0, 2).map((outcome, idx) => (
                    <li key={idx} className="flex items-start space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-gov-green flex-shrink-0 mt-0.5" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider block mb-1">
                  Required Disciplines & Skills:
                </span>
                <div className="flex flex-wrap gap-1">
                  {challenge.skillsRequired.map(s => (
                    <span key={s} className="px-2 py-0.5 bg-white border border-slate-300 rounded text-[10px] font-semibold text-slate-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Pilot Opportunity */}
            <div className="text-xs text-slate-600 flex items-center space-x-2">
              <span className="font-bold text-gov-navy">Pilot Opportunity:</span>
              <span>{challenge.pilotOpportunity}</span>
            </div>

            {/* Actions Bar */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs text-slate-500 font-medium">
                Proposals Submitted: <span className="font-bold text-gov-navy">{challenge.proposalsCount} University Teams</span>
              </div>

              <div className="flex items-center space-x-2">
                {challenge.selectedIdeaId && onSelectChallengeForProject && (
                  <button
                    onClick={() => onSelectChallengeForProject(challenge.id)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center space-x-1"
                  >
                    <span>View Shared Pilot Workspace</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={() => handleOpenSubmit(challenge)}
                  className="px-4 py-1.5 bg-gov-navy hover:bg-gov-navy-dark text-white rounded text-xs font-bold flex items-center space-x-1.5 shadow-sm transition"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-gov-saffron-amber" />
                  <span>{t('Submit Idea-First Proposal', 'प्रस्ताव जमा करें')}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Idea Submission Modal */}
      {selectedChallenge && (
        <IdeaSubmissionModal
          challenge={selectedChallenge}
          isOpen={isSubmitModalOpen}
          onClose={() => setIsSubmitModalOpen(false)}
          onSubmitted={handleIdeaCreated}
        />
      )}
    </div>
  );
};
