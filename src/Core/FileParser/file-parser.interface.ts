import { ParserResult } from '../../Shared/types/file-parser.type';

export interface FileParser {
  parse(content: string): ParserResult;
}
