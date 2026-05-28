import { describe, it } from 'vitest';
import { runGeneratedCrudControllerLifecycle } from '../../../test/generatedCrudControllerTestUtils';
import { dailyGoalArchiveManyController } from '../controllers/dailyGoalArchiveManyController';
import { dailyGoalAutocompleteController } from '../controllers/dailyGoalAutocompleteController';
import { dailyGoalCreateController } from '../controllers/dailyGoalCreateController';
import { dailyGoalDeleteManyController } from '../controllers/dailyGoalDeleteManyController';
import { dailyGoalFindController } from '../controllers/dailyGoalFindController';
import { dailyGoalFindManyController } from '../controllers/dailyGoalFindManyController';
import { dailyGoalImporterController } from '../controllers/dailyGoalImporterController';
import { dailyGoalRestoreManyController } from '../controllers/dailyGoalRestoreManyController';
import { dailyGoalUpdateController } from '../controllers/dailyGoalUpdateController';

describe('DailyGoal generated CRUD controllers', () => {
  it('covers the generated CRUD lifecycle', async () => {
    await runGeneratedCrudControllerLifecycle({
      entityName: 'DailyGoal',
      modelKey: 'dailyGoal',
      listKey: 'dailyGoals',
      labelKey: 'title',
      createController: dailyGoalCreateController,
      findController: dailyGoalFindController,
      findManyController: dailyGoalFindManyController,
      autocompleteController: dailyGoalAutocompleteController,
      updateController: dailyGoalUpdateController,
      archiveManyController: dailyGoalArchiveManyController,
      restoreManyController: dailyGoalRestoreManyController,
      deleteManyController: dailyGoalDeleteManyController,
      importerController: dailyGoalImporterController,
      buildCreateInput: async (session, suffix) => ({
        title: `CRUD Daily Goal ${suffix}`,
        goalType: 'study_minutes',
        targetValue: 30,
        currentValue: 5,
        xpReward: 10,
        goalDate: '2026-05-26',
        owner: session.context.currentMember!.id,
      }),
      buildUpdateInput: async (_session, suffix) => ({
        title: `Updated Daily Goal ${suffix}`,
      }),
      listFilter: (label) => ({ title: label }),
    });
  });
});
