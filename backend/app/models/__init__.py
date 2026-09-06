from app.models.audit import AuditLog
from app.models.embedding import SemanticEmbedding
from app.models.matching import IndustryProfile, MatchRecommendation, OpenChallenge, UniversityProfile
from app.models.normalized import Challenge, Feedback, Idea, Location, Milestone, Project, User
from app.models.report import Report
from app.models.otp_challenge import OtpChallenge

__all__ = ["AuditLog", "Report", "SemanticEmbedding", "UniversityProfile", "IndustryProfile", "OpenChallenge", "MatchRecommendation", "User", "Location", "Challenge", "Idea", "Project", "Milestone", "Feedback", "OtpChallenge"]
