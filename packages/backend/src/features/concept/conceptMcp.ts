import { Dictionary } from '../../translation/locales';
import { McpTool } from '../mcp/mcpTypes';
import { conceptFindManyMcpTool } from './controllers/conceptFindManyController';
import { conceptFindMcpTool } from './controllers/conceptFindController';
import { conceptCreateMcpTool } from './controllers/conceptCreateController';
import { conceptUpdateMcpTool } from './controllers/conceptUpdateController';
import { conceptDeleteManyMcpTool } from './controllers/conceptDeleteManyController';
import { conceptArchiveManyMcpTool } from './controllers/conceptArchiveManyController';
import { conceptRestoreManyMcpTool } from './controllers/conceptRestoreManyController';
import { conceptAutocompleteMcpTool } from './controllers/conceptAutocompleteController';

export function getConceptMcpTools(dictionary: Dictionary): McpTool[] {
  return [
    conceptFindManyMcpTool(dictionary),
    conceptFindMcpTool(dictionary),
    conceptCreateMcpTool(dictionary),
    conceptUpdateMcpTool(dictionary),
    conceptDeleteManyMcpTool(dictionary),
    conceptArchiveManyMcpTool(dictionary),
    conceptRestoreManyMcpTool(dictionary),
    conceptAutocompleteMcpTool(dictionary),
  ];
}
