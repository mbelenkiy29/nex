import { describe, it } from 'vitest';
import {
  runGeneratedCrudControllerLifecycle,
  seedCrudChapter,
} from '../../../test/generatedCrudControllerTestUtils';
import { lessonArchiveManyController } from '../controllers/lessonArchiveManyController';
import { lessonAutocompleteController } from '../controllers/lessonAutocompleteController';
import { lessonCreateController } from '../controllers/lessonCreateController';
import { lessonDeleteManyController } from '../controllers/lessonDeleteManyController';
import { lessonFindController } from '../controllers/lessonFindController';
import { lessonFindManyController } from '../controllers/lessonFindManyController';
import { lessonImporterController } from '../controllers/lessonImporterController';
import { lessonRestoreManyController } from '../controllers/lessonRestoreManyController';
import { lessonUpdateController } from '../controllers/lessonUpdateController';

describe('Lesson generated CRUD controllers', () => {
  it('covers the generated CRUD lifecycle', async () => {
    await runGeneratedCrudControllerLifecycle({
      entityName: 'Lesson',
      modelKey: 'lesson',
      listKey: 'lessons',
      labelKey: 'title',
      createController: lessonCreateController,
      findController: lessonFindController,
      findManyController: lessonFindManyController,
      autocompleteController: lessonAutocompleteController,
      updateController: lessonUpdateController,
      archiveManyController: lessonArchiveManyController,
      restoreManyController: lessonRestoreManyController,
      deleteManyController: lessonDeleteManyController,
      importerController: lessonImporterController,
      buildCreateInput: async (session, suffix) => {
        const chapter = await seedCrudChapter(session, suffix);

        return {
          title: `CRUD Lesson ${suffix}`,
          lessonNumber: 1,
          content: `Lesson coverage ${suffix}`,
          estimatedMinutes: 15,
          xpReward: 5,
          workflowStatus: 'draft',
          isPublished: true,
          chapter: chapter.id,
        };
      },
      buildUpdateInput: async (_session, suffix) => ({
        title: `Updated Lesson ${suffix}`,
      }),
      listFilter: (label) => ({ title: label }),
    });
  });
});
