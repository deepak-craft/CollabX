import React, { useState } from 'react';
import { ProblemReport } from '../../types';
import { storageService } from '../../services/storageService';
import { useAccessibility } from '../../context/AccessibilityContext';
import { 
  ShieldCheck, 
  MapPin, 
  Sparkles, 
  Copy, 
  Volume2, 
  Building2,
  Lock
} from 'lucide-react';

export const ProblemVerification: React.FC = () => {
  const { t } = useAccessibility();

  const [problems] = useState<ProblemReport[]>(() => storageService.getProblems());
  const [selectedProblem, setSelectedProblem] = useState<ProblemReport | null>(problems[0] || null);

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg border border-gov-border shadow-gov flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gov-navy flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-gov-green" />
            <span>{t('Government Problem Monitoring Directory', 'सरकारी समस्या निगरानी निर्देशिका')}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Read-only monitoring of reported citizen problems, automated AI categorizations, duplicate clusters, and university routing.
          </p>
        </div>
        <span className="px-3 py-1 bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold rounded flex items-center space-x-1">
          <Lock className="w-3.5 h-3.5 text-slate-500" />
          <span>Read-Only Oversight</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of Reports */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            All Reported Problems ({problems.length})
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {problems.map(prob => {
              const isSelected = selectedProblem?.id === prob.id;

              return (
                <div
                  key={prob.id}
                  onClick={() => setSelectedProblem(prob)}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition ${
                    isSelected
                      ? 'bg-blue-50/90 border-gov-blue shadow-sm ring-1 ring-gov-blue'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-mono font-bold text-slate-500">{prob.id}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded font-bold uppercase text-[10px] ${
                        prob.aiAnalysis.priority === 'Critical'
                          ? 'bg-red-100 text-red-800'
                          : prob.aiAnalysis.priority === 'High'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {prob.aiAnalysis.priority}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2">{prob.title}</h4>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                    <span>{prob.panchayatOrLocality}</span>
                    <span className="font-semibold text-gov-navy uppercase text-[10px]">
                      {prob.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Problem Deep Dive (Read-Only) */}
        {selectedProblem && (
          <div className="lg:col-span-2 bg-white rounded-lg border border-gov-border shadow-gov p-5 space-y-5">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold bg-gov-blue-50 text-gov-blue px-2 py-0.5 rounded">
                    {selectedProblem.id}
                  </span>
                  <span className="text-xs text-slate-500">
                    Citizen: <span className="font-bold text-slate-800">{selectedProblem.citizenName}</span> ({selectedProblem.citizenPhone})
                  </span>
                </div>
                <h3 className="text-base font-bold text-gov-navy mt-1">
                  {selectedProblem.title}
                </h3>
                <div className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-gov-saffron" />
                  <span>{selectedProblem.panchayatOrLocality}, {selectedProblem.district} (Lat: {selectedProblem.coordinates.lat}, Lng: {selectedProblem.coordinates.lng})</span>
                </div>
              </div>

              <span
                className="text-xs px-2.5 py-1 rounded font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300"
              >
                Stage: {selectedProblem.status.replace('_', ' ')}
              </span>
            </div>

            {/* Description & Citizen Audio Note */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                Citizen Grievance Details:
              </span>
              <p className="text-slate-700 bg-slate-50 p-3 rounded border border-slate-200 leading-relaxed">
                {selectedProblem.description}
              </p>

              {selectedProblem.audioTranscript && (
                <div className="p-2.5 bg-amber-50 rounded border border-amber-200 text-amber-950 flex items-center space-x-2">
                  <Volume2 className="w-4 h-4 text-gov-saffron flex-shrink-0" />
                  <div>
                    <span className="font-bold">Voice Note Audio Transcript:</span> "{selectedProblem.audioTranscript}"
                  </div>
                </div>
              )}
            </div>

            {/* Evidence Photo & Community Confirmation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block mb-1">
                  On-Ground Photo Evidence:
                </span>
                <img
                  src={selectedProblem.evidenceUrls[0] || 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80'}
                  alt="Evidence"
                  className="w-full h-32 object-cover rounded border border-slate-300 shadow-xs"
                />
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block mb-1">
                  Community Validation Index:
                </span>
                <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between font-bold text-gov-navy">
                    <span>Community Confirmations:</span>
                    <span className="text-base">{selectedProblem.communityConfirmations} Residents</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Local residents confirmed facing this issue.
                  </p>
                </div>
              </div>
            </div>

            {/* AI DECISION SUPPORT PANEL (READ ONLY) */}
            <div className="p-4 bg-slate-50 rounded-lg border-2 border-blue-200 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-blue-200 pb-1.5">
                <div className="flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-gov-blue" />
                  <span className="font-bold text-gov-navy uppercase tracking-wider text-[11px]">
                    AI Analysis & Routing Engine (Automated)
                  </span>
                </div>
                <span className="text-[10px] bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded">
                  Algorithm Confidence: {Math.round(selectedProblem.aiAnalysis.confidence * 100)}%
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="p-2 bg-white rounded border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Category</div>
                  <div className="font-bold text-gov-navy mt-0.5">{selectedProblem.aiAnalysis.category}</div>
                </div>

                <div className="p-2 bg-white rounded border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Severity</div>
                  <div className="font-bold text-gov-saffron mt-0.5">{selectedProblem.aiAnalysis.severity} / 100</div>
                </div>

                <div className="p-2 bg-white rounded border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Duplicate Check</div>
                  <div className="font-bold text-purple-700 mt-0.5">{selectedProblem.aiAnalysis.duplicateSimilarity}% Match</div>
                </div>

                <div className="p-2 bg-white rounded border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Priority</div>
                  <div className="font-bold text-red-600 mt-0.5">{selectedProblem.aiAnalysis.priority}</div>
                </div>
              </div>

              {selectedProblem.aiAnalysis.matchedUniversities && selectedProblem.aiAnalysis.matchedUniversities.length > 0 && (
                <div className="p-2.5 bg-blue-50 rounded border border-blue-200 text-blue-950 flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-gov-blue flex-shrink-0" />
                  <div>
                    <span className="font-bold">AI Matched Universities:</span> {selectedProblem.aiAnalysis.matchedUniversities.join(', ')}
                  </div>
                </div>
              )}

              {selectedProblem.aiAnalysis.duplicateSimilarity >= 70 && (
                <div className="p-2 bg-amber-50 rounded border border-amber-300 text-amber-900 flex items-center space-x-2">
                  <Copy className="w-4 h-4 text-amber-700" />
                  <span>Potential Duplicate Cluster with #{selectedProblem.aiAnalysis.duplicateCandidateId} ({selectedProblem.aiAnalysis.duplicateSimilarity}%)</span>
                </div>
              )}

              <p className="text-[11px] text-slate-600 italic">
                AI Rationale: {selectedProblem.aiAnalysis.rationale}
              </p>
            </div>

            {/* Read-Only Notice Banner */}
            <div className="p-3 bg-slate-100 rounded border border-slate-200 text-slate-600 text-xs flex items-center space-x-2">
              <Lock className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <span>
                <strong>Read-Only Monitoring Access:</strong> Government monitors problem discovery and university progress without workflow intervention.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
