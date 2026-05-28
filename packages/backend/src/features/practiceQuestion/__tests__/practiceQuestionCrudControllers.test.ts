import { describe, it } from 'vitest';
import {
  runGeneratedCrudControllerLifecycle,
  seedCrudChapter,
} from '../../../test/generatedCrudControllerTestUtils';
import { practiceQuestionArchiveManyController } from '../controllers/practiceQuestionArchiveManyController';
import { practiceQuestionAutocompleteController } from '../controllers/practiceQuestionAutocompleteController';
import { practiceQuestionCreateController } from '../controllers/practiceQuestionCreateController';
import { practiceQuestionDeleteManyController } from '../controllers/practiceQuestionDeleteManyController';
import { practiceQuestionFindController } from '../controllers/practiceQuestionFindController';
import { practiceQuestionFindManyController } from '../controllers/practiceQuestionFindManyController';
import { practiceQuestionImporterController } from '../controllers/practiceQuestionImporterController';
import { practiceQuestionRestoreManyController } from '../controllers/practiceQuestionRestoreManyController';
import { practiceQuestionUpdateController } from '../controllers/practiceQuestionUpdateController';

describe('PracticeQuestion generated CRUD controllers', () => {
  it('covers the generated CRUD lifecycle', async () => {
    await runGeneratedCrudControllerLifecycle({
      entityName: 'PracticeQuestion',
      modelKey: 'practiceQuestion',
      listKey: 'practiceQuestions',
      labelKey: 'questionText',
      createController: practiceQuestionCreateController,
      findController: practiceQuestionFindController,
      findManyController: practiceQuestionFindManyController,
      autocompleteController: practiceQuestionAutocompleteController,
      updateController: practiceQuestionUpdateController,
      archiveManyController: practiceQuestionArchiveManyController,
      restoreManyController: practiceQuestionRestoreManyController,
      deleteManyController: practiceQuestionDeleteManyController,
      importerController: practiceQuestionImporterController,
      buildCreateInput: async (session, suffix) => {
        const chapter = await seedCrudChapter(session, suffix);

        return {
          questionText: `Which generated CRUD path is covered by ${suffix}?`,
          correctAnswerIndex: 0,
          answerOptions: ['Create and read', 'Only render UI'],
          explanation: `Practice coverage ${suffix}`,
          difficulty: 'medium',
          category: 'Generated CRUD',
          isActive: true,
          tags: ['crud', 'generated'],
          chapter: chapter.id,
        };
      },
      buildUpdateInput: async (_session, suffix) => ({
        questionText: `Which generated CRUD path was updated by ${suffix}?`,
      }),
      listFilter: (label) => ({ questionText: label }),
    });
  });
});
