import { FileParser } from '../file-parser.interface';

export class JsonParser implements FileParser {
  parse(content: string) {
    return JSON.parse(content);
  }
}
