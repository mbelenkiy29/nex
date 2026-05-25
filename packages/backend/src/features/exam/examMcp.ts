import { Dictionary } from '../../translation/locales';
import { McpTool } from '../mcp/mcpTypes';
import { examFindManyMcpTool } from './controllers/examFindManyController';
import { examFindMcpTool } from './controllers/examFindController';
import { examCreateMcpTool } from './controllers/examCreateController';
import { examUpdateMcpTool } from './controllers/examUpdateController';
import { examDeleteManyMcpTool } from './controllers/examDeleteManyController';
import { examArchiveManyMcpTool } from './controllers/examArchiveManyController';
import { examRestoreManyMcpTool } from './controllers/examRestoreManyController';
import { examAutocompleteMcpTool } from './controllers/examAutocompleteController';

export function getExamMcpTools(dictionary: Dictionary): McpTool[] {
  return [
    examFindManyMcpTool(dictionary),
    examFindMcpTool(dictionary),
    examCreateMcpTool(dictionary),
    examUpdateMcpTool(dictionary),
    examDeleteManyMcpTool(dictionary),
    examArchiveManyMcpTool(dictionary),
    examRestoreManyMcpTool(dictionary),
    examAutocompleteMcpTool(dictionary),
  ];
}
