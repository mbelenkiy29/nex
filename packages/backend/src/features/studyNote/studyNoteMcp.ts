import { Dictionary } from '../../translation/locales';
import { McpTool } from '../mcp/mcpTypes';
import { studyNoteFindManyMcpTool } from './controllers/studyNoteFindManyController';
import { studyNoteFindMcpTool } from './controllers/studyNoteFindController';
import { studyNoteCreateMcpTool } from './controllers/studyNoteCreateController';
import { studyNoteUpdateMcpTool } from './controllers/studyNoteUpdateController';
import { studyNoteDeleteManyMcpTool } from './controllers/studyNoteDeleteManyController';
import { studyNoteArchiveManyMcpTool } from './controllers/studyNoteArchiveManyController';
import { studyNoteRestoreManyMcpTool } from './controllers/studyNoteRestoreManyController';
import { studyNoteAutocompleteMcpTool } from './controllers/studyNoteAutocompleteController';

export function getStudyNoteMcpTools(dictionary: Dictionary): McpTool[] {
  return [
    studyNoteFindManyMcpTool(dictionary),
    studyNoteFindMcpTool(dictionary),
    studyNoteCreateMcpTool(dictionary),
    studyNoteUpdateMcpTool(dictionary),
    studyNoteDeleteManyMcpTool(dictionary),
    studyNoteArchiveManyMcpTool(dictionary),
    studyNoteRestoreManyMcpTool(dictionary),
    studyNoteAutocompleteMcpTool(dictionary),
  ];
}
