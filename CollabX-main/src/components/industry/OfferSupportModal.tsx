import React, { useState } from 'react';
import { Challenge, SupportType, SupportStatus, CollaborationOffer } from '../../types';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { 
  Building, 
  X, 
  CheckCircle2, 
  Send, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  IndianRupee 
} from 'lucide-react';

interface OfferSupportModalProps {
  challenge: Challenge;
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: (offer: CollaborationOffer) => void;
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

export const OfferSupportModal: React.FC<OfferSupportModalProps> = ({
  challenge,
  isOpen,
  onClose,
  onSubmitted,
}) => {
  const { currentUser } = useAuth();
  const { t } = useAccessibility();

  const [selectedTypes, setSelectedTypes] = useState<SupportType[]>(['Hardware', 'Mentorship', 'Testing Facility']);
  const [supportStatus, setSupportStatus] = useState<SupportStatus>('Confirmed Funding');
  const [description, setDescription] = useState(
    'Providing 15 Industrial IP68 Ultrasonic Depth Sensors, 4 Solar LoRaWAN Telemetry Gateways, and ₹1,50,000 prototype fabrication materials with lab flume testing in Jamshedpur.'
  );
  const [isSuccess, setIsSuccess] = useState(false);

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

    const newOffer: CollaborationOffer = {
      id: `collab-${Date.now()}`,
      projectId: 'PROJ-JH-2024-001',
      challengeId: challenge.id,
      industryId: 'ind-tata-01',
      industryName: currentUser.organization || 'Tata Steel GovTech CSR Division',
      supportTypes: selectedTypes,
      description,
      status: 'accepted',
      supportStatus,
      requestedAt: new Date().toISOString(),
      respondedAt: new Date().toISOString(),
    };

    storageService.saveCollaboration(newOffer);

    // Update project with industry partner
    const projects = storageService.getProjects();
    if (projects[0]) {
      projects[0].industryPartnerName = newOffer.industryName;
      projects[0].industrySupportStatus = supportStatus;
      storageService.saveProject(projects[0]);
    }

    // Audit log
    storageService.addAuditLog({
      actorName: currentUser.name,
      actorRole: 'Industry Partner',
      action: 'OFFER_INDUSTRY_SUPPORT',
      targetEntity: challenge.id,
      details: `Offered ${selectedTypes.join(', ')} with status "${supportStatus}". Description: ${description}`,
      ipHash: '172.16.8.54 [Tata Steel Intranet]',
    });

    // In-app alert for student & govt
    storageService.addNotification({
      id: `notif-${Date.now()}`,
      title: 'Industry Support Confirmed!',
      message: `${currentUser.organization} committed ${selectedTypes.join(', ')} for the Harmu Drainage pilot.`,
      type: 'success',
      timestamp: 'Just now',
      read: false,
      targetRole: 'student',
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onSubmitted(newOffer);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog">
      <div className="bg-white rounded-lg border border-gov-border shadow-gov-lg max-w-xl w-full p-6 space-y-4">
        <div className="border-b border-gov-border pb-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gov-green uppercase tracking-wider">
              Corporate / Startup Collaboration
            </span>
            <h3 className="text-lg font-bold text-gov-navy">
              Offer Industry Support & Resources
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{challenge.title}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-gov-green mx-auto animate-bounce" />
            <div className="text-base font-bold text-slate-900">
              Support Package Committed to Project!
            </div>
            <div className="text-xs text-slate-500">
              The university engineering team and municipal nodal officer will have direct access to your resources in the Shared Project Workspace.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Support Type Pills */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                1. Select Support Modalities *
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
                          ? 'bg-gov-navy text-white border-gov-navy shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Support Status Selection (Strictly 3 values) */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                2. Support Status Allocation *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Confirmed Funding', 'Support Available', 'Not Allocated'] as SupportStatus[]).map(status => (
                  <button
                    type="button"
                    key={status}
                    onClick={() => setSupportStatus(status)}
                    className={`py-2 px-2 rounded border text-center font-bold text-xs transition ${
                      supportStatus === status
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                * Note: Platform policy forbids "Guaranteed Funding" claims.
              </span>
            </div>

            {/* Description / Resources specification */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                3. Technical Details & Hardware Specifications *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-300 rounded leading-relaxed"
              ></textarea>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-gov-navy hover:bg-gov-navy-dark text-white font-bold rounded flex items-center space-x-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Confirm Collaboration</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
