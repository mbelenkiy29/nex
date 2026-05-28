import { expect } from 'vitest';
import { auditLogOperations } from '../features/auditLog/auditLogOperations';
import { testPrismaClient } from './testPrismaClient';
import { createTestUserWithOrganization } from './testFactories';
import { createAuthenticatedContext } from './testUtils';
import type { AppContext } from '../shared/controller/appContext';
import type {
  Chapter,
  Exam,
  ExamType,
  PrismaClient,
} from '../prisma/generated/client';

type GeneratedCrudSession = {
  prisma: PrismaClient;
  context: AppContext;
};

type CrudRecord = Record<string, unknown>;
type RowWithId = CrudRecord & { id: string };
type Controller = unknown;

type GeneratedCrudLifecycleConfig = {
  entityName: string;
  modelKey: keyof PrismaClient;
  listKey: string;
  labelKey: string;
  createController: Controller;
  findController: Controller;
  findManyController: Controller;
  autocompleteController: Controller;
  updateController: Controller;
  archiveManyController: Controller;
  restoreManyController: Controller;
  deleteManyController: Controller;
  importerController: Controller;
  buildCreateInput: (
    session: GeneratedCrudSession,
    suffix: string,
  ) => Promise<CrudRecord>;
  buildUpdateInput: (
    session: GeneratedCrudSession,
    suffix: string,
  ) => Promise<CrudRecord>;
  listFilter: (label: string, row: CrudRecord) => CrudRecord;
};

export async function runGeneratedCrudControllerLifecycle(
  config: GeneratedCrudLifecycleConfig,
) {
  const session = await createGeneratedCrudSession();
  const suffix = crudSuffix(config.entityName);
  const createInput = await config.buildCreateInput(session, suffix);
  const created = await callController<RowWithId>(
    config.createController,
    createInput,
    session.context,
  );
  const initialLabel = String(created[config.labelKey]);

  expect(created.id).toBeTruthy();
  expect(initialLabel).toBe(String(createInput[config.labelKey]));

  await expectAuditLog(
    session.prisma,
    config.entityName,
    created.id,
    auditLogOperations.create,
  );

  const otherSession = await createGeneratedCrudSession();
  const otherInput = await config.buildCreateInput(otherSession, suffix);
  const otherCreated = await callController<RowWithId>(
    config.createController,
    otherInput,
    otherSession.context,
  );

  const found = await callController<RowWithId | null>(
    config.findController,
    { id: created.id },
    session.context,
  );
  expect(found?.id).toBe(created.id);

  const initialFilter = config.listFilter(initialLabel, created);
  const listed = await callController<{ count: number } & CrudRecord>(
    config.findManyController,
    { filter: initialFilter },
    session.context,
  );
  const listedIds = rowsFrom(listed, config.listKey).map((row) => row.id);
  expect(listed.count).toBe(1);
  expect(listedIds).toContain(created.id);
  expect(listedIds).not.toContain(otherCreated.id);

  const autocomplete = await callController<Array<RowWithId>>(
    config.autocompleteController,
    { search: initialLabel, take: 10 },
    session.context,
  );
  expect(autocomplete.map((row) => row.id)).toContain(created.id);

  const excluded = await callController<Array<RowWithId>>(
    config.autocompleteController,
    { search: initialLabel, exclude: [created.id], take: 10 },
    session.context,
  );
  expect(excluded.map((row) => row.id)).not.toContain(created.id);

  const updateInput = await config.buildUpdateInput(session, suffix);
  const updated = await callController<RowWithId>(
    config.updateController,
    { id: created.id },
    updateInput,
    session.context,
  );
  const updatedLabel = String(updateInput[config.labelKey]);
  expect(String(updated[config.labelKey])).toBe(updatedLabel);

  await expectAuditLog(
    session.prisma,
    config.entityName,
    created.id,
    auditLogOperations.update,
  );

  const updatedFilter = config.listFilter(updatedLabel, updated);
  const archived = await callController<{ count: number }>(
    config.archiveManyController,
    { ids: [created.id] },
    session.context,
  );
  expect(archived.count).toBe(1);

  const hiddenAfterArchive = await callController<
    { count: number } & CrudRecord
  >(config.findManyController, { filter: updatedFilter }, session.context);
  expect(
    rowsFrom(hiddenAfterArchive, config.listKey).map((row) => row.id),
  ).not.toContain(created.id);

  const visibleWhenArchivedRequested = await callController<
    { count: number } & CrudRecord
  >(
    config.findManyController,
    { filter: { ...updatedFilter, archived: 'true' } },
    session.context,
  );
  expect(
    rowsFrom(visibleWhenArchivedRequested, config.listKey).map((row) => row.id),
  ).toContain(created.id);

  const restored = await callController<{ count: number }>(
    config.restoreManyController,
    { ids: [created.id] },
    session.context,
  );
  expect(restored.count).toBe(1);

  const visibleAfterRestore = await callController<
    { count: number } & CrudRecord
  >(config.findManyController, { filter: updatedFilter }, session.context);
  expect(
    rowsFrom(visibleAfterRestore, config.listKey).map((row) => row.id),
  ).toContain(created.id);

  const deleted = await callController<{ count: number }>(
    config.deleteManyController,
    { ids: [created.id] },
    session.context,
  );
  expect(deleted.count).toBe(1);

  const model = session.prisma[config.modelKey] as {
    findUnique(args: { where: { id: string } }): Promise<unknown>;
  };
  await expect(
    model.findUnique({ where: { id: created.id } }),
  ).resolves.toBeNull();

  await expectAuditLog(
    session.prisma,
    config.entityName,
    created.id,
    auditLogOperations.delete,
  );

  const importHash = `${suffix}-import-hash`;
  const importInput = {
    ...(await config.buildCreateInput(session, `${suffix}-import`)),
    importHash,
  };
  const imported = await callController<
    Array<{ _status: string; _line: number; _errorMessages?: string[] }>
  >(
    config.importerController,
    [
      { ...importInput, _line: 1 },
      { ...importInput, _line: 2 },
    ],
    session.context,
  );
  expect(imported).toMatchObject([
    { _status: 'success', _line: 1 },
    { _status: 'error', _line: 2 },
  ]);
  expect(imported[1]._errorMessages?.length).toBeGreaterThan(0);
}

async function callController<T>(
  controller: Controller,
  ...args: Array<unknown>
): Promise<T> {
  return await (
    controller as (...controllerArgs: Array<unknown>) => Promise<T>
  )(...args);
}

function rowsFrom(source: CrudRecord, key: string): Array<RowWithId> {
  return source[key] as Array<RowWithId>;
}

export async function createGeneratedCrudSession(): Promise<GeneratedCrudSession> {
  const prisma = testPrismaClient();
  const suffix = crudSuffix('session').replace(/[^a-z0-9]/gi, '-');
  const { user, organization, member } = await createTestUserWithOrganization(
    {
      email: `generated-crud-${suffix}@example.com`,
    },
    {
      name: `Generated CRUD ${suffix}`,
      slug: `generated-crud-${suffix}`.slice(0, 60),
    },
  );

  return {
    prisma,
    context: createAuthenticatedContext(user, organization, member),
  };
}

export async function seedCrudExam(
  session: GeneratedCrudSession,
  suffix: string,
): Promise<Exam> {
  return session.prisma.exam.create({
    data: {
      organizationId: session.context.currentOrganization!.id,
      name: `Seed Exam ${suffix}`,
      code: crudCode('SE', suffix),
      isActive: true,
    },
  });
}

export async function seedCrudChapter(
  session: GeneratedCrudSession,
  suffix: string,
): Promise<Chapter> {
  const exam = await seedCrudExam(session, suffix);

  return session.prisma.chapter.create({
    data: {
      organizationId: session.context.currentOrganization!.id,
      examId: exam.id,
      title: `Seed Chapter ${suffix}`,
      chapterNumber: 1,
      orderIndex: 1,
      workflowStatus: 'draft',
      isPublished: true,
    },
  });
}

export async function seedCrudExamType(
  session: GeneratedCrudSession,
  suffix: string,
): Promise<ExamType> {
  const exam = await seedCrudExam(session, suffix);

  return session.prisma.examType.create({
    data: {
      organizationId: session.context.currentOrganization!.id,
      examId: exam.id,
      name: `Seed Exam Type ${suffix}`,
      type: 'quiz',
      questionCount: 10,
      passingScore: 70,
      isActive: true,
    },
  });
}

export function crudCode(prefix: string, suffix: string) {
  const compact = suffix
    .replace(/[^a-z0-9]/gi, '')
    .slice(-24)
    .toUpperCase();
  return `${prefix}-${compact}`;
}

function crudSuffix(entityName: string) {
  return `${entityName}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

async function expectAuditLog(
  prisma: PrismaClient,
  entityName: string,
  entityId: string,
  operation: string,
) {
  await expect(
    prisma.auditLog.findFirst({
      where: {
        entityName,
        entityId,
        operation,
      },
    }),
  ).resolves.toBeTruthy();
}
