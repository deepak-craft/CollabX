import {
  ProblemReport,
  Challenge,
  IdeaProposal,
  IndustryPartner,
  CollaborationOffer,
  Project,
  CitizenFeedback,
  ReplicationCandidate,
  LinkCollabPost,
  InAppNotification,
  AuditLogEntry,
  UserPersona,
  UserRole
} from '../types';
import {
  SEEDED_PERSONAS,
  INITIAL_PROBLEMS,
  INITIAL_CHALLENGES,
  INITIAL_IDEAS,
  INITIAL_INDUSTRY_PARTNERS,
  INITIAL_COLLABORATION_OFFERS,
  INITIAL_PROJECT,
  INITIAL_FEEDBACK,
  INITIAL_REPLICATION_CANDIDATES,
  INITIAL_LINK_COLLAB_POSTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS
} from '../data/initialSeedData';

const STORAGE_KEYS = {
  CURRENT_USER: 'collabx_current_user',
  PROBLEMS: 'collabx_problems',
  CHALLENGES: 'collabx_challenges',
  IDEAS: 'collabx_ideas',
  INDUSTRY_PARTNERS: 'collabx_industry_partners',
  COLLABORATIONS: 'collabx_collaborations',
  PROJECTS: 'collabx_projects',
  FEEDBACK: 'collabx_feedback',
  REPLICATIONS: 'collabx_replications',
  POSTS: 'collabx_posts',
  NOTIFICATIONS: 'collabx_notifications',
  AUDIT_LOGS: 'collabx_audit_logs',
};

class StorageService {
  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn(`Error reading ${key} from storage, falling back to default`, e);
    }
    return defaultValue;
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving ${key} to storage`, e);
    }
  }

  // Current User
  getCurrentUser(): UserPersona {
    return this.getItem<UserPersona>(STORAGE_KEYS.CURRENT_USER, SEEDED_PERSONAS[0]);
  }

  setCurrentUser(user: UserPersona): void {
    this.setItem(STORAGE_KEYS.CURRENT_USER, user);
  }

  getPersonaByRole(role: UserRole, subRole?: string): UserPersona {
    const match = SEEDED_PERSONAS.find(p => {
      if (subRole && p.subRole) {
        return p.subRole.toLowerCase().includes(subRole.toLowerCase());
      }
      return p.role === role;
    });
    return match || SEEDED_PERSONAS[0];
  }

  getAllPersonas(): UserPersona[] {
    return SEEDED_PERSONAS;
  }

  // Problems
  getProblems(): ProblemReport[] {
    return this.getItem<ProblemReport[]>(STORAGE_KEYS.PROBLEMS, INITIAL_PROBLEMS);
  }

  saveProblem(problem: ProblemReport): void {
    const problems = this.getProblems();
    const existingIndex = problems.findIndex(p => p.id === problem.id);
    if (existingIndex >= 0) {
      problems[existingIndex] = problem;
    } else {
      problems.unshift(problem);
    }
    this.setItem(STORAGE_KEYS.PROBLEMS, problems);
  }

  // Challenges
  getChallenges(): Challenge[] {
    return this.getItem<Challenge[]>(STORAGE_KEYS.CHALLENGES, INITIAL_CHALLENGES);
  }

  saveChallenge(challenge: Challenge): void {
    const challenges = this.getChallenges();
    const existingIndex = challenges.findIndex(c => c.id === challenge.id);
    if (existingIndex >= 0) {
      challenges[existingIndex] = challenge;
    } else {
      challenges.unshift(challenge);
    }
    this.setItem(STORAGE_KEYS.CHALLENGES, challenges);
  }

  // Ideas
  getIdeas(): IdeaProposal[] {
    return this.getItem<IdeaProposal[]>(STORAGE_KEYS.IDEAS, INITIAL_IDEAS);
  }

  saveIdea(idea: IdeaProposal): void {
    const ideas = this.getIdeas();
    const existingIndex = ideas.findIndex(i => i.id === idea.id);
    if (existingIndex >= 0) {
      ideas[existingIndex] = idea;
    } else {
      ideas.unshift(idea);
    }
    this.setItem(STORAGE_KEYS.IDEAS, ideas);
  }

  // Industry Partners
  getIndustryPartners(): IndustryPartner[] {
    return this.getItem<IndustryPartner[]>(STORAGE_KEYS.INDUSTRY_PARTNERS, INITIAL_INDUSTRY_PARTNERS);
  }

  // Collaborations
  getCollaborations(): CollaborationOffer[] {
    return this.getItem<CollaborationOffer[]>(STORAGE_KEYS.COLLABORATIONS, INITIAL_COLLABORATION_OFFERS);
  }

  saveCollaboration(collab: CollaborationOffer): void {
    const collabs = this.getCollaborations();
    const existingIndex = collabs.findIndex(c => c.id === collab.id);
    if (existingIndex >= 0) {
      collabs[existingIndex] = collab;
    } else {
      collabs.unshift(collab);
    }
    this.setItem(STORAGE_KEYS.COLLABORATIONS, collabs);
  }

  // Projects
  getProjects(): Project[] {
    return this.getItem<Project[]>(STORAGE_KEYS.PROJECTS, [INITIAL_PROJECT]);
  }

  saveProject(project: Project): void {
    const projects = this.getProjects();
    const existingIndex = projects.findIndex(p => p.id === project.id);
    if (existingIndex >= 0) {
      projects[existingIndex] = project;
    } else {
      projects.unshift(project);
    }
    this.setItem(STORAGE_KEYS.PROJECTS, projects);
  }

  // Feedback
  getFeedback(): CitizenFeedback[] {
    return this.getItem<CitizenFeedback[]>(STORAGE_KEYS.FEEDBACK, INITIAL_FEEDBACK);
  }

  saveFeedback(fb: CitizenFeedback): void {
    const feedbackList = this.getFeedback();
    feedbackList.unshift(fb);
    this.setItem(STORAGE_KEYS.FEEDBACK, feedbackList);
  }

  // Replications
  getReplications(): ReplicationCandidate[] {
    return this.getItem<ReplicationCandidate[]>(STORAGE_KEYS.REPLICATIONS, INITIAL_REPLICATION_CANDIDATES);
  }

  saveReplication(rep: ReplicationCandidate): void {
    const reps = this.getReplications();
    const index = reps.findIndex(r => r.id === rep.id);
    if (index >= 0) {
      reps[index] = rep;
    } else {
      reps.push(rep);
    }
    this.setItem(STORAGE_KEYS.REPLICATIONS, reps);
  }

  // Link Collab Posts
  getPosts(): LinkCollabPost[] {
    return this.getItem<LinkCollabPost[]>(STORAGE_KEYS.POSTS, INITIAL_LINK_COLLAB_POSTS);
  }

  savePost(post: LinkCollabPost): void {
    const posts = this.getPosts();
    const index = posts.findIndex(p => p.id === post.id);
    if (index >= 0) {
      posts[index] = post;
    } else {
      posts.unshift(post);
    }
    this.setItem(STORAGE_KEYS.POSTS, posts);
  }

  // Notifications
  getNotifications(): InAppNotification[] {
    return this.getItem<InAppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }

  addNotification(notif: InAppNotification): void {
    const notifs = this.getNotifications();
    notifs.unshift(notif);
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, notifs);
  }

  markNotificationAsRead(id: string): void {
    const notifs = this.getNotifications();
    const target = notifs.find(n => n.id === id);
    if (target) {
      target.read = true;
      this.setItem(STORAGE_KEYS.NOTIFICATIONS, notifs);
    }
  }

  // Audit Logs
  getAuditLogs(): AuditLogEntry[] {
    return this.getItem<AuditLogEntry[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  }

  addAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
    const logs = this.getAuditLogs();
    const fullEntry: AuditLogEntry = {
      ...entry,
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    logs.unshift(fullEntry);
    this.setItem(STORAGE_KEYS.AUDIT_LOGS, logs);
  }

  // Complete System Data Reset
  resetAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.PROBLEMS);
    localStorage.removeItem(STORAGE_KEYS.CHALLENGES);
    localStorage.removeItem(STORAGE_KEYS.IDEAS);
    localStorage.removeItem(STORAGE_KEYS.INDUSTRY_PARTNERS);
    localStorage.removeItem(STORAGE_KEYS.COLLABORATIONS);
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.FEEDBACK);
    localStorage.removeItem(STORAGE_KEYS.REPLICATIONS);
    localStorage.removeItem(STORAGE_KEYS.POSTS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
    this.setCurrentUser(SEEDED_PERSONAS[0]);
  }
}

export const storageService = new StorageService();
