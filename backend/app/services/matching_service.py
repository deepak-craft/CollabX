from __future__ import annotations

import json
import re
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.embedding import SemanticEmbedding
from app.models.matching import IndustryProfile, MatchRecommendation, OpenChallenge, UniversityProfile
from app.services.embedding_service import cosine_similarity

MATCH_CANDIDATE_TYPES = ("university", "industry")
STOP_WORDS = {"about", "after", "also", "because", "challenge", "their", "there", "these", "with", "from", "that", "this"}


def _tokens(text: str) -> set[str]:
    return {token for token in re.findall(r"[a-z0-9]{4,}", text.lower()) if token not in STOP_WORDS}


def _explanation(challenge_text: str, profile_text: str, score: float) -> str:
    shared = list(_tokens(challenge_text) & _tokens(profile_text))[:3]
    reason = " + ".join(shared) if shared else "related domain and expertise"
    strength = "Strong match" if score >= 70 else "Good match" if score >= 45 else "Potential match"
    return f"{strength} because of {reason} expertise. This is a recommendation for authorized review, not an assignment or funding guarantee."


def _profile_text(profile: UniversityProfile | IndustryProfile) -> str:
    if isinstance(profile, UniversityProfile):
        return "\n".join((profile.domain, profile.technologies, profile.expertise, profile.student_team_skills, profile.previous_project_areas, profile.location or ""))
    return "\n".join((profile.domain, profile.technologies, profile.support_capabilities, profile.mentorship_capability, profile.funding_csr_capability, profile.location or ""))


def _challenge_text(challenge: OpenChallenge) -> str:
    return "\n".join((challenge.title, challenge.description, challenge.domain, challenge.technologies, challenge.location or ""))


def _embedding_map(db: Session, source_type: str, source_ids: list[str]) -> dict[str, SemanticEmbedding]:
    rows = db.scalars(select(SemanticEmbedding).where(SemanticEmbedding.source_type == source_type, SemanticEmbedding.source_id.in_(source_ids))).all()
    return {row.source_id: row for row in rows}


def refresh_challenge_matches(db: Session, challenge: OpenChallenge) -> list[MatchRecommendation]:
    challenge_embedding = db.scalar(select(SemanticEmbedding).where(SemanticEmbedding.source_type == "open_challenge", SemanticEmbedding.source_id == challenge.id))
    if challenge_embedding is None:
        return []

    candidates: list[tuple[str, UniversityProfile | IndustryProfile, SemanticEmbedding | None]] = []
    universities = db.scalars(select(UniversityProfile)).all()
    industries = db.scalars(select(IndustryProfile)).all()
    university_embeddings = _embedding_map(db, "university_expertise", [profile.id for profile in universities])
    industry_embeddings = _embedding_map(db, "industry_expertise", [profile.id for profile in industries])
    candidates.extend(("university", profile, university_embeddings.get(profile.id)) for profile in universities)
    candidates.extend(("industry", profile, industry_embeddings.get(profile.id)) for profile in industries)

    recommendations: list[MatchRecommendation] = []
    now = datetime.now(timezone.utc)
    challenge_text = _challenge_text(challenge)
    for candidate_type, profile, profile_embedding in candidates:
        if profile_embedding is None:
            continue
        score = round(cosine_similarity(challenge_embedding.embedding, profile_embedding.embedding), 2)
        match_id = f"MATCH-{challenge.id}-{candidate_type}-{profile.id}"
        recommendation = db.get(MatchRecommendation, match_id)
        if recommendation is None:
            recommendation = MatchRecommendation(
                id=match_id,
                challenge_id=challenge.id,
                candidate_type=candidate_type,
                candidate_id=profile.id,
                status="pending",
                created_at=now,
                updated_at=now,
            )
            db.add(recommendation)
        recommendation.score = score
        recommendation.explanation = _explanation(challenge_text, _profile_text(profile), score)
        recommendation.updated_at = now
        recommendations.append(recommendation)
    db.commit()
    return sorted(recommendations, key=lambda recommendation: recommendation.score, reverse=True)


DEPARTMENT_PROFILES = [
    {
        "university_id": "bit-mesra",
        "university_name": "Birla Institute of Technology (BIT) Mesra",
        "department_id": "bit-cse",
        "department_name": "Computer Science & Engineering",
        "domains": ["Artificial Intelligence", "Data Science", "Waste Management", "Cybersecurity"],
        "capabilities": ["AI/ML Algorithms", "Software Development", "Data Science", "Civic Route Optimization"],
        "keywords": ["waste", "garbage", "ai", "software", "app", "cybersecurity", "detection", "route", "cloud", "portal"],
    },
    {
        "university_id": "bit-mesra",
        "university_name": "Birla Institute of Technology (BIT) Mesra",
        "department_id": "bit-ece",
        "department_name": "Electronics & Communication Engineering",
        "domains": ["Telemetry", "Embedded Systems", "Signal Processing"],
        "capabilities": ["Signal Processing", "Embedded Systems", "Telemetry Transmitters"],
        "keywords": ["telemetry", "signal", "wireless", "communication", "sensor network", "rf", "transmitter", "embedded"],
    },
    {
        "university_id": "bit-mesra",
        "university_name": "Birla Institute of Technology (BIT) Mesra",
        "department_id": "bit-civil",
        "department_name": "Civil Engineering",
        "domains": ["Urban Infrastructure", "Hydraulics & Drainage", "Structural Engineering"],
        "capabilities": ["Roads & Highways", "Stormwater Drainage", "Hydraulic Siphoning", "Structural Engineering"],
        "keywords": ["waterlogging", "drain", "drainage", "flood", "culvert", "siphon", "nullah", "stormwater", "monsoon", "inundation"],
    },
    {
        "university_id": "bit-mesra",
        "university_name": "Birla Institute of Technology (BIT) Mesra",
        "department_id": "bit-eee",
        "department_name": "Electrical & Electronics Engineering",
        "domains": ["Power Distribution", "Renewable Energy", "Smart Grids"],
        "capabilities": ["Power Distribution", "Smart Grid Technology", "Electrical Safety Audits"],
        "keywords": ["electricity", "power", "grid", "transformer", "voltage", "outage", "solar", "substation", "wire"],
    },
    {
        "university_id": "iit-ism-dhanbad",
        "university_name": "IIT (ISM) Dhanbad",
        "department_id": "iit-cse",
        "department_name": "Computer Science & Engineering",
        "domains": ["High-Performance Computing", "Geospatial AI", "Industrial Automation"],
        "capabilities": ["Distributed Computing", "Geospatial Analytics", "Deep Learning"],
        "keywords": ["hpc", "geospatial", "high performance computing", "deep learning", "industrial ai"],
    },
    {
        "university_id": "iit-ism-dhanbad",
        "university_name": "IIT (ISM) Dhanbad",
        "department_id": "iit-mining",
        "department_name": "Mining Engineering",
        "domains": ["Mining Safety", "Mine Monitoring", "Dust Control", "Industrial Automation"],
        "capabilities": ["Mining Safety Audits", "Dust Suppression", "Slope Stability", "Mine Tailings"],
        "keywords": ["mining", "mine", "coal", "dust", "overburden", "quarry", "blasting", "tailings", "subterranean"],
    },
    {
        "university_id": "iit-ism-dhanbad",
        "university_name": "IIT (ISM) Dhanbad",
        "department_id": "iit-env",
        "department_name": "Environmental Science & Engineering",
        "domains": ["Water Quality", "Pollution Monitoring", "Air Quality", "Environmental Engineering"],
        "capabilities": ["Water Quality Testing", "Pollution Remediation", "Groundwater Assessment", "Effluent Management"],
        "keywords": ["water", "drinking water", "contamination", "contaminate", "pollute", "pollution", "arsenic", "fluoride", "air quality", "clean water", "groundwater", "well", "filtration"],
    },
    {
        "university_id": "iit-ism-dhanbad",
        "university_name": "IIT (ISM) Dhanbad",
        "department_id": "iit-electronics",
        "department_name": "Electronics Engineering",
        "domains": ["IoT Sensors", "Industrial Instrumentation", "Environmental Telemetry"],
        "capabilities": ["Sensor Array Design", "Industrial Instrumentation", "Low-Power Field Nodes"],
        "keywords": ["sensor", "iot", "instrumentation", "low power", "monitoring device", "circuit"],
    },
    {
        "university_id": "nit-jamshedpur",
        "university_name": "National Institute of Technology (NIT) Jamshedpur",
        "department_id": "nit-cse",
        "department_name": "Computer Science & Engineering",
        "domains": ["Web Platforms", "Data Analytics", "Computer Vision"],
        "capabilities": ["Full-Stack Web Platforms", "Public Dashboards", "Edge Computer Vision"],
        "keywords": ["web platform", "dashboard", "analytics", "vision", "edge detection"],
    },
    {
        "university_id": "nit-jamshedpur",
        "university_name": "National Institute of Technology (NIT) Jamshedpur",
        "department_id": "nit-civil",
        "department_name": "Civil Engineering",
        "domains": ["Road Infrastructure", "Highway Engineering", "Pothole Remediation", "Bridge Engineering"],
        "capabilities": ["Road Pavement Design", "Pothole Detection & Repair", "Infrastructure Drainage"],
        "keywords": ["pothole", "road", "highway", "nh-33", "pavement", "crack", "bridge", "asphalt", "bitumen", "traffic"],
    },
    {
        "university_id": "nit-jamshedpur",
        "university_name": "National Institute of Technology (NIT) Jamshedpur",
        "department_id": "nit-electrical",
        "department_name": "Electrical Engineering",
        "domains": ["Substation Automation", "Power Protection"],
        "capabilities": ["Substation Automation", "Protective Relaying", "Fault Detection"],
        "keywords": ["substation", "transformer fire", "relay", "breaker", "fault"],
    },
    {
        "university_id": "nit-jamshedpur",
        "university_name": "National Institute of Technology (NIT) Jamshedpur",
        "department_id": "nit-mechanical",
        "department_name": "Mechanical Engineering",
        "domains": ["Heavy Machinery", "Robotics & Automation"],
        "capabilities": ["Mechanical Fabrication", "Robotic Inspection", "Dredging Tools"],
        "keywords": ["robot", "mechanical", "pipe cleaner", "crawler", "machinery"],
    },
    {
        "university_id": "bau-ranchi",
        "university_name": "Birsa Agricultural University (BAU), Ranchi",
        "department_id": "bau-agri-eng",
        "department_name": "Agricultural Engineering",
        "domains": ["Farm Mechanization", "Precision Irrigation", "Solar Pumping"],
        "capabilities": ["Farm Automation", "Soil Moisture Irrigation", "Solar Powered Machinery"],
        "keywords": ["farm", "irrigation", "farmer", "crop", "soil moisture", "watering", "agriculture", "harvest", "solar pump", "drip irrigation"],
    },
    {
        "university_id": "bau-ranchi",
        "university_name": "Birsa Agricultural University (BAU), Ranchi",
        "department_id": "bau-soil-water",
        "department_name": "Soil & Water Engineering",
        "domains": ["Water Conservation", "Soil Erosion", "Embankment Protection"],
        "capabilities": ["Riverbank Protection", "Earthen Bund Stabilization", "Rainwater Harvesting"],
        "keywords": ["erosion", "soil erosion", "riverbank", "bund", "embankment", "wash away", "check dam", "watershed"],
    },
    {
        "university_id": "bau-ranchi",
        "university_name": "Birsa Agricultural University (BAU), Ranchi",
        "department_id": "bau-agronomy",
        "department_name": "Agronomy",
        "domains": ["Crop Health", "Soil Fertility", "Sustainable Farming"],
        "capabilities": ["Soil Nutrient Profiling", "Organic Crop Protection", "Seed Technologies"],
        "keywords": ["soil health", "crop disease", "fertilizer", "drought", "pest", "nutrients"],
    },
    {
        "university_id": "bau-ranchi",
        "university_name": "Birsa Agricultural University (BAU), Ranchi",
        "department_id": "bau-agri-sciences",
        "department_name": "Agricultural Sciences",
        "domains": ["Plant Pathology", "Post-Harvest Storage"],
        "capabilities": ["Crop Diagnostics", "Bio-Pesticides", "Cold Storage Preservation"],
        "keywords": ["spoilage", "storage", "grain", "post harvest", "fungal", "cold storage"],
    },
]


def match_report_to_department(title: str, description: str, locality: str = "") -> dict[str, object]:
    combined_text = f"{title} {description} {locality}".lower()

    scored = []
    for dept in DEPARTMENT_PROFILES:
        hits = 0
        matched_kw = []
        for kw in dept["keywords"]:
            if kw in combined_text:
                hits += 3
                matched_kw.append(kw)
        for domain in dept["domains"]:
            if domain.lower() in combined_text:
                hits += 4
        for cap in dept["capabilities"]:
            for word in cap.lower().split():
                if len(word) > 3 and word in combined_text:
                    hits += 2

        if "dhanbad" in locality.lower() and dept["university_id"] == "iit-ism-dhanbad":
            hits += 2
        if "jamshedpur" in locality.lower() and dept["university_id"] == "nit-jamshedpur":
            hits += 2
        if "ranchi" in locality.lower() and dept["university_id"] in ("bit-mesra", "bau-ranchi"):
            hits += 2

        dynamic_score = min(96.0, max(55.0, round(62.0 + hits * 2.8, 1)))
        scored.append((dynamic_score, dept, matched_kw))

    scored.sort(key=lambda item: item[0], reverse=True)
    primary_score, primary_dept, primary_kw = scored[0]
    secondary_matches = [
        {
            "university_id": s_dept["university_id"],
            "university_name": s_dept["university_name"],
            "department_id": s_dept["department_id"],
            "department_name": s_dept["department_name"],
            "score": s_score,
            "reason": f"Relevant technical expertise in {s_dept['domains'][0]}.",
        }
        for s_score, s_dept, _ in scored[1:3]
    ]

    reason = (
        f"Dynamic match score of {primary_score}%: Direct alignment with {primary_dept['university_name']}'s "
        f"{primary_dept['department_name']} capabilities in {', '.join(primary_dept['domains'][:2])}."
    )

    return {
        "matched_university": primary_dept["university_name"],
        "matched_university_id": primary_dept["university_id"],
        "matched_department": primary_dept["department_name"],
        "matched_department_id": primary_dept["department_id"],
        "matching_score": primary_score,
        "matching_reason": reason,
        "secondary_matches": secondary_matches,
    }