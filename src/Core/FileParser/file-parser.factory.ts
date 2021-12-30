import { ERR_UNKNOWN_FILETYPE } from '../Constants';
import { PackageFileType } from '../../Shared/types/package-file.type';
import { FileParser } from './file-parser.interface';
import { JsonParser } from './parser/json-parser';

export class FileParserFactory {
  static getParser(filetype: PackageFileType): FileParser {
    switch (filetype) {
      case PackageFileType.JSON:
        return new JsonParser();
      default:
        throw new Error(ERR_UNKNOWN_FILETYPE);
    }
  }
}
