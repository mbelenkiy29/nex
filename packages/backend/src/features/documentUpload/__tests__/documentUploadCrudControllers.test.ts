import { describe, it } from 'vitest';
import {
  runGeneratedCrudControllerLifecycle,
  seedCrudExam,
} from '../../../test/generatedCrudControllerTestUtils';
import { documentUploadArchiveManyController } from '../controllers/documentUploadArchiveManyController';
import { documentUploadAutocompleteController } from '../controllers/documentUploadAutocompleteController';
import { documentUploadCreateController } from '../controllers/documentUploadCreateController';
import { documentUploadDeleteManyController } from '../controllers/documentUploadDeleteManyController';
import { documentUploadFindController } from '../controllers/documentUploadFindController';
import { documentUploadFindManyController } from '../controllers/documentUploadFindManyController';
import { documentUploadImporterController } from '../controllers/documentUploadImporterController';
import { documentUploadRestoreManyController } from '../controllers/documentUploadRestoreManyController';
import { documentUploadUpdateController } from '../controllers/documentUploadUpdateController';

describe('DocumentUpload generated CRUD controllers', () => {
  it('covers the generated CRUD lifecycle', async () => {
    await runGeneratedCrudControllerLifecycle({
      entityName: 'DocumentUpload',
      modelKey: 'documentUpload',
      listKey: 'documentUploads',
      labelKey: 'originalFilename',
      createController: documentUploadCreateController,
      findController: documentUploadFindController,
      findManyController: documentUploadFindManyController,
      autocompleteController: documentUploadAutocompleteController,
      updateController: documentUploadUpdateController,
      archiveManyController: documentUploadArchiveManyController,
      restoreManyController: documentUploadRestoreManyController,
      deleteManyController: documentUploadDeleteManyController,
      importerController: documentUploadImporterController,
      buildCreateInput: async (session, suffix) => {
        const exam = await seedCrudExam(session, suffix);

        return {
          originalFilename: `crud-document-${suffix}.pdf`,
          status: 'uploaded',
          pageCount: 12,
          wordCount: 1200,
          processingError: '',
          sourceFiles: [
            {
              key: `generated-crud/${suffix}.pdf`,
              name: `crud-document-${suffix}.pdf`,
              size: 1200,
              type: 'application/pdf',
            },
          ],
          exam: exam.id,
          uploadedBy: session.context.currentMember!.id,
        };
      },
      buildUpdateInput: async (_session, suffix) => ({
        originalFilename: `updated-crud-document-${suffix}.pdf`,
      }),
      listFilter: (label) => ({ originalFilename: label }),
    });
  });
});
