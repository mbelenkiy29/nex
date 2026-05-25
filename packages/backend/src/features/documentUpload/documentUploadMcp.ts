import { Dictionary } from '../../translation/locales';
import { McpTool } from '../mcp/mcpTypes';
import { documentUploadFindManyMcpTool } from './controllers/documentUploadFindManyController';
import { documentUploadFindMcpTool } from './controllers/documentUploadFindController';
import { documentUploadCreateMcpTool } from './controllers/documentUploadCreateController';
import { documentUploadUpdateMcpTool } from './controllers/documentUploadUpdateController';
import { documentUploadDeleteManyMcpTool } from './controllers/documentUploadDeleteManyController';
import { documentUploadArchiveManyMcpTool } from './controllers/documentUploadArchiveManyController';
import { documentUploadRestoreManyMcpTool } from './controllers/documentUploadRestoreManyController';
import { documentUploadAutocompleteMcpTool } from './controllers/documentUploadAutocompleteController';

export function getDocumentUploadMcpTools(dictionary: Dictionary): McpTool[] {
  return [
    documentUploadFindManyMcpTool(dictionary),
    documentUploadFindMcpTool(dictionary),
    documentUploadCreateMcpTool(dictionary),
    documentUploadUpdateMcpTool(dictionary),
    documentUploadDeleteManyMcpTool(dictionary),
    documentUploadArchiveManyMcpTool(dictionary),
    documentUploadRestoreManyMcpTool(dictionary),
    documentUploadAutocompleteMcpTool(dictionary),
  ];
}
