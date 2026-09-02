// Domain Types for COLLABX GovTech Platform (SIH26043)

export type UserRole = 'citizen' | 'student' | 'professor' | 'industry' | 'government' | 'expert';

export interface UserPersona {
  id: string;
  name: string;
  role: UserRole;
  subRole?: 'Professor' | 'Student' | 'Government Officer' | 'Domain Expert' | 'Industry Partner' | 'Citizen';
  email: string;
  avatar?: string;
  title: string;
  organization: string;
  district: string;
  verified: boolean;
  department?: string;
}

export type ProblemStatus = 
  | 'submitted' 
  | 'ai_analyzed' 
  | 'under_review' 
  | 'verified' 
  | 'challenge_created' 
  | 'in_project' 
  | 'pilot_deployed' 
  | 'impact_measured' 
  | 'rejected';

export interface AIProblemAnalysis {
  category: string;
  severity: number; // 0 - 100
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  duplicateSimilarity: number; // 0 - 100
  duplicateCandidateId?: string;
  duplicateCandidateTitle?: string;
  affectedGroups: string[];
  confidence: number;
  rationale: string;
  analyzedAt: string;
}

export interface ProblemReport {
  id: string;
  title: string;
  description: string;
  citizenName: string;
  citizenPhone: string;
  district: string;
  panchayatOrLocality: string;
  coordinates: { lat: number; lng: number };
  affectedPopulation: number;
  frequency: string;
  evidenceUrls: string[];
  audioTranscript?: string;
  hasVoiceNote?: boolean;
  communityConfirmations: number;
  status: ProblemStatus;
  aiAnalysis: AIProblemAnalysis;
  createdAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  verificationNotes?: string;
  challengeId?: string;
}

export type SupportStatus = 'Confirmed Funding' | 'Support Available' | 'Not Allocated';

export interface Challenge {
  id: string;
  problemId: string;
  title: string;
  domain: string;
  district: string;
  locality: string;
  summary: string;
  expectedOutcomes: string[];
  skillsRequired: string[];
  evaluationCriteria: string[];
  deadline: string;
  pilotOpportunity: string;
  supportStatus: SupportStatus;
  supportDetails: string;
  createdBy: string;
  createdAt: string;
  proposalsCount: number;
  status: 'open' | 'evaluating' | 'selected' | 'pilot_active' | 'completed';
  selectedIdeaId?: string;
}

export interface AIScores {
  feasibility: number;       // 0 - 100
  socialImpact: number;      // 0 - 100
  costEfficiency: number;    // 0 - 100
  scalability: number;       // 0 - 100
  sustainability: number;    // 0 - 100
  technicalSuitability: number; // 0 - 100
  compositeScore: number;
  aiRemarks: string;
}

export interface IdeaProposal {
  id: string;
  challengeId: string;
  title: string;
  teamName: string;
  university: string;
  leadStudentName: string;
  leadStudentEmail: string;
  mentorProfessorName: string;
  mentorProfessorDepartment: string;
  disciplines: string[];
  problemUnderstanding: string;
  proposedSolution: string;
  technologyStack: string[];
  estimatedCost: number; // INR
  expectedImpact: string;
  scalability: string;
  implementationApproach: string;
  aiScores: AIScores;
  expertScores?: AIScores;
  expertScoreTotal?: number;
  expertRemarks?: string;
  expertEvaluatorName?: string;
  status: 'submitted' | 'ai_evaluated' | 'shortlisted' | 'selected' | 'rejected';
  submittedAt: string;
  evaluatedAt?: string;
}

export interface ExpertEvaluation {
  id: string;
  ideaId: string;
  challengeId: string;
  expertId: string;
  expertName: string;
  expertDesignation: string;
  scores: {
    feasibility: number;
    socialImpact: number;
    costEfficiency: number;
    scalability: number;
    sustainability: number;
    technicalSuitability: number;
  };
  totalScore: number;
  technicalRemarks: string;
  decision: 'select' | 'shortlist' | 'reject';
  evaluatedAt: string;
}

export type SupportType = 
  | 'Mentorship' 
  | 'Hardware' 
  | 'Software / APIs' 
  | 'Cloud' 
  | 'Testing Facility' 
  | 'Funding / CSR Support' 
  | 'Pilot Support' 
  | 'Deployment Support';

export interface IndustryPartner {
  id: string;
  companyName: string;
  industryType: string;
  capabilities: string[];
  technologies: string[];
  csrAllocation: string;
  projectsSupported: number;
  pilotsCompleted: number;
  location: string;
  contactPerson: string;
}

export interface CollaborationOffer {
  id: string;
  projectId: string;
  challengeId: string;
  industryId: string;
  industryName: string;
  supportTypes: SupportType[];
  description: string;
  status: 'offered' | 'accepted' | 'declined';
  supportStatus: SupportStatus;
  requestedAt: string;
  respondedAt?: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  phase: 'Planning' | 'Prototype' | 'Testing' | 'Pilot' | 'Impact';
  status: 'completed' | 'in_progress' | 'pending';
  dueDate: string;
  deliverable: string;
  completedAt?: string;
}

export interface ProjectTask {
  id: string;
  title: string;
  assignee: string;
  role: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'high' | 'medium' | 'low';
}

export interface ProjectDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  date: string;
}

export interface PilotMetrics {
  waterloggingBeforeHours: number;
  waterloggingAfterHours: number;
  reductionPercentage: number;
  peakDepthBeforeCm: number;
  peakDepthAfterCm: number;
  depthReductionPercentage: number;
  beneficiaries: number;
  pilotLocation: string;
  startDate: string;
  completionDate: string;
}

export interface Project {
  id: string;
  challengeId: string;
  ideaId: string;
  title: string;
  university: string;
  teamName: string;
  industryPartnerName?: string;
  nodalOfficerName: string;
  status: 'planning' | 'prototype' | 'testing' | 'pilot' | 'completed';
  currentMilestoneIndex: number;
  milestones: ProjectMilestone[];
  tasks: ProjectTask[];
  documents: ProjectDocument[];
  pilotMetrics: PilotMetrics;
  industrySupportStatus: SupportStatus;
}

export interface CitizenFeedback {
  id: string;
  projectId: string;
  citizenName: string;
  locality: string;
  solvedStatus: 'YES' | 'PARTIALLY' | 'NO';
  rating: number; // 1 to 5
  comment: string;
  photoProofUrl?: string;
  submittedAt: string;
}

export interface ReplicationCandidate {
  id: string;
  district: string;
  hotspotName: string;
  coordinates: { lat: number; lng: number };
  similarityPercentage: number;
  estimatedBeneficiaries: number;
  priority: 'High' | 'Critical' | 'Medium';
  status: 'recommended' | 'under_consideration' | 'approved';
}

export interface LinkCollabPost {
  id: string;
  authorName: string;
  authorRole: UserRole;
  authorOrg: string;
  title: string;
  content: string;
  tags: string[]; // e.g. Water, IoT, Civil, Healthcare, Education, Disaster Management
  upvotes: number;
  commentsCount: number;
  hasProjectConversionBadge?: boolean;
  convertedProjectId?: string;
  createdAt: string;
  comments: {
    id: string;
    authorName: string;
    authorRole: UserRole;
    content: string;
    isExpertAnswer?: boolean;
    createdAt: string;
  }[];
}

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'gov';
  timestamp: string;
  read: boolean;
  targetRole?: UserRole;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: string;
  targetEntity: string;
  details: string;
  ipHash: string;
}
