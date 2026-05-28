import { describe, it } from 'vitest';
import { runGeneratedCrudControllerLifecycle } from '../../../test/generatedCrudControllerTestUtils';
import { studyNoteArchiveManyController } from '../controllers/studyNoteArchiveManyController';
import { studyNoteAutocompleteController } from '../controllers/studyNoteAutocompleteController';
import { studyNoteCreateController } from '../controllers/studyNoteCreateController';
import { studyNoteDeleteManyController } from '../controllers/studyNoteDeleteManyController';
import { studyNoteFindController } from '../controllers/studyNoteFindController';
import { studyNoteFindManyController } from '../controllers/studyNoteFindManyController';
import { studyNoteImporterController } from '../controllers/studyNoteImporterController';
import { studyNoteRestoreManyController } from '../controllers/studyNoteRestoreManyController';
import { studyNoteUpdateController } from '../controllers/studyNoteUpdateController';

describe('StudyNote generated CRUD controllers', () => {
  it('covers the generated CRUD lifecycle', async () => {
    await runGeneratedCrudControllerLifecycle({
      entityName: 'StudyNote',
      modelKey: 'studyNote',
      listKey: 'studyNotes',
      labelKey: 'title',
      createController: studyNoteCreateController,
      findController: studyNoteFindController,
      findManyController: studyNoteFindManyController,
      autocompleteController: studyNoteAutocompleteController,
      updateController: studyNoteUpdateController,
      archiveManyController: studyNoteArchiveManyController,
      restoreManyController: studyNoteRestoreManyController,
      deleteManyController: studyNoteDeleteManyController,
      importerController: studyNoteImporterController,
      buildCreateInput: async (session, suffix) => ({
        title: `CRUD Study Note ${suffix}`,
        content: `Study note coverage ${suffix}`,
        isFavorite: true,
        tags: ['crud', 'generated'],
        author: session.context.currentMember!.id,
      }),
      buildUpdateInput: async (_session, suffix) => ({
        title: `Updated Study Note ${suffix}`,
      }),
      listFilter: (label) => ({ title: label }),
    });
  });
});
