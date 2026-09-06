import { ProblemReport, UserRole } from '../types';
import { storageService } from './storageService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export interface AuthUserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface OtpResponse {
  challenge_id: string;
  expires_at: string;
  delivery_configured: boolean;
  dev_otp?: string | null;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  role: UserRole;
}

export interface BackendFeedback {
  id: string;
  project_id: string;
  submitted_by?: string | null;
  rating?: number | null;
  comments?: string | null;
  solved_status?: 'YES' | 'PARTIALLY' | 'NO' | null;
  locality?: string | null;
  photo_proof_url?: string | null;
  created_at: string;
}

export interface BackendProject {
  id: string;
  status: string;
  pilot_metrics_json?: string | null;
  [key: string]: unknown;
}

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  const token = storageService.getAuthToken();
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  if (!response.ok) {
    let message = response.status === 403 ? 'You do not have permission to perform this action.' : 'Request failed.';
    try {
      const body = await response.json() as { detail?: string };
      message = body.detail || message;
    } catch {
      // Keep the status-specific fallback when the API did not return JSON.
    }
    if (response.status === 401) {
      storageService.clearAuth();
      window.dispatchEvent(new CustomEvent('collabx:auth-error'));
    }
    throw new ApiError(response.status, message);
  }
  return response.json() as Promise<T>;
}

export type ApiProblemPayload = {
  title: string;
  description: string;
  district: string;
  locality: string;
  citizen_name?: string | null;
  citizen_phone?: string | null;
  coordinates?: { lat: number; lng: number } | null;
  affected_population?: number | null;
  frequency?: string | null;
  evidence_urls?: string[];
  audio_transcript?: string | null;
  has_voice_note?: boolean;
};

export const collabxApi = {
  requestOtp(identifier: string, role: UserRole, name?: string): Promise<OtpResponse> {
    return apiRequest<OtpResponse>('/auth/request-otp', {
      method: 'POST',
      body: JSON.stringify({ identifier, role, name }),
    });
  },

  verifyOtp(challengeId: string, otp: string): Promise<TokenResponse> {
    return apiRequest<TokenResponse>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ challenge_id: challengeId, otp }),
    });
  },

  getCurrentUser(): Promise<AuthUserResponse> {
    return apiRequest<AuthUserResponse>('/auth/me');
  },

  getProject(projectId: string): Promise<BackendProject> {
    return apiRequest<BackendProject>(`/projects/${encodeURIComponent(projectId)}`);
  },

  getProjectFeedback(projectId: string): Promise<BackendFeedback[]> {
    return apiRequest<BackendFeedback[]>(`/projects/${encodeURIComponent(projectId)}/feedback`);
  },

  submitFeedback(projectId: string, feedback: { id?: string; rating: number; comments: string; solved_status: 'YES' | 'PARTIALLY' | 'NO'; locality?: string; photo_proof_url?: string }): Promise<BackendFeedback> {
    return apiRequest<BackendFeedback>(`/projects/${encodeURIComponent(projectId)}/feedback`, {
      method: 'POST',
      body: JSON.stringify({ ...feedback, submitted_by: undefined }),
    });
  },

  updatePilot(projectId: string, status?: string, metrics?: Record<string, unknown>): Promise<BackendProject> {
    return apiRequest<BackendProject>(`/projects/${encodeURIComponent(projectId)}/pilot`, {
      method: 'PATCH',
      body: JSON.stringify({ status, metrics }),
    });
  },

  updateMilestone(milestoneId: string, status: string): Promise<Record<string, unknown>> {
    return apiRequest<Record<string, unknown>>(`/milestones/${encodeURIComponent(milestoneId)}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  async healthCheck(): Promise<{ status: string; service: string }> {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    if (!response.ok) {
      throw new Error('Health check failed');
    }
    return response.json();
  },

  async createProblem(problem: ApiProblemPayload): Promise<ProblemReport> {
    return apiRequest<ProblemReport>('/reports', {
      method: 'POST',
      body: JSON.stringify(problem),
    });
  },

  async getReports(): Promise<ProblemReport[]> {
    return apiRequest<ProblemReport[]>('/reports');
  },
};
