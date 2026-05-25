export const STUDENT_STUDY_REMINDER_QUEUE = 'student-study-reminder';
export const STUDENT_STUDY_REMINDER_CRON = '*/30 * * * *';

export type StudentStudyReminderJobData = {
  kind: 'smartSweep';
};
