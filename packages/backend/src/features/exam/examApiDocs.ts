import { buildPaths } from '../../shared/openapi/routeToPath';
import { examAutocompleteApiDoc } from './controllers/examAutocompleteController';
import { examCreateApiDoc } from './controllers/examCreateController';
import { examDeleteManyApiDoc } from './controllers/examDeleteManyController';
import { examFindApiDoc } from './controllers/examFindController';
import { examFindManyApiDoc } from './controllers/examFindManyController';
import { examImportApiDoc } from './controllers/examImporterController';
import { examUpdateApiDoc } from './controllers/examUpdateController';
import { examArchiveManyApiDoc } from './controllers/examArchiveManyController';
import { examRestoreManyApiDoc } from './controllers/examRestoreManyController';

export function getExamPaths() {
  return buildPaths('Exam', [
    examAutocompleteApiDoc,
    examCreateApiDoc,
    examArchiveManyApiDoc,
    examRestoreManyApiDoc,
    examDeleteManyApiDoc,
    examFindApiDoc,
    examFindManyApiDoc,
    examUpdateApiDoc,
    examImportApiDoc,
  ]);
}
