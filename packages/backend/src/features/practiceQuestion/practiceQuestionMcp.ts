import { Dictionary } from '../../translation/locales';
import { McpTool } from '../mcp/mcpTypes';
import { practiceQuestionFindManyMcpTool } from './controllers/practiceQuestionFindManyController';
import { practiceQuestionFindMcpTool } from './controllers/practiceQuestionFindController';
import { practiceQuestionCreateMcpTool } from './controllers/practiceQuestionCreateController';
import { practiceQuestionUpdateMcpTool } from './controllers/practiceQuestionUpdateController';
import { practiceQuestionDeleteManyMcpTool } from './controllers/practiceQuestionDeleteManyController';
import { practiceQuestionArchiveManyMcpTool } from './controllers/practiceQuestionArchiveManyController';
import { practiceQuestionRestoreManyMcpTool } from './controllers/practiceQuestionRestoreManyController';
import { practiceQuestionAutocompleteMcpTool } from './controllers/practiceQuestionAutocompleteController';

export function getPracticeQuestionMcpTools(dictionary: Dictionary): McpTool[] {
  return [
    practiceQuestionFindManyMcpTool(dictionary),
    practiceQuestionFindMcpTool(dictionary),
    practiceQuestionCreateMcpTool(dictionary),
    practiceQuestionUpdateMcpTool(dictionary),
    practiceQuestionDeleteManyMcpTool(dictionary),
    practiceQuestionArchiveManyMcpTool(dictionary),
    practiceQuestionRestoreManyMcpTool(dictionary),
    practiceQuestionAutocompleteMcpTool(dictionary),
  ];
}
