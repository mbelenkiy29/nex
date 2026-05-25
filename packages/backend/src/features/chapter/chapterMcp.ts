import { Dictionary } from '../../translation/locales';
import { McpTool } from '../mcp/mcpTypes';
import { chapterFindManyMcpTool } from './controllers/chapterFindManyController';
import { chapterFindMcpTool } from './controllers/chapterFindController';
import { chapterCreateMcpTool } from './controllers/chapterCreateController';
import { chapterUpdateMcpTool } from './controllers/chapterUpdateController';
import { chapterDeleteManyMcpTool } from './controllers/chapterDeleteManyController';
import { chapterArchiveManyMcpTool } from './controllers/chapterArchiveManyController';
import { chapterRestoreManyMcpTool } from './controllers/chapterRestoreManyController';
import { chapterAutocompleteMcpTool } from './controllers/chapterAutocompleteController';

export function getChapterMcpTools(dictionary: Dictionary): McpTool[] {
  return [
    chapterFindManyMcpTool(dictionary),
    chapterFindMcpTool(dictionary),
    chapterCreateMcpTool(dictionary),
    chapterUpdateMcpTool(dictionary),
    chapterDeleteManyMcpTool(dictionary),
    chapterArchiveManyMcpTool(dictionary),
    chapterRestoreManyMcpTool(dictionary),
    chapterAutocompleteMcpTool(dictionary),
  ];
}
