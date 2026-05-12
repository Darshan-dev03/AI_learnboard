/**
 * Course Content Generator
 * Generates detailed course content with varying depth based on course type (free vs paid)
 */

export interface ContentDepth {
  notesCount: number;
  keyPointsPerNote: number;
  codeExamplesPerNote: number;
  quizQuestionsCount: number;
  detailLevel: 'basic' | 'intermediate' | 'advanced';
}

export const FREE_COURSE_DEPTH: ContentDepth = {
  notesCount: 4,
  keyPointsPerNote: 3,
  codeExamplesPerNote: 1,
  quizQuestionsCount: 4,
  detailLevel: 'basic'
};

export const PAID_COURSE_DEPTH: ContentDepth = {
  notesCount: 8,
  keyPointsPerNote: 5,
  codeExamplesPerNote: 3,
  quizQuestionsCount: 10,
  detailLevel: 'advanced'
};

/**
 * Determines content depth based on course pricing
 */
export function getContentDepth(isFree: boolean, priceInr: number): ContentDepth {
  if (isFree || priceInr === 0) {
    return FREE_COURSE_DEPTH;
  }
  
  // Premium courses get more content
  if (priceInr >= 1000) {
    return {
      notesCount: 10,
      keyPointsPerNote: 6,
      codeExamplesPerNote: 4,
      quizQuestionsCount: 15,
      detailLevel: 'advanced'
    };
  }
  
  return PAID_COURSE_DEPTH;
}

/**
 * Generates a content quality badge for display
 */
export function getContentBadge(depth: ContentDepth): string {
  if (depth.detailLevel === 'advanced') {
    return '🏆 Premium Content - In-depth coverage with advanced examples';
  }
  if (depth.detailLevel === 'intermediate') {
    return '⭐ Standard Content - Comprehensive learning materials';
  }
  return '📚 Essential Content - Core concepts covered';
}

/**
 * Calculates estimated learning time based on content depth
 */
export function estimateLearningTime(depth: ContentDepth): string {
  const baseMinutes = depth.notesCount * 15; // 15 min per note
  const quizMinutes = depth.quizQuestionsCount * 2; // 2 min per question
  const totalMinutes = baseMinutes + quizMinutes;
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
