export const COURSE_AI_QUEUE = 'course-ai-generation';

export type CourseAiGenerationJobData = {
  kind: 'generate';
  jobId: string;
};
