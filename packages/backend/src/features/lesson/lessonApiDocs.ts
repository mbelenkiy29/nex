import { buildPaths } from '../../shared/openapi/routeToPath';
import { lessonAutocompleteApiDoc } from './controllers/lessonAutocompleteController';
import { lessonCreateApiDoc } from './controllers/lessonCreateController';
import { lessonDeleteManyApiDoc } from './controllers/lessonDeleteManyController';
import { lessonFindApiDoc } from './controllers/lessonFindController';
import { lessonFindManyApiDoc } from './controllers/lessonFindManyController';
import { lessonImportApiDoc } from './controllers/lessonImporterController';
import { lessonUpdateApiDoc } from './controllers/lessonUpdateController';
import { lessonArchiveManyApiDoc } from './controllers/lessonArchiveManyController';
import { lessonRestoreManyApiDoc } from './controllers/lessonRestoreManyController';

export function getLessonPaths() {
  return buildPaths('Lesson', [
    lessonAutocompleteApiDoc,
    lessonCreateApiDoc,
    lessonArchiveManyApiDoc,
    lessonRestoreManyApiDoc,
    lessonDeleteManyApiDoc,
    lessonFindApiDoc,
    lessonFindManyApiDoc,
    lessonUpdateApiDoc,
    lessonImportApiDoc,
  ]);
}
