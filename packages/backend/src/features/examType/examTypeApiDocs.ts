import { buildPaths } from '../../shared/openapi/routeToPath';
import { examTypeAutocompleteApiDoc } from './controllers/examTypeAutocompleteController';
import { examTypeCreateApiDoc } from './controllers/examTypeCreateController';
import { examTypeDeleteManyApiDoc } from './controllers/examTypeDeleteManyController';
import { examTypeFindApiDoc } from './controllers/examTypeFindController';
import { examTypeFindManyApiDoc } from './controllers/examTypeFindManyController';
import { examTypeImportApiDoc } from './controllers/examTypeImporterController';
import { examTypeUpdateApiDoc } from './controllers/examTypeUpdateController';
import { examTypeArchiveManyApiDoc } from './controllers/examTypeArchiveManyController';
import { examTypeRestoreManyApiDoc } from './controllers/examTypeRestoreManyController';

export function getExamTypePaths() {
  return buildPaths('ExamType', [
    examTypeAutocompleteApiDoc,
    examTypeCreateApiDoc,
    examTypeArchiveManyApiDoc,
    examTypeRestoreManyApiDoc,
    examTypeDeleteManyApiDoc,
    examTypeFindApiDoc,
    examTypeFindManyApiDoc,
    examTypeUpdateApiDoc,
    examTypeImportApiDoc,
  ]);
}
