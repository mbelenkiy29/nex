import { Dictionary } from '../../translation/locales';
import { McpTool } from '../mcp/mcpTypes';
import { examTypeFindManyMcpTool } from './controllers/examTypeFindManyController';
import { examTypeFindMcpTool } from './controllers/examTypeFindController';
import { examTypeCreateMcpTool } from './controllers/examTypeCreateController';
import { examTypeUpdateMcpTool } from './controllers/examTypeUpdateController';
import { examTypeDeleteManyMcpTool } from './controllers/examTypeDeleteManyController';
import { examTypeArchiveManyMcpTool } from './controllers/examTypeArchiveManyController';
import { examTypeRestoreManyMcpTool } from './controllers/examTypeRestoreManyController';
import { examTypeAutocompleteMcpTool } from './controllers/examTypeAutocompleteController';

export function getExamTypeMcpTools(dictionary: Dictionary): McpTool[] {
  return [
    examTypeFindManyMcpTool(dictionary),
    examTypeFindMcpTool(dictionary),
    examTypeCreateMcpTool(dictionary),
    examTypeUpdateMcpTool(dictionary),
    examTypeDeleteManyMcpTool(dictionary),
    examTypeArchiveManyMcpTool(dictionary),
    examTypeRestoreManyMcpTool(dictionary),
    examTypeAutocompleteMcpTool(dictionary),
  ];
}
