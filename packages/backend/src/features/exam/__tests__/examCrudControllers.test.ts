import { describe, it } from 'vitest';
import {
  crudCode,
  runGeneratedCrudControllerLifecycle,
} from '../../../test/generatedCrudControllerTestUtils';
import { examArchiveManyController } from '../controllers/examArchiveManyController';
import { examAutocompleteController } from '../controllers/examAutocompleteController';
import { examCreateController } from '../controllers/examCreateController';
import { examDeleteManyController } from '../controllers/examDeleteManyController';
import { examFindController } from '../controllers/examFindController';
import { examFindManyController } from '../controllers/examFindManyController';
import { examImporterController } from '../controllers/examImporterController';
import { examRestoreManyController } from '../controllers/examRestoreManyController';
import { examUpdateController } from '../controllers/examUpdateController';

describe('Exam generated CRUD controllers', () => {
  it('covers the generated CRUD lifecycle', async () => {
    await runGeneratedCrudControllerLifecycle({
      entityName: 'Exam',
      modelKey: 'exam',
      listKey: 'exams',
      labelKey: 'name',
      createController: examCreateController,
      findController: examFindController,
      findManyController: examFindManyController,
      autocompleteController: examAutocompleteController,
      updateController: examUpdateController,
      archiveManyController: examArchiveManyController,
      restoreManyController: examRestoreManyController,
      deleteManyController: examDeleteManyController,
      importerController: examImporterController,
      buildCreateInput: async (_session, suffix) => ({
        name: `CRUD Exam ${suffix}`,
        code: crudCode('EX', suffix),
        description: `Exam coverage ${suffix}`,
        isActive: true,
      }),
      buildUpdateInput: async (_session, suffix) => ({
        name: `Updated Exam ${suffix}`,
      }),
      listFilter: (label) => ({ name: label }),
    });
  });
});
