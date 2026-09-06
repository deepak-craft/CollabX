import unittest

from app.services.duplicate_detection import find_duplicate_candidates
from app.services.embedding_service import build_embedding, cosine_similarity
from app.services.problem_structuring import _local_recommendation
from app.services.matching_service import _explanation


class WorkflowServiceTests(unittest.TestCase):
    def test_embedding_is_deterministic_and_similar_text_scores_high(self):
        first = build_embedding('IoT water sensors for drainage monitoring')
        second = build_embedding('IoT water sensors for drainage monitoring')
        related = build_embedding('Water drainage monitoring with IoT sensors')
        self.assertEqual(first, second)
        self.assertGreater(cosine_similarity(first, related), 0)

    def test_duplicate_detection_returns_candidates(self):
        candidates = find_duplicate_candidates(
            'Blocked drain floods the school road every monsoon',
            ['Blocked drain floods the school road every monsoon'],
        )
        self.assertEqual(len(candidates), 1)
        self.assertGreater(candidates[0] if isinstance(candidates, list) else max(candidates.values()), 0)

    def test_ai_fallback_is_structured_and_advisory(self):
        recommendation = _local_recommendation('Frequent flooding puts 120 students at risk every monsoon.')
        self.assertEqual(recommendation.affected_population, 120)
        self.assertIn(recommendation.priority_level, {'Low', 'Medium', 'High', 'Critical'})
        self.assertEqual(recommendation.model_config.get('extra'), 'forbid')

    def test_matching_explanation_is_recommendation_only(self):
        explanation = _explanation('IoT water management', 'IoT water management expertise', 80)
        self.assertIn('Strong match', explanation)
        self.assertIn('recommendation', explanation)
        self.assertIn('not an assignment', explanation)


if __name__ == '__main__':
    unittest.main()
