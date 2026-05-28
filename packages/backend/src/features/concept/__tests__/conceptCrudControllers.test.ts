import { describe, it } from 'vitest';
import {
  crudCode,
  runGeneratedCrudControllerLifecycle,
  seedCrudExam,
} from '../../../test/generatedCrudControllerTestUtils';
import { conceptArchiveManyController } from '../controllers/conceptArchiveManyController';
import { conceptAutocompleteController } from '../controllers/conceptAutocompleteController';
import { conceptCreateController } from '../controllers/conceptCreateController';
import { conceptDeleteManyController } from '../controllers/conceptDeleteManyController';
import { conceptFindController } from '../controllers/conceptFindController';
import { conceptFindManyController } from '../controllers/conceptFindManyController';
import { conceptImporterController } from '../controllers/conceptImporterController';
import { conceptRestoreManyController } from '../controllers/conceptRestoreManyController';
import { conceptUpdateController } from '../controllers/conceptUpdateController';

describe('Concept generated CRUD controllers', () => {
  it('covers the generated CRUD lifecycle', async () => {
    await runGeneratedCrudControllerLifecycle({
      entityName: 'Concept',
      modelKey: 'concept',
      listKey: 'concepts',
      labelKey: 'conceptName',
      createController: conceptCreateController,
      findController: conceptFindController,
      findManyController: conceptFindManyController,
      autocompleteController: conceptAutocompleteController,
      updateController: conceptUpdateController,
      archiveManyController: conceptArchiveManyController,
      restoreManyController: conceptRestoreManyController,
      deleteManyController: conceptDeleteManyController,
      importerController: conceptImporterController,
      buildCreateInput: async (session, suffix) => {
        const exam = await seedCrudExam(session, suffix);

        return {
          conceptName: `CRUD Concept ${suffix}`,
          conceptCode: crudCode('CO', suffix),
          conceptDescription: `Concept coverage ${suffix}`,
          explanation: `Generated CRUD concept explanation ${suffix}`,
          examDomain: 'Generated CRUD',
          difficulty: 'intermediate',
          examWeight: 'medium',
          typicalMistakes: ['Skipping controller assertions'],
          examTips: ['Exercise the full lifecycle'],
          isActive: true,
          exam: exam.id,
        };
      },
      buildUpdateInput: async (_session, suffix) => ({
        conceptName: `Updated Concept ${suffix}`,
      }),
      listFilter: (label) => ({ conceptName: label }),
    });
  });
});
