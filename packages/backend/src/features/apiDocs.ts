import { createDocument } from 'zod-openapi';
import { Dictionary } from '../translation/locales';
import { getApiKeyPaths } from './apiKey/apiKeyApiDocs';
import { getAuditLogPaths } from './auditLog/auditLogApiDocs';
import { getExamPaths } from './exam/examApiDocs';
import { getChapterPaths } from './chapter/chapterApiDocs';
import { getLessonPaths } from './lesson/lessonApiDocs';
import { getPracticeQuestionPaths } from './practiceQuestion/practiceQuestionApiDocs';
import { getConceptPaths } from './concept/conceptApiDocs';
import { getExamTypePaths } from './examType/examTypeApiDocs';
import { getExamInstancePaths } from './examInstance/examInstanceApiDocs';
import { getDailyGoalPaths } from './dailyGoal/dailyGoalApiDocs';
import { getStudyNotePaths } from './studyNote/studyNoteApiDocs';
import { getDocumentUploadPaths } from './documentUpload/documentUploadApiDocs';
import { getMemberPaths } from './member/memberApiDocs';
import { getOrganizationPaths } from './organization/organizationApiDocs';
import { getSubscriptionPaths } from './subscription/subscriptionApiDocs';
import { getUserPaths } from './user/userApiDocs';
import { env } from '../env';

export function buildApiDocs(dictionary: Dictionary) {
  const paths = {
    ...getApiKeyPaths(),
    ...getAuditLogPaths(),
    ...getExamPaths(),
    ...getChapterPaths(),
    ...getLessonPaths(),
    ...getPracticeQuestionPaths(),
    ...getConceptPaths(),
    ...getExamTypePaths(),
    ...getExamInstancePaths(),
    ...getDailyGoalPaths(),
    ...getStudyNotePaths(),
    ...getDocumentUploadPaths(),
    ...getMemberPaths(),
    ...getOrganizationPaths(),
    ...getSubscriptionPaths(),
    ...getUserPaths(),
  };

  const backendUrl = env.BACKEND_URL || '/';

  return createDocument({
    openapi: '3.1.1',
    info: {
      version: '1.0.0',
      title: dictionary.apiDocs.openapi.title,
    },
    servers: [
      {
        url: backendUrl,
        description: dictionary.apiDocs.openapi.serverDescription,
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
          description:
            dictionary.apiDocs.openapi.securitySchemes.apiKeyAuth.description,
        },
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          description:
            dictionary.apiDocs.openapi.securitySchemes.bearerAuth.description,
        },
      },
    },
    security: [
      {
        ApiKeyAuth: [],
      },
      {
        BearerAuth: [],
      },
    ],
    paths,
  });
}
