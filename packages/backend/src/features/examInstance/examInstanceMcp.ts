import { Dictionary } from '../../translation/locales';
import { McpTool } from '../mcp/mcpTypes';
import { examInstanceFindManyMcpTool } from './controllers/examInstanceFindManyController';
import { examInstanceFindMcpTool } from './controllers/examInstanceFindController';
import { examInstanceCreateMcpTool } from './controllers/examInstanceCreateController';
import { examInstanceUpdateMcpTool } from './controllers/examInstanceUpdateController';
import { examInstanceDeleteManyMcpTool } from './controllers/examInstanceDeleteManyController';
import { examInstanceArchiveManyMcpTool } from './controllers/examInstanceArchiveManyController';
import { examInstanceRestoreManyMcpTool } from './controllers/examInstanceRestoreManyController';
import { examInstanceAutocompleteMcpTool } from './controllers/examInstanceAutocompleteController';

export function getExamInstanceMcpTools(dictionary: Dictionary): McpTool[] {
  return [
    examInstanceFindManyMcpTool(dictionary),
    examInstanceFindMcpTool(dictionary),
    examInstanceCreateMcpTool(dictionary),
    examInstanceUpdateMcpTool(dictionary),
    examInstanceDeleteManyMcpTool(dictionary),
    examInstanceArchiveManyMcpTool(dictionary),
    examInstanceRestoreManyMcpTool(dictionary),
    examInstanceAutocompleteMcpTool(dictionary),
  ];
}
