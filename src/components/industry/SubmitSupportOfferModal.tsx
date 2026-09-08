import React, { useState } from 'react';
import { ProblemReport, IdeaProposal, SupportType, IndustrySupportOffer } from '../../types';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  Send,
  Building,
  CheckCircle2,
  Layers
} from 'lucide-react';

interface SubmitSupportOfferModalProps {
  problem: ProblemReport;
  selectedSolution: IdeaProposal;
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: (offer: IndustrySupportOffer) => void;
}

const SUPPORT_TYPES: SupportType[] = [
  'Mentorship',
  'Hardware',
  'Software / APIs',
  'Cloud',
  'Testing Facility',
  'Funding / CSR Support',
  'Pilot Support',
  'Deployment Support'
];

export const SubmitSupportOfferModal: React.FC<SubmitSupportOfferModalProps> = ({
  problem,
  selectedSolution,
  isOpen,
  onClose,
  onSubmitted
}) => {
  const { currentUser } = useAuth();

  const [selectedTypes, setSelectedTypes] = useState<SupportType[]>(['Hardware', 'Mentorship', 'Funding / CSR Support']);
  const [description, setDescription] = useState(
    `Providing 15 Industrial IP68 Ultrasonic Depth Sensors, 4 Solar LoRaWAN Telemetry Gateways, and ₹1,50,000 CSR material sponsorship for Team ${selectedSolution.teamName} (${selectedSolution.university}).`
  );

  if (!isOpen) return null;

  const toggleType = (type: SupportType) => {
    if (selectedTypes.includes(type)) {
      if (selectedTypes.length > 1) {
        setSelectedTypes(selectedTypes.filter(t => t !== type));
      }
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const offer: IndustrySupportOffer = {
      id: `SUP-${Date.now().toString().slice(-6)}`,
      problemId: problem.id,
      selectedSolutionId: selectedSolution.id,
      industryName: currentUser.organization || 'Tata Steel GovTech CSR Division',
      contactPerson: `${currentUser.name} (${currentUser.title})`,
      supportTypes: selectedTypes,
      description,
      status: 'Support Offer Submitted',
      requestedAt: new Date().toISOString(),
    };

    storageService.submitIndustrySupportOffer(problem.id, offer);

    // Audit log
    storageService.addAuditLog({
      actorName: currentUser.name,
      actorRole: 'Industry Partner',
      action: 'SUBMIT_INDUSTRY_SUPPORT_OFFER',
      targetEntity: problem.id,
      details: `Support offer submitted for selected solution "${selectedSolution.title}" (${selectedSolution.university}).`,
      ipHash: '172.16.8.54 [Tata Steel Net]',
    });

    // Notify Gov & University
    storageService.addNotification({
      id: `notif-${Date.now()}`,
      title: 'Industry Support Offer Submitted',
      message: `${offer.industryName} submitted a support offer (${selectedTypes.join(', ')}) for ${selectedSolution.university}'s solution.`,
      type: 'success',
      timestamp: 'Just now',
      read: false,
      targetRole: 'government',
    });

    if (onSubmitted) onSubmitted(offer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-lg border border-gov-border shadow-xl my-8 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gov-navy text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building className="w-5 h-5 text-gov-saffron-amber" />
            <div>
              <h3 className="font-bold text-sm">Submit Industry Support Offer</h3>
              <p className="text-[11px] text-slate-300">
                Selected Solution: <span className="font-bold text-amber-300">{selectedSolution.title}</span> ({selectedSolution.university})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
            <div className="font-bold text-gov-navy">Target Problem: #{problem.id} — {problem.title}</div>
            <div className="text-slate-600">Selected University Team: <strong>{selectedSolution.teamName}</strong> ({selectedSolution.university})</div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              1. Select Support Categories *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SUPPORT_TYPES.map(type => {
                const isSelected = selectedTypes.includes(type);
                return (
                  <button
                    type="button"
                    key={type}
                    onClick={() => toggleType(type)}
                    className={`p-2 rounded border text-center font-semibold transition ${
                      isSelected
                        ? 'bg-gov-navy text-white border-gov-navy'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              2. Support Offer Description & Resource Commitments *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-2.5 text-xs border border-slate-300 rounded focus:border-gov-blue"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded hover:bg-slate-50 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-1.5 bg-gov-navy hover:bg-slate-800 text-white rounded font-bold flex items-center space-x-1.5 shadow-sm"
            >
              <Send className="w-3.5 h-3.5 text-gov-saffron-amber" />
              <span>Submit Support Offer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
