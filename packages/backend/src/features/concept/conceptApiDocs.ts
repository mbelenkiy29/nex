import { buildPaths } from '../../shared/openapi/routeToPath';
import { conceptAutocompleteApiDoc } from './controllers/conceptAutocompleteController';
import { conceptCreateApiDoc } from './controllers/conceptCreateController';
import { conceptDeleteManyApiDoc } from './controllers/conceptDeleteManyController';
import { conceptFindApiDoc } from './controllers/conceptFindController';
import { conceptFindManyApiDoc } from './controllers/conceptFindManyController';
import { conceptImportApiDoc } from './controllers/conceptImporterController';
import { conceptUpdateApiDoc } from './controllers/conceptUpdateController';
import { conceptArchiveManyApiDoc } from './controllers/conceptArchiveManyController';
import { conceptRestoreManyApiDoc } from './controllers/conceptRestoreManyController';

export function getConceptPaths() {
  return buildPaths('Concept', [
    conceptAutocompleteApiDoc,
    conceptCreateApiDoc,
    conceptArchiveManyApiDoc,
    conceptRestoreManyApiDoc,
    conceptDeleteManyApiDoc,
    conceptFindApiDoc,
    conceptFindManyApiDoc,
    conceptUpdateApiDoc,
    conceptImportApiDoc,
  ]);
}
