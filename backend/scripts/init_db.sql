CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  citizen_name TEXT,
  citizen_phone TEXT,
  district TEXT NOT NULL,
  locality TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  affected_population INTEGER,
  frequency TEXT,
  evidence_urls TEXT,
  audio_transcript TEXT,
  has_voice_note BOOLEAN DEFAULT FALSE,
  community_confirmations INTEGER DEFAULT 0,
  status TEXT DEFAULT 'submitted',
  category TEXT,
  severity INTEGER,
  priority TEXT,
  duplicate_similarity DOUBLE PRECISION,
  duplicate_candidate_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_district ON reports(district);

CREATE TABLE IF NOT EXISTS semantic_embeddings (
  id SERIAL PRIMARY KEY,
  source_type VARCHAR(40) NOT NULL,
  source_id VARCHAR(128) NOT NULL,
  content_hash VARCHAR(64) NOT NULL,
  model_name VARCHAR(120) NOT NULL,
  model_version VARCHAR(40) NOT NULL,
  dimensions INTEGER NOT NULL,
  embedding vector(256) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_embedding_source UNIQUE (source_type, source_id)
);

CREATE INDEX IF NOT EXISTS idx_embeddings_source_type ON semantic_embeddings(source_type);

CREATE TABLE IF NOT EXISTS university_profiles (
  id VARCHAR(128) PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  domain VARCHAR(180) NOT NULL,
  technologies TEXT NOT NULL,
  expertise TEXT NOT NULL,
  student_team_skills TEXT NOT NULL,
  previous_project_areas TEXT NOT NULL,
  location VARCHAR(180),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS industry_profiles (
  id VARCHAR(128) PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  domain VARCHAR(180) NOT NULL,
  technologies TEXT NOT NULL,
  support_capabilities TEXT NOT NULL,
  mentorship_capability TEXT NOT NULL,
  funding_csr_capability TEXT NOT NULL,
  location VARCHAR(180),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS open_challenges (
  id VARCHAR(128) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  domain VARCHAR(180) NOT NULL,
  technologies TEXT NOT NULL,
  location VARCHAR(180),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS match_recommendations (
  id VARCHAR(220) PRIMARY KEY,
  challenge_id VARCHAR(128) NOT NULL,
  candidate_type VARCHAR(40) NOT NULL,
  candidate_id VARCHAR(128) NOT NULL,
  score DOUBLE PRECISION NOT NULL,
  explanation TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  reviewed_by VARCHAR(128),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_match_candidate UNIQUE (challenge_id, candidate_type, candidate_id)
);

CREATE INDEX IF NOT EXISTS idx_matches_challenge ON match_recommendations(challenge_id);
