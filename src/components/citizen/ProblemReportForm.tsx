import React, { useState, useEffect } from 'react';
import { ProblemReport } from '../../types';
import { AIEngineService } from '../../services/aiEngineService';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { 
  Mic, 
  Square, 
  Camera, 
  MapPin, 
  Upload, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Copy, 
  Send,
  Volume2
} from 'lucide-react';

interface ProblemReportFormProps {
  onSuccess: (problem: ProblemReport) => void;
  onCancel?: () => void;
}

export const ProblemReportForm: React.FC<ProblemReportFormProps> = ({ onSuccess, onCancel }) => {
  const { currentUser } = useAuth();
  const { t } = useAccessibility();

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [district, setDistrict] = useState('Ranchi');
  const [locality, setLocality] = useState('Harmu Bypass, Ward 14');
  const [coordinates, setCoordinates] = useState({ lat: 23.3541, lng: 85.3211 });
  const [affectedPop, setAffectedPop] = useState(4500);
  const [frequency, setFrequency] = useState('Every monsoon rain (15+ times/year)');
  const [evidenceUrl, setEvidenceUrl] = useState('https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80');

  // Interactive Voice Note Simulation
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioTranscript, setAudioTranscript] = useState('');

  // Interactive Camera Simulation
  const [cameraActive, setCameraActive] = useState(false);

  // Instant AI Analysis State
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Auto-run AI Analysis when description changes
  useEffect(() => {
    if (description.trim().length > 15) {
      setIsAnalyzing(true);
      const timer = setTimeout(() => {
        const existingProblems = storageService.getProblems();
        const analysis = AIEngineService.analyzeProblem(title, description, locality, existingProblems);
        setAiAnalysis(analysis);
        setIsAnalyzing(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setAiAnalysis(null);
    }
  }, [title, description, locality]);

  // Voice recording timer simulation
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartVoice = () => {
    setIsRecording(true);
    setAudioTranscript('');
  };

  const handleStopVoice = () => {
    setIsRecording(false);
    const demoVoiceText = 'Every monsoon, water enters this road and school children cannot cross. The main culvert is choked and water stands for 8 hours.';
    setAudioTranscript(demoVoiceText);
    if (!description) {
      setDescription(demoVoiceText);
    }
    if (!title) {
      setTitle('Waterlogging in Harmu bypass cutting off school access');
    }
  };

  const handleSimulateCameraCapture = () => {
    setCameraActive(true);
    setTimeout(() => {
      setEvidenceUrl('https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80');
      setCameraActive(false);
    }, 1200);
  };

  const handleUseCurrentLocation = () => {
    setDistrict('Ranchi');
    setLocality('Harmu Bypass, Ward 14');
    setCoordinates({ lat: 23.3541, lng: 85.3211 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const existingProblems = storageService.getProblems();
    const finalAiAnalysis = aiAnalysis || AIEngineService.analyzeProblem(title, description, locality, existingProblems);

    const newProblem: ProblemReport = {
      id: `JH-RC-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      title: title || 'Monsoon Waterlogging in Harmu Corridor',
      description: description || 'Severe waterlogging disrupts normal traffic and pedestrian movement.',
      citizenName: currentUser.name,
      citizenPhone: '+91 94311 02841',
      district,
      panchayatOrLocality: locality,
      coordinates,
      affectedPopulation: Number(affectedPop),
      frequency,
      evidenceUrls: [evidenceUrl],
      audioTranscript: audioTranscript || undefined,
      hasVoiceNote: Boolean(audioTranscript),
      communityConfirmations: 1,
      status: 'ai_analyzed',
      aiAnalysis: finalAiAnalysis,
      createdAt: new Date().toISOString(),
    };

    storageService.saveProblem(newProblem);

    // Audit log
    storageService.addAuditLog({
      actorName: currentUser.name,
      actorRole: 'Citizen',
      action: 'SUBMIT_PROBLEM',
      targetEntity: newProblem.id,
      details: `Problem reported at ${locality}, ${district}. AI severity: ${finalAiAnalysis.severity}/100.`,
      ipHash: '10.42.12.8 [Citizen Mobile Portal]',
    });

    // In-app alert
    storageService.addNotification({
      id: `notif-${Date.now()}`,
      title: 'Civic Problem Submitted',
      message: `Your grievance ${newProblem.id} has been processed by AI and submitted to the Urban Development Cell for verification.`,
      type: 'info',
      timestamp: 'Just now',
      read: false,
      targetRole: 'citizen',
    });

    onSuccess(newProblem);
  };

  return (
    <div className="bg-white rounded-lg border border-gov-border shadow-gov p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="border-b border-gov-border pb-4 mb-6">
        <div className="flex items-center space-x-2 text-gov-saffron text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>{t('Voice, Camera & GPS Enabled Reporting', 'ध्वनि, कैमरा एवं जीपीएस आधारित रिपोर्टिंग')}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gov-navy mt-1">
          {t('Report a Civic Problem', 'नागरिक समस्या दर्ज करें')}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {t('Describe the problem in your own words. Our AI assistant will categorize and structure the report for official review.', 'अपनी भाषा में समस्या का विवरण दें।')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* TOP QUICK INPUT PILLS: Voice, Camera, GPS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
          {/* 1. Voice Record Simulator */}
          <div>
            {!isRecording ? (
              <button
                type="button"
                onClick={handleStartVoice}
                className="w-full py-2.5 px-3 bg-white border border-slate-300 hover:border-gov-saffron rounded text-xs font-semibold text-slate-700 hover:text-gov-saffron flex items-center justify-center space-x-2 transition shadow-sm"
              >
                <Mic className="w-4 h-4 text-gov-saffron" />
                <span>🎙️ {t('Record Voice Note', 'आवाज रिकॉर्ड करें')}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStopVoice}
                className="w-full py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold flex items-center justify-center space-x-2 animate-pulse shadow-sm"
              >
                <Square className="w-4 h-4" />
                <span>Stop Recording ({recordingSeconds}s)</span>
              </button>
            )}
          </div>

          {/* 2. Camera Capture Simulator */}
          <div>
            <button
              type="button"
              onClick={handleSimulateCameraCapture}
              className="w-full py-2.5 px-3 bg-white border border-slate-300 hover:border-gov-blue rounded text-xs font-semibold text-slate-700 hover:text-gov-blue flex items-center justify-center space-x-2 transition shadow-sm"
            >
              <Camera className="w-4 h-4 text-gov-blue" />
              <span>📷 {cameraActive ? t('Capturing Photo...', 'फ़ोटो ले रहे हैं...') : t('Capture / Add Photo', 'फ़ोटो कैप्चर करें')}</span>
            </button>
          </div>

          {/* 3. GPS Auto Location */}
          <div>
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="w-full py-2.5 px-3 bg-white border border-slate-300 hover:border-gov-green rounded text-xs font-semibold text-slate-700 hover:text-gov-green flex items-center justify-center space-x-2 transition shadow-sm"
            >
              <MapPin className="w-4 h-4 text-gov-green" />
              <span>📍 {t('Use Current GPS Location', 'वर्तमान स्थान उपयोग करें')}</span>
            </button>
          </div>
        </div>

        {/* Audio Transcript feedback if recorded */}
        {audioTranscript && (
          <div className="p-3 bg-amber-50 rounded border border-amber-200 text-xs text-amber-900 flex items-start space-x-2">
            <Volume2 className="w-4 h-4 text-gov-saffron flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Audio Transcript Detected:</span> "{audioTranscript}"
            </div>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            {t('Problem Title / Brief Description *', 'समस्या का शीर्षक / संक्षिप्त विवरण *')}
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Chronic monsoon waterlogging in Harmu bypass road"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full p-2.5 text-sm bg-white border border-slate-300 rounded focus:border-gov-blue focus:ring-1 focus:ring-gov-blue"
          />
        </div>

        {/* Detailed Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            {t('Describe the Problem in Your Own Words *', 'समस्या का पूरा विवरण लिखें *')}
          </label>
          <textarea
            required
            rows={3}
            placeholder="Describe what happens, how long water remains stagnant, what facilities are impacted..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full p-2.5 text-sm bg-white border border-slate-300 rounded focus:border-gov-blue focus:ring-1 focus:ring-gov-blue leading-relaxed"
          ></textarea>
        </div>

        {/* Location Details: District & Panchayat */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {t('District *', 'जिला *')}
            </label>
            <select
              value={district}
              onChange={e => setDistrict(e.target.value)}
              className="w-full p-2 text-sm bg-white border border-slate-300 rounded focus:border-gov-blue"
            >
              <option value="Ranchi">Ranchi (राँची)</option>
              <option value="Dhanbad">Dhanbad (धनबाद)</option>
              <option value="East Singhbhum">East Singhbhum / Jamshedpur (पूर्वी सिंहभूम)</option>
              <option value="Bokaro">Bokaro (बोकारो)</option>
              <option value="Hazaribagh">Hazaribagh (हज़ारीबाग)</option>
              <option value="Deoghar">Deoghar (देवघर)</option>
              <option value="Palamu">Palamu (पलामू)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {t('Panchayat / Locality / Ward *', 'पंचायत / मोहल्ला / वार्ड *')}
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Harmu Bypass, Ward 14"
              value={locality}
              onChange={e => setLocality(e.target.value)}
              className="w-full p-2 text-sm bg-white border border-slate-300 rounded focus:border-gov-blue"
            />
          </div>
        </div>

        {/* Optional Context: Affected Pop & Frequency */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              {t('Estimated Affected Population (Optional)', 'अनुमानित प्रभावित आबादी')}
            </label>
            <input
              type="number"
              value={affectedPop}
              onChange={e => setAffectedPop(Number(e.target.value))}
              className="w-full p-2 text-sm bg-white border border-slate-300 rounded"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              {t('Frequency of Occurrence', 'समस्या की आवृत्ति')}
            </label>
            <input
              type="text"
              value={frequency}
              onChange={e => setFrequency(e.target.value)}
              className="w-full p-2 text-sm bg-white border border-slate-300 rounded"
            />
          </div>
        </div>

        {/* Photo Evidence Preview */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            {t('Photo Evidence Attached', 'संलग्न फ़ोटो साक्ष्य')}
          </label>
          <div className="flex items-center space-x-3">
            <img
              src={evidenceUrl}
              alt="Civic evidence"
              className="w-20 h-16 object-cover rounded border border-slate-300"
            />
            <div className="text-xs text-slate-500 space-y-1">
              <div className="font-semibold text-slate-700">Harmu_drain_choke_photo.jpg</div>
              <div>GPS Geotagged: 23.3541° N, 85.3211° E</div>
            </div>
          </div>
        </div>

        {/* ==================================================== */}
        {/* INSTANT AI ANALYSIS CARD (Decision Support)          */}
        {/* ==================================================== */}
        {aiAnalysis && (
          <div className="bg-slate-50 rounded-lg border-2 border-blue-200 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-blue-200 pb-2">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-gov-blue" />
                <span className="text-xs font-bold uppercase tracking-wider text-gov-navy">
                  AI Analysis — Decision Support Assistant
                </span>
              </div>
              <span className="text-[10px] bg-blue-100 text-blue-900 px-2 py-0.5 rounded font-semibold">
                Confidence: {Math.round(aiAnalysis.confidence * 100)}%
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2 bg-white rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Category</span>
                <div className="font-bold text-gov-navy mt-0.5">{aiAnalysis.category}</div>
              </div>

              <div className="p-2 bg-white rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Severity</span>
                <div className="font-bold text-gov-saffron mt-0.5">{aiAnalysis.severity} / 100</div>
              </div>

              <div className="p-2 bg-white rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Priority</span>
                <div className="font-bold text-red-600 mt-0.5">{aiAnalysis.priority}</div>
              </div>

              <div className="p-2 bg-white rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Duplicate Similarity</span>
                <div className="font-bold text-purple-700 mt-0.5">{aiAnalysis.duplicateSimilarity}%</div>
              </div>
            </div>

            {aiAnalysis.duplicateCandidateTitle && (
              <div className="p-2 bg-amber-50 rounded border border-amber-300 text-xs text-amber-900 flex items-start space-x-2">
                <Copy className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Possible Duplicate Flagged ({aiAnalysis.duplicateSimilarity}%):</span>{' '}
                  Grievance #{aiAnalysis.duplicateCandidateId} — "{aiAnalysis.duplicateCandidateTitle}".
                  <span className="block text-[11px] text-amber-800 mt-0.5">
                    Government officer will inspect for consolidation.
                  </span>
                </div>
              </div>
            )}

            <div className="text-xs text-slate-600">
              <span className="font-semibold text-slate-700">Affected Demographics:</span>{' '}
              {aiAnalysis.affectedGroups.join(', ')}
            </div>

            <div className="text-[11px] text-slate-500 italic">
              * Note: AI outputs are preliminary decision-support classifications. Verification is conducted by the Urban Development Department.
            </div>
          </div>
        )}

        {/* Submission Buttons */}
        <div className="pt-4 border-t border-gov-border flex items-center justify-end space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded text-xs font-semibold hover:bg-slate-100"
            >
              {t('Cancel', 'रद्द करें')}
            </button>
          )}

          <button
            type="submit"
            className="px-6 py-2.5 bg-gov-navy hover:bg-gov-navy-dark text-white rounded text-sm font-bold flex items-center space-x-2 transition shadow-sm"
          >
            <Send className="w-4 h-4" />
            <span>{t('Submit Grievance to Portal', 'समस्या आधिकारिक रूप से दर्ज करें')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
