import { Dictionary } from '../../translation/locales';
import { McpTool } from '../mcp/mcpTypes';
import { lessonFindManyMcpTool } from './controllers/lessonFindManyController';
import { lessonFindMcpTool } from './controllers/lessonFindController';
import { lessonCreateMcpTool } from './controllers/lessonCreateController';
import { lessonUpdateMcpTool } from './controllers/lessonUpdateController';
import { lessonDeleteManyMcpTool } from './controllers/lessonDeleteManyController';
import { lessonArchiveManyMcpTool } from './controllers/lessonArchiveManyController';
import { lessonRestoreManyMcpTool } from './controllers/lessonRestoreManyController';
import { lessonAutocompleteMcpTool } from './controllers/lessonAutocompleteController';

export function getLessonMcpTools(dictionary: Dictionary): McpTool[] {
  return [
    lessonFindManyMcpTool(dictionary),
    lessonFindMcpTool(dictionary),
    lessonCreateMcpTool(dictionary),
    lessonUpdateMcpTool(dictionary),
    lessonDeleteManyMcpTool(dictionary),
    lessonArchiveManyMcpTool(dictionary),
    lessonRestoreManyMcpTool(dictionary),
    lessonAutocompleteMcpTool(dictionary),
  ];
}
