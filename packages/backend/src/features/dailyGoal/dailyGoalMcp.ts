import { Dictionary } from '../../translation/locales';
import { McpTool } from '../mcp/mcpTypes';
import { dailyGoalFindManyMcpTool } from './controllers/dailyGoalFindManyController';
import { dailyGoalFindMcpTool } from './controllers/dailyGoalFindController';
import { dailyGoalCreateMcpTool } from './controllers/dailyGoalCreateController';
import { dailyGoalUpdateMcpTool } from './controllers/dailyGoalUpdateController';
import { dailyGoalDeleteManyMcpTool } from './controllers/dailyGoalDeleteManyController';
import { dailyGoalArchiveManyMcpTool } from './controllers/dailyGoalArchiveManyController';
import { dailyGoalRestoreManyMcpTool } from './controllers/dailyGoalRestoreManyController';
import { dailyGoalAutocompleteMcpTool } from './controllers/dailyGoalAutocompleteController';

export function getDailyGoalMcpTools(dictionary: Dictionary): McpTool[] {
  return [
    dailyGoalFindManyMcpTool(dictionary),
    dailyGoalFindMcpTool(dictionary),
    dailyGoalCreateMcpTool(dictionary),
    dailyGoalUpdateMcpTool(dictionary),
    dailyGoalDeleteManyMcpTool(dictionary),
    dailyGoalArchiveManyMcpTool(dictionary),
    dailyGoalRestoreManyMcpTool(dictionary),
    dailyGoalAutocompleteMcpTool(dictionary),
  ];
}
