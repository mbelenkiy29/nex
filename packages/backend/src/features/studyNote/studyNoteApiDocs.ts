import { buildPaths } from '../../shared/openapi/routeToPath';
import { studyNoteAutocompleteApiDoc } from './controllers/studyNoteAutocompleteController';
import { studyNoteCreateApiDoc } from './controllers/studyNoteCreateController';
import { studyNoteDeleteManyApiDoc } from './controllers/studyNoteDeleteManyController';
import { studyNoteFindApiDoc } from './controllers/studyNoteFindController';
import { studyNoteFindManyApiDoc } from './controllers/studyNoteFindManyController';
import { studyNoteImportApiDoc } from './controllers/studyNoteImporterController';
import { studyNoteUpdateApiDoc } from './controllers/studyNoteUpdateController';
import { studyNoteArchiveManyApiDoc } from './controllers/studyNoteArchiveManyController';
import { studyNoteRestoreManyApiDoc } from './controllers/studyNoteRestoreManyController';

export function getStudyNotePaths() {
  return buildPaths('StudyNote', [
    studyNoteAutocompleteApiDoc,
    studyNoteCreateApiDoc,
    studyNoteArchiveManyApiDoc,
    studyNoteRestoreManyApiDoc,
    studyNoteDeleteManyApiDoc,
    studyNoteFindApiDoc,
    studyNoteFindManyApiDoc,
    studyNoteUpdateApiDoc,
    studyNoteImportApiDoc,
  ]);
}
