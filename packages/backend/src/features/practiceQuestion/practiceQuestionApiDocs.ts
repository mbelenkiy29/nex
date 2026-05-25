import { buildPaths } from '../../shared/openapi/routeToPath';
import { practiceQuestionAutocompleteApiDoc } from './controllers/practiceQuestionAutocompleteController';
import { practiceQuestionCreateApiDoc } from './controllers/practiceQuestionCreateController';
import { practiceQuestionDeleteManyApiDoc } from './controllers/practiceQuestionDeleteManyController';
import { practiceQuestionFindApiDoc } from './controllers/practiceQuestionFindController';
import { practiceQuestionFindManyApiDoc } from './controllers/practiceQuestionFindManyController';
import { practiceQuestionImportApiDoc } from './controllers/practiceQuestionImporterController';
import { practiceQuestionUpdateApiDoc } from './controllers/practiceQuestionUpdateController';
import { practiceQuestionArchiveManyApiDoc } from './controllers/practiceQuestionArchiveManyController';
import { practiceQuestionRestoreManyApiDoc } from './controllers/practiceQuestionRestoreManyController';

export function getPracticeQuestionPaths() {
  return buildPaths('PracticeQuestion', [
    practiceQuestionAutocompleteApiDoc,
    practiceQuestionCreateApiDoc,
    practiceQuestionArchiveManyApiDoc,
    practiceQuestionRestoreManyApiDoc,
    practiceQuestionDeleteManyApiDoc,
    practiceQuestionFindApiDoc,
    practiceQuestionFindManyApiDoc,
    practiceQuestionUpdateApiDoc,
    practiceQuestionImportApiDoc,
  ]);
}
