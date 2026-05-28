import { createAccessControl } from 'better-auth/plugins/access';

export interface StorageConfig {
  readonly id: string;
  readonly folder: string;
  readonly maxSizeInBytes: number;
  readonly publicRead?: boolean;
  readonly fileTypes?: string[];
  readonly roles: Array<keyof typeof rolesIds>;
}

type StorageRecord = Record<string, StorageConfig>;

function validateStorageKeys<T extends StorageRecord>(
  config: T & {
    [K in keyof T]: T[K] extends { id: infer ID }
      ? ID extends K
        ? T[K]
        : never
      : never;
  },
): T {
  return config;
}

export const accessControlStatement = {
  organization: ['read', 'update', 'delete'],
  member: [
    'create',
    'update',
    'delete',
    'read',
    'autocomplete',
    'import',
    'export',
  ],
  invitation: ['create', 'read', 'resend', 'cancel', 'export'],
  apiDocs: ['read'],
  apiKey: ['create', 'read', 'update', 'delete'],
  subscription: ['read', 'create', 'update'],
  auditLog: ['read', 'export'],
  chatbot: ['use'],
  mcp: ['use'],
  notification: ['read', 'create'],
  exam: [
    'import',
    'create',
    'update',
    'read',
    'autocomplete',
    'delete',
    'archive',
    'restore',
    'export',
  ],
  chapter: [
    'import',
    'create',
    'update',
    'read',
    'autocomplete',
    'delete',
    'archive',
    'restore',
    'export',
  ],
  lesson: [
    'import',
    'create',
    'update',
    'read',
    'autocomplete',
    'delete',
    'archive',
    'restore',
    'export',
  ],
  practiceQuestion: [
    'import',
    'create',
    'update',
    'read',
    'autocomplete',
    'delete',
    'archive',
    'restore',
    'export',
  ],
  concept: [
    'import',
    'create',
    'update',
    'read',
    'autocomplete',
    'delete',
    'archive',
    'restore',
    'export',
  ],
  examType: [
    'import',
    'create',
    'update',
    'read',
    'autocomplete',
    'delete',
    'archive',
    'restore',
    'export',
  ],
  examInstance: [
    'import',
    'create',
    'update',
    'read',
    'autocomplete',
    'delete',
    'archive',
    'restore',
    'export',
  ],
  dailyGoal: [
    'import',
    'create',
    'update',
    'read',
    'autocomplete',
    'delete',
    'archive',
    'restore',
    'export',
  ],
  studyNote: [
    'import',
    'create',
    'update',
    'read',
    'autocomplete',
    'delete',
    'archive',
    'restore',
    'export',
  ],
  documentUpload: [
    'import',
    'create',
    'update',
    'read',
    'autocomplete',
    'delete',
    'archive',
    'restore',
    'export',
  ],
  course: ['create', 'update', 'read', 'delete', 'enroll', 'manage'],
  creatorApplication: ['create', 'read', 'update'],
} as const;

export const accessControl = createAccessControl(accessControlStatement);

type Statements = typeof accessControl.statements;

export type PartialPermissions = {
  [K in keyof Statements]?: Statements[K] extends readonly (infer U)[]
    ? U[]
    : never;
};

const admin = accessControl.newRole({
  organization: ['read', 'update', 'delete'],
  member: [
    'create',
    'update',
    'delete',
    'read',
    'autocomplete',
    'import',
    'export',
  ],
  invitation: ['create', 'read', 'resend', 'cancel', 'export'],
  apiDocs: ['read'],
  apiKey: ['create', 'read', 'update', 'delete'],
  subscription: ['read', 'create', 'update'],
  auditLog: ['read', 'export'],
  chatbot: ['use'],
  mcp: ['use'],
  notification: ['read', 'create'],
  exam: [
    'import',
    'create',
    'update',
    'read',
    'autocomplete',
    'delete',
    'archive',
    'restore',
    'export',
  ],
  chapter: [
    'import',
    'create',
    'update',
    'read',
    'autocomplete',
    'delete',
    'archive',
    'restore',
    'export',
  ],
  lesson: [
    'import',
    'create',
    'update',
    'read',
    'autocomplete',
    'delete',
    'archive',
    'restore',
    'export',
  ],
  practiceQuestion: [
    'import',
    'create',
    'update',
    'read',
    'autocomplete',
    'delete',
    'archive',
    'restore',
    'export',
  ],
  concept: [
    'import',
    'create',
    'update',
    'read',
    'autocomplete',
    'delete',
    'archive',
    'restore',
    'export',
  ],
  examType: [
    'import',
    'create',
    'update',
    'read',
    'autocomplete',
    'delete',
    'archive',
    'restore',
    'export',
  ],
  examInstance: [
    'import',
    'create',
    'update',
    'read',
    'autocomplete',
    'delete',
    'export',
  ],
  dailyGoal: [
    'import',
    'create',
    'update',
    'read',
    'autocomplete',
    'delete',
    'export',
  ],
  studyNote: [
    'import',
    'create',
    'update',
    'read',
    'autocomplete',
    'delete',
    'archive',
    'restore',
    'export',
  ],
  documentUpload: [
    'import',
    'create',
    'update',
    'read',
    'autocomplete',
    'delete',
    'archive',
    'restore',
    'export',
  ],
  course: ['create', 'update', 'read', 'delete', 'enroll', 'manage'],
  creatorApplication: ['create', 'read', 'update'],
});

const member = accessControl.newRole({
  member: ['autocomplete'],
  subscription: ['read', 'create', 'update'],
  chatbot: ['use'],
  mcp: ['use'],
  notification: ['read'],
  exam: [
    'import',
    'create',
    'update',
    'read',
    'autocomplete',
    'delete',
    'archive',
    'restore',
    'export',
  ],
  chapter: [
    'import',
    'create',
    'update',
    'read',
    'autocomplete',
    'delete',
    'archive',
    'restore',
    'export',
  ],
  lesson: [
    'import',
    'create',
    'update',
    'read',
    'autocomplete',
    'delete',
    'archive',
    'restore',
    'export',
  ],
  practiceQuestion: [
    'import',
    'create',
    'update',
    'read',
    'autocomplete',
    'delete',
    'archive',
    'restore',
    'export',
  ],
  concept: [
    'import',
    'create',
    'update',
    'read',
    'autocomplete',
    'delete',
    'archive',
    'restore',
    'export',
  ],
  examType: [
    'import',
    'create',
    'update',
    'read',
    'autocomplete',
    'delete',
    'archive',
    'restore',
    'export',
  ],
  examInstance: [
    'import',
    'create',
    'update',
    'read',
    'autocomplete',
    'delete',
    'export',
  ],
  dailyGoal: [
    'import',
    'create',
    'update',
    'read',
    'autocomplete',
    'delete',
    'export',
  ],
  studyNote: [
    'import',
    'create',
    'update',
    'read',
    'autocomplete',
    'delete',
    'archive',
    'restore',
    'export',
  ],
  documentUpload: [
    'import',
    'create',
    'update',
    'read',
    'autocomplete',
    'delete',
    'archive',
    'restore',
    'export',
  ],
  course: ['read', 'enroll'],
  creatorApplication: ['create', 'read'],
});

export const roles = {
  admin,
  member,
} as const;

export const rolesIds = { admin: 'admin', member: 'member' } as const;

export const storage = validateStorageKeys({
  memberAvatars: {
    id: 'memberAvatars',
    folder: 'organization/:organizationId/member/avatars',
    maxSizeInBytes: 10_000_000,
    publicRead: true,
    fileTypes: ['image/*'],
    roles: [rolesIds.admin, rolesIds.member],
  },
  organizationLogos: {
    id: 'organizationLogos',
    folder: 'organization/:organizationId/logos',
    maxSizeInBytes: 5_000_000,
    publicRead: true,
    fileTypes: ['image/*'],
    roles: [rolesIds.admin],
  },
  documentUploadSourceFiles: {
    id: 'documentUploadSourceFiles',
    folder: 'organization/:organizationId/documentUpload/sourceFiles',
    maxSizeInBytes: 1_000_000_000,
    roles: [rolesIds.admin],
  },
  aiTutorAttachments: {
    id: 'aiTutorAttachments',
    folder: 'organization/:organizationId/ai-tutor/attachments',
    maxSizeInBytes: 10_000_000,
    fileTypes: [
      'text/plain',
      'text/markdown',
      'text/csv',
      'application/json',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    roles: [rolesIds.admin, rolesIds.member],
  },
  courseThumbnails: {
    id: 'courseThumbnails',
    folder: 'course/thumbnails',
    maxSizeInBytes: 10_000_000,
    publicRead: true,
    fileTypes: ['image/*'],
    // member is included so verified creators can upload via the Course Builder;
    // course-content association is ownership-checked in the builder controllers.
    roles: [rolesIds.admin, rolesIds.member],
  },
  courseVideos: {
    id: 'courseVideos',
    folder: 'course/videos',
    maxSizeInBytes: 2_000_000_000,
    fileTypes: ['video/*'],
    roles: [rolesIds.admin, rolesIds.member],
  },
  courseResources: {
    id: 'courseResources',
    folder: 'course/resources',
    maxSizeInBytes: 100_000_000,
    // Allowlist of resource types instructors can attach to a lesson.
    // Closes audit finding #11 (previously accepted ANY file, including
    // .exe / .html that could be served back as stored XSS). Matches the
    // narrower allowlist on creatorIdentityDocuments. If you need a new
    // type here, add the exact MIME — wildcards stay scoped to media.
    fileTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'text/csv',
      'text/markdown',
      'image/*',
      'video/*',
      'audio/*',
      'application/zip',
    ],
    roles: [rolesIds.admin, rolesIds.member],
  },
  courseAssignmentSubmissions: {
    id: 'courseAssignmentSubmissions',
    folder: 'course/assignment-submissions',
    maxSizeInBytes: 100_000_000,
    roles: [rolesIds.admin, rolesIds.member],
  },
  creatorIdentityDocuments: {
    id: 'creatorIdentityDocuments',
    folder:
      'organization/:organizationId/creator-application/identity-documents',
    maxSizeInBytes: 25_000_000,
    fileTypes: ['image/*', 'application/pdf'],
    roles: [rolesIds.admin, rolesIds.member],
  },
} as const);

export type StorageKey = keyof typeof storage;
export type StorageId = (typeof storage)[StorageKey]['id'];

export function hasStoragePermission(
  config: StorageConfig,
  context: { currentMember?: { role: string } | null },
): boolean {
  if (!context.currentMember) {
    return false;
  }

  return config.roles.includes(context.currentMember.role as any);
}
