import { describe, it } from 'vitest';
import {
  runGeneratedCrudControllerLifecycle,
  seedCrudExamType,
} from '../../../test/generatedCrudControllerTestUtils';
import { examInstanceArchiveManyController } from '../controllers/examInstanceArchiveManyController';
import { examInstanceAutocompleteController } from '../controllers/examInstanceAutocompleteController';
import { examInstanceCreateController } from '../controllers/examInstanceCreateController';
import { examInstanceDeleteManyController } from '../controllers/examInstanceDeleteManyController';
import { examInstanceFindController } from '../controllers/examInstanceFindController';
import { examInstanceFindManyController } from '../controllers/examInstanceFindManyController';
import { examInstanceImporterController } from '../controllers/examInstanceImporterController';
import { examInstanceRestoreManyController } from '../controllers/examInstanceRestoreManyController';
import { examInstanceUpdateController } from '../controllers/examInstanceUpdateController';

describe('ExamInstance generated CRUD controllers', () => {
  it('covers the generated CRUD lifecycle', async () => {
    await runGeneratedCrudControllerLifecycle({
      entityName: 'ExamInstance',
      modelKey: 'examInstance',
      listKey: 'examInstances',
      labelKey: 'status',
      createController: examInstanceCreateController,
      findController: examInstanceFindController,
      findManyController: examInstanceFindManyController,
      autocompleteController: examInstanceAutocompleteController,
      updateController: examInstanceUpdateController,
      archiveManyController: examInstanceArchiveManyController,
      restoreManyController: examInstanceRestoreManyController,
      deleteManyController: examInstanceDeleteManyController,
      importerController: examInstanceImporterController,
      buildCreateInput: async (session, suffix) => {
        const examType = await seedCrudExamType(session, suffix);

        return {
          status: 'in_progress',
          score: 80,
          passed: true,
          startedAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
          timeSpentSeconds: 600,
          examType: examType.id,
          student: session.context.currentMember!.id,
        };
      },
      buildUpdateInput: async () => ({
        status: 'completed',
      }),
      listFilter: (label) => ({ status: label }),
    });
  });
});
