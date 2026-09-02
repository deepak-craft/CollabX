import { AIProblemAnalysis, AIScores, Challenge, IndustryPartner, ProblemReport } from '../types';

export class AIEngineService {
  /**
   * Deterministic AI Problem Analyzer:
   * Classifies civic reports, estimates severity, identifies potential duplicates, and highlights affected groups.
   */
  static analyzeProblem(
    title: string,
    description: string,
    locality: string,
    existingProblems: ProblemReport[] = []
  ): AIProblemAnalysis {
    const text = `${title} ${description} ${locality}`.toLowerCase();

    let category = 'Urban Infrastructure & Public Works';
    let severity = 65;
    let priority: 'Low' | 'Medium' | 'High' | 'Critical' = 'Medium';
    const affectedGroups: string[] = ['Local residents', 'Pedestrians'];
    let rationale = 'Routine civic grievance requiring municipal works inspection.';

    if (
      text.includes('water') ||
      text.includes('flood') ||
      text.includes('monsoon') ||
      text.includes('drain') ||
      text.includes('culvert') ||
      text.includes('nullah') ||
      text.includes('submerged')
    ) {
      category = 'Disaster Management / Water Management';
      severity = 86;
      priority = 'High';
      affectedGroups.push('School children', 'Daily commuters', 'Local market vendors');
      rationale = 'High monsoonal severity: Recurrent stagnation causes arterial vehicular cut-off and elevated vector-borne public health risk.';
    } else if (
      text.includes('river') ||
      text.includes('erosion') ||
      text.includes('bund') ||
      text.includes('crop') ||
      text.includes('farm') ||
      text.includes('soil')
    ) {
      category = 'Agriculture & Soil Conservation';
      severity = 78;
      priority = 'High';
      affectedGroups.push('Smallholder farmers', 'Tribal agrarian hamlets');
      rationale = 'Ecological hazard: Threatens productive agricultural acreage and community earthen protection bunds.';
    } else if (
      text.includes('power') ||
      text.includes('wire') ||
      text.includes('transformer') ||
      text.includes('electricity')
    ) {
      category = 'Energy & Power Distribution';
      severity = 74;
      priority = 'High';
      affectedGroups.push('Households', 'Commercial shops');
      rationale = 'Safety risk: Exposed high-tension components during monsoonal storm gusts.';
    } else if (
      text.includes('bridge') ||
      text.includes('crack') ||
      text.includes('collapse') ||
      text.includes('underpass')
    ) {
      category = 'Transportation & Structural Safety';
      severity = 91;
      priority = 'Critical';
      affectedGroups.push('Emergency services', 'Public transit commuters');
      rationale = 'Critical structural hazard with potential for catastrophic transit failure.';
    }

    // Duplicate Detection Logic:
    let duplicateSimilarity = 12;
    let duplicateCandidateId: string | undefined;
    let duplicateCandidateTitle: string | undefined;

    for (const p of existingProblems) {
      const pText = `${p.title} ${p.description} ${p.panchayatOrLocality}`.toLowerCase();
      let matchCount = 0;
      const keywords = ['harmu', 'drain', 'water', 'flood', 'culvert', 'monsoon', 'nullah', 'bypass', 'underpass'];
      
      keywords.forEach(kw => {
        if (text.includes(kw) && pText.includes(kw)) {
          matchCount++;
        }
      });

      if (matchCount >= 3) {
        duplicateSimilarity = Math.min(95, 60 + matchCount * 9);
        duplicateCandidateId = p.id;
        duplicateCandidateTitle = p.title;
        break;
      }
    }

    return {
      category,
      severity,
      priority,
      duplicateSimilarity,
      duplicateCandidateId,
      duplicateCandidateTitle,
      affectedGroups,
      confidence: 0.93,
      rationale,
      analyzedAt: new Date().toISOString(),
    };
  }

  /**
   * Deterministic AI Idea Evaluator:
   * Scores university proposals across 6 GovTech parameters to provide decision support for Domain Experts.
   */
  static evaluateIdea(
    problemUnderstanding: string,
    proposedSolution: string,
    techStack: string[],
    estimatedCost: number
  ): AIScores {
    const combined = `${problemUnderstanding} ${proposedSolution} ${techStack.join(' ')}`.toLowerCase();

    let feasibility = 80;
    let socialImpact = 82;
    let costEfficiency = 80;
    let scalability = 80;
    let sustainability = 80;
    let technicalSuitability = 82;
    let aiRemarks = 'Viable GovTech proposal with balanced operational parameters.';

    // Check for smart multidisciplinary factors
    if (combined.includes('siphon') || combined.includes('gravity')) {
      feasibility += 8;
      sustainability += 7;
      aiRemarks = 'Strong passive hydraulic mechanism reduces energy dependency during thunderstorm outages.';
    }

    if (combined.includes('iot') || combined.includes('sensor') || combined.includes('lora')) {
      technicalSuitability += 8;
      scalability += 6;
    }

    if (combined.includes('drone') || combined.includes('robot')) {
      technicalSuitability += 5;
      feasibility -= 7;
      costEfficiency -= 12;
      aiRemarks = 'High-tech robotics demonstration, but mechanical maintenance and capital expenditure are elevated for rural local bodies.';
    }

    // Cost efficiency adjustment based on ₹4.5 Lakh benchmark
    if (estimatedCost > 500000) {
      costEfficiency -= 14;
    } else if (estimatedCost < 400000) {
      costEfficiency += 8;
    }

    if (combined.includes('resident') || combined.includes('school') || combined.includes('bypass')) {
      socialImpact += 9;
    }

    // Cap between 50 and 98
    const clamp = (val: number) => Math.max(50, Math.min(98, val));

    feasibility = clamp(feasibility);
    socialImpact = clamp(socialImpact);
    costEfficiency = clamp(costEfficiency);
    scalability = clamp(scalability);
    sustainability = clamp(sustainability);
    technicalSuitability = clamp(technicalSuitability);

    const compositeScore = Math.round(
      (feasibility * 0.25 +
        socialImpact * 0.25 +
        costEfficiency * 0.15 +
        scalability * 0.15 +
        sustainability * 0.10 +
        technicalSuitability * 0.10)
    );

    return {
      feasibility,
      socialImpact,
      costEfficiency,
      scalability,
      sustainability,
      technicalSuitability,
      compositeScore,
      aiRemarks,
    };
  }

  /**
   * Smart Matching between Industry Partner and Challenge:
   */
  static calculateIndustryMatch(challenge: Challenge, partner: IndustryPartner): number {
    let score = 70;
    const challengeText = `${challenge.domain} ${challenge.skillsRequired.join(' ')} ${challenge.summary}`.toLowerCase();

    partner.technologies.forEach(t => {
      if (challengeText.includes(t.toLowerCase().split(' ')[0])) score += 6;
    });

    partner.capabilities.forEach(c => {
      if (challengeText.includes(c.toLowerCase().split(' ')[0])) score += 5;
    });

    if (partner.location.toLowerCase().includes(challenge.district.toLowerCase())) {
      score += 8;
    }

    return Math.min(96, Math.max(65, score));
  }
}
