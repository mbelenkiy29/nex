import { buildPaths } from '../../shared/openapi/routeToPath';
import { dailyGoalAutocompleteApiDoc } from './controllers/dailyGoalAutocompleteController';
import { dailyGoalCreateApiDoc } from './controllers/dailyGoalCreateController';
import { dailyGoalDeleteManyApiDoc } from './controllers/dailyGoalDeleteManyController';
import { dailyGoalFindApiDoc } from './controllers/dailyGoalFindController';
import { dailyGoalFindManyApiDoc } from './controllers/dailyGoalFindManyController';
import { dailyGoalImportApiDoc } from './controllers/dailyGoalImporterController';
import { dailyGoalUpdateApiDoc } from './controllers/dailyGoalUpdateController';
import { dailyGoalArchiveManyApiDoc } from './controllers/dailyGoalArchiveManyController';
import { dailyGoalRestoreManyApiDoc } from './controllers/dailyGoalRestoreManyController';

export function getDailyGoalPaths() {
  return buildPaths('DailyGoal', [
    dailyGoalAutocompleteApiDoc,
    dailyGoalCreateApiDoc,
    dailyGoalArchiveManyApiDoc,
    dailyGoalRestoreManyApiDoc,
    dailyGoalDeleteManyApiDoc,
    dailyGoalFindApiDoc,
    dailyGoalFindManyApiDoc,
    dailyGoalUpdateApiDoc,
    dailyGoalImportApiDoc,
  ]);
}
