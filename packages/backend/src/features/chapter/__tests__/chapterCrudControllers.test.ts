import { describe, it } from 'vitest';
import {
  runGeneratedCrudControllerLifecycle,
  seedCrudExam,
} from '../../../test/generatedCrudControllerTestUtils';
import { chapterArchiveManyController } from '../controllers/chapterArchiveManyController';
import { chapterAutocompleteController } from '../controllers/chapterAutocompleteController';
import { chapterCreateController } from '../controllers/chapterCreateController';
import { chapterDeleteManyController } from '../controllers/chapterDeleteManyController';
import { chapterFindController } from '../controllers/chapterFindController';
import { chapterFindManyController } from '../controllers/chapterFindManyController';
import { chapterImporterController } from '../controllers/chapterImporterController';
import { chapterRestoreManyController } from '../controllers/chapterRestoreManyController';
import { chapterUpdateController } from '../controllers/chapterUpdateController';

describe('Chapter generated CRUD controllers', () => {
  it('covers the generated CRUD lifecycle', async () => {
    await runGeneratedCrudControllerLifecycle({
      entityName: 'Chapter',
      modelKey: 'chapter',
      listKey: 'chapters',
      labelKey: 'title',
      createController: chapterCreateController,
      findController: chapterFindController,
      findManyController: chapterFindManyController,
      autocompleteController: chapterAutocompleteController,
      updateController: chapterUpdateController,
      archiveManyController: chapterArchiveManyController,
      restoreManyController: chapterRestoreManyController,
      deleteManyController: chapterDeleteManyController,
      importerController: chapterImporterController,
      buildCreateInput: async (session, suffix) => {
        const exam = await seedCrudExam(session, suffix);

        return {
          title: `CRUD Chapter ${suffix}`,
          chapterNumber: 1,
          description: `Chapter coverage ${suffix}`,
          xpReward: 10,
          orderIndex: 1,
          workflowStatus: 'draft',
          isPublished: true,
          version: 1,
          objectives: ['Understand the generated CRUD contract'],
          exam: exam.id,
        };
      },
      buildUpdateInput: async (_session, suffix) => ({
        title: `Updated Chapter ${suffix}`,
      }),
      listFilter: (label) => ({ title: label }),
    });
  });
});
