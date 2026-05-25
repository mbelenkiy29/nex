import { buildPaths } from '../../shared/openapi/routeToPath';
import { documentUploadAutocompleteApiDoc } from './controllers/documentUploadAutocompleteController';
import { documentUploadCreateApiDoc } from './controllers/documentUploadCreateController';
import { documentUploadDeleteManyApiDoc } from './controllers/documentUploadDeleteManyController';
import { documentUploadFindApiDoc } from './controllers/documentUploadFindController';
import { documentUploadFindManyApiDoc } from './controllers/documentUploadFindManyController';
import { documentUploadImportApiDoc } from './controllers/documentUploadImporterController';
import { documentUploadUpdateApiDoc } from './controllers/documentUploadUpdateController';
import { documentUploadArchiveManyApiDoc } from './controllers/documentUploadArchiveManyController';
import { documentUploadRestoreManyApiDoc } from './controllers/documentUploadRestoreManyController';

export function getDocumentUploadPaths() {
  return buildPaths('DocumentUpload', [
    documentUploadAutocompleteApiDoc,
    documentUploadCreateApiDoc,
    documentUploadArchiveManyApiDoc,
    documentUploadRestoreManyApiDoc,
    documentUploadDeleteManyApiDoc,
    documentUploadFindApiDoc,
    documentUploadFindManyApiDoc,
    documentUploadUpdateApiDoc,
    documentUploadImportApiDoc,
  ]);
}
