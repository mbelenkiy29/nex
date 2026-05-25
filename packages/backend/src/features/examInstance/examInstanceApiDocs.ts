import { buildPaths } from '../../shared/openapi/routeToPath';
import { examInstanceAutocompleteApiDoc } from './controllers/examInstanceAutocompleteController';
import { examInstanceCreateApiDoc } from './controllers/examInstanceCreateController';
import { examInstanceDeleteManyApiDoc } from './controllers/examInstanceDeleteManyController';
import { examInstanceFindApiDoc } from './controllers/examInstanceFindController';
import { examInstanceFindManyApiDoc } from './controllers/examInstanceFindManyController';
import { examInstanceImportApiDoc } from './controllers/examInstanceImporterController';
import { examInstanceUpdateApiDoc } from './controllers/examInstanceUpdateController';
import { examInstanceArchiveManyApiDoc } from './controllers/examInstanceArchiveManyController';
import { examInstanceRestoreManyApiDoc } from './controllers/examInstanceRestoreManyController';

export function getExamInstancePaths() {
  return buildPaths('ExamInstance', [
    examInstanceAutocompleteApiDoc,
    examInstanceCreateApiDoc,
    examInstanceArchiveManyApiDoc,
    examInstanceRestoreManyApiDoc,
    examInstanceDeleteManyApiDoc,
    examInstanceFindApiDoc,
    examInstanceFindManyApiDoc,
    examInstanceUpdateApiDoc,
    examInstanceImportApiDoc,
  ]);
}
