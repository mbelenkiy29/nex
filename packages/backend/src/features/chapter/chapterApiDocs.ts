import { buildPaths } from '../../shared/openapi/routeToPath';
import { chapterAutocompleteApiDoc } from './controllers/chapterAutocompleteController';
import { chapterCreateApiDoc } from './controllers/chapterCreateController';
import { chapterDeleteManyApiDoc } from './controllers/chapterDeleteManyController';
import { chapterFindApiDoc } from './controllers/chapterFindController';
import { chapterFindManyApiDoc } from './controllers/chapterFindManyController';
import { chapterImportApiDoc } from './controllers/chapterImporterController';
import { chapterUpdateApiDoc } from './controllers/chapterUpdateController';
import { chapterArchiveManyApiDoc } from './controllers/chapterArchiveManyController';
import { chapterRestoreManyApiDoc } from './controllers/chapterRestoreManyController';

export function getChapterPaths() {
  return buildPaths('Chapter', [
    chapterAutocompleteApiDoc,
    chapterCreateApiDoc,
    chapterArchiveManyApiDoc,
    chapterRestoreManyApiDoc,
    chapterDeleteManyApiDoc,
    chapterFindApiDoc,
    chapterFindManyApiDoc,
    chapterUpdateApiDoc,
    chapterImportApiDoc,
  ]);
}
