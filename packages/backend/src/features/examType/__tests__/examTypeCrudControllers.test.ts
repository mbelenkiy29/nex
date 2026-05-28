import { describe, it } from 'vitest';
import {
  runGeneratedCrudControllerLifecycle,
  seedCrudExam,
} from '../../../test/generatedCrudControllerTestUtils';
import { examTypeArchiveManyController } from '../controllers/examTypeArchiveManyController';
import { examTypeAutocompleteController } from '../controllers/examTypeAutocompleteController';
import { examTypeCreateController } from '../controllers/examTypeCreateController';
import { examTypeDeleteManyController } from '../controllers/examTypeDeleteManyController';
import { examTypeFindController } from '../controllers/examTypeFindController';
import { examTypeFindManyController } from '../controllers/examTypeFindManyController';
import { examTypeImporterController } from '../controllers/examTypeImporterController';
import { examTypeRestoreManyController } from '../controllers/examTypeRestoreManyController';
import { examTypeUpdateController } from '../controllers/examTypeUpdateController';

describe('ExamType generated CRUD controllers', () => {
  it('covers the generated CRUD lifecycle', async () => {
    await runGeneratedCrudControllerLifecycle({
      entityName: 'ExamType',
      modelKey: 'examType',
      listKey: 'examTypes',
      labelKey: 'name',
      createController: examTypeCreateController,
      findController: examTypeFindController,
      findManyController: examTypeFindManyController,
      autocompleteController: examTypeAutocompleteController,
      updateController: examTypeUpdateController,
      archiveManyController: examTypeArchiveManyController,
      restoreManyController: examTypeRestoreManyController,
      deleteManyController: examTypeDeleteManyController,
      importerController: examTypeImporterController,
      buildCreateInput: async (session, suffix) => {
        const exam = await seedCrudExam(session, suffix);

        return {
          name: `CRUD Exam Type ${suffix}`,
          description: `Exam type coverage ${suffix}`,
          type: 'quiz',
          questionCount: 10,
          timeLimitMinutes: 20,
          passingScore: 70,
          maxAttempts: 3,
          shuffleQuestions: true,
          showAnswersImmediately: false,
          isActive: true,
          exam: exam.id,
        };
      },
      buildUpdateInput: async (_session, suffix) => ({
        name: `Updated Exam Type ${suffix}`,
      }),
      listFilter: (label) => ({ name: label }),
    });
  });
});
