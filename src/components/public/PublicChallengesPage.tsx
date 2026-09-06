import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storageService } from '../../services/storageService';
import { Challenge } from '../../types';
import { useAccessibility } from '../../context/AccessibilityContext';
import { 
  Target, 
  Search, 
  MapPin, 
  Building2, 
  GraduationCap, 
  Briefcase, 
  ArrowLeft, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export const PublicChallengesPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { t } = useAccessibility();

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');

  useEffect(() => {
    const data = storageService.getChallenges();
    setChallenges(data);
  }, []);

  const selectedChallenge = id ? challenges.find(c => c.id === id) : null;

  const filteredChallenges = challenges.filter(c => {
    const matchesSearch = 
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.domain.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDomain = selectedDomain === 'All' || c.domain === selectedDomain;
    const matchesDistrict = selectedDistrict === 'All' || c.district === selectedDistrict;

    return matchesSearch && matchesDomain && matchesDistrict;
  });

  const domains = ['All', ...Array.from(new Set(challenges.map(c => c.domain)))];
  const districts = ['All', ...Array.from(new Set(challenges.map(c => c.district)))];

  // Detail view /challenges/:id
  if (id) {
    if (!selectedChallenge && challenges.length > 0) {
      return (
        <div className="py-12 px-4 max-w-3xl mx-auto text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
          <h2 className="text-xl font-bold text-slate-800">Challenge Not Found</h2>
          <p className="text-xs text-slate-500">The requested challenge ID does not exist or has been archived.</p>
          <button
            onClick={() => navigate('/challenges')}
            className="px-4 py-2 bg-gov-navy text-white text-xs font-bold rounded-md"
          >
            ← Return to Public Challenges
          </button>
        </div>
      );
    }

    if (selectedChallenge) {
      return (
        <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-6">
          <button
            onClick={() => navigate('/challenges')}
            className="inline-flex items-center text-xs font-bold text-gov-blue hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            {t('Back to Public Challenges Directory', 'सार्वजनिक चुनौतियों की निर्देशिका पर लौटें')}
          </button>

          <div className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-blue-50 text-gov-blue border border-blue-200">
                    {selectedChallenge.id}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold uppercase">
                    {selectedChallenge.domain}
                  </span>
                </div>
                <h1 className="text-2xl font-black text-gov-navy mt-1 tracking-tight">
                  {selectedChallenge.title}
                </h1>
                <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-gov-saffron" />
                  <span>{selectedChallenge.locality}, {selectedChallenge.district} District</span>
                </div>
              </div>

              <span className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold rounded">
                Verified Challenge
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {t('Problem Overview & Background', 'समस्या का विवरण और पृष्ठभूमि')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-md border border-slate-200">
                {selectedChallenge.summary}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-md border border-slate-200 space-y-2">
                <span className="font-bold text-gov-navy block">Expected Outcomes:</span>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  {selectedChallenge.expectedOutcomes.map((out, idx) => (
                    <li key={idx}>{out}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-md border border-slate-200 space-y-2">
                <span className="font-bold text-gov-navy block">Pilot Opportunity & Support:</span>
                <p className="text-slate-600 leading-relaxed">
                  {selectedChallenge.pilotOpportunity}
                </p>
                <p className="text-slate-500 text-[11px]">
                  Support: {selectedChallenge.supportStatus} — {selectedChallenge.supportDetails}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5 space-y-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {t('Who Can Contribute?', 'कौन योगदान दे सकता है?')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded border border-slate-200 bg-slate-50 flex items-center space-x-2 text-xs">
                  <GraduationCap className="w-4 h-4 text-gov-blue flex-shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800 block">Universities</span>
                    <span className="text-[10px] text-slate-500">Faculty & Students</span>
                  </div>
                </div>

                <div className="p-3 rounded border border-slate-200 bg-slate-50 flex items-center space-x-2 text-xs">
                  <Briefcase className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800 block">Industry</span>
                    <span className="text-[10px] text-slate-500">CSR & Technical Support</span>
                  </div>
                </div>

                <div className="p-3 rounded border border-slate-200 bg-slate-50 flex items-center space-x-2 text-xs">
                  <Building2 className="w-4 h-4 text-purple-700 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800 block">Experts</span>
                    <span className="text-[10px] text-slate-500">Domain Technical Review</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-100 p-5 rounded-lg border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-gov-navy">
                  {t('Ready to submit a proposal?', 'प्रस्ताव प्रस्तुत करने के लिए तैयार हैं?')}
                </h4>
                <p className="text-xs text-slate-500">
                  {t('Sign in to your university or industry account to submit ideas.', 'विचार जमा करने के लिए अपने विश्वविद्यालय या उद्योग खाते में साइन इन करें।')}
                </p>
              </div>

              <button
                onClick={() => navigate('/login')}
                className="px-5 py-2.5 bg-gov-navy hover:bg-slate-800 text-white font-bold text-xs rounded-md flex items-center space-x-2 shadow-xs transition focus:ring-2 focus:ring-gov-blue"
              >
                <span>{t('Sign in to Contribute', 'योगदान के लिए साइन इन करें')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  // Listing View `/challenges`
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-gov-blue mb-1">
          <Target className="w-4 h-4 text-gov-saffron" />
          <span>{t('Government of Jharkhand • Verified Challenges', 'झारखंड सरकार • सत्यापित चुनौतियाँ')}</span>
        </div>
        <h1 className="text-3xl font-black text-gov-navy font-sans tracking-tight">
          {t('Public Challenges Directory', 'सार्वजनिक चुनौतियाँ निर्देशिका')}
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          {t(
            'Explore verified public challenges identified by state departments and district administrations.',
            'राज्य विभागों और जिला प्रशासन द्वारा चिह्नित सत्यापित सार्वजनिक समस्याओं का अन्वेषण करें।'
          )}
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder={t('Search challenges by title, domain...', 'चुनौतियाँ खोजें...')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-gov-blue"
            />
          </div>

          <div>
            <select
              value={selectedDomain}
              onChange={e => setSelectedDomain(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-gov-blue bg-white"
            >
              <option value="All">All Domains</option>
              {domains.filter(d => d !== 'All').map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedDistrict}
              onChange={e => setSelectedDistrict(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-gov-blue bg-white"
            >
              <option value="All">All Districts</option>
              {districts.filter(d => d !== 'All').map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredChallenges.map(c => (
          <div
            key={c.id}
            className="bg-white rounded-lg border border-slate-200 p-5 flex flex-col justify-between hover:border-gov-navy shadow-xs transition group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-gov-blue border border-blue-200">
                  {c.id}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                  Verified
                </span>
              </div>

              <div>
                <h2 className="text-base font-bold text-gov-navy group-hover:text-gov-navy font-sans">
                  {c.title}
                </h2>
                <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                  <span className="font-semibold text-slate-700">{c.domain}</span>
                  <span>•</span>
                  <span className="flex items-center">
                    <MapPin className="w-3 h-3 text-gov-saffron inline mr-1" />
                    {c.district}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {c.summary}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">
                Proposals: {c.proposalsCount}
              </span>
              <button
                onClick={() => navigate(`/challenges/${c.id}`)}
                className="px-3.5 py-1.5 bg-gov-navy hover:bg-slate-800 text-white font-bold text-xs rounded flex items-center space-x-1 transition"
              >
                <span>View Challenge</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredChallenges.length === 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-8 text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No challenges match your filters</h3>
          <p className="text-xs text-slate-500">Try clearing your search term or domain filter.</p>
        </div>
      )}
    </div>
  );
};
