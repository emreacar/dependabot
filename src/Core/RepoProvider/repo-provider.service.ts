import { ERR_DEP_FILE_NOT_FOUND } from '../Constants';
import {
  ProviderParams,
  ProviderPackageFileData,
  ProviderPackageFileResult,
} from '../../Shared/types/provider.type';
import {
  PackageFile,
  PackageFileName,
  PackageFileType,
  PackageFileRegistry,
} from '../../Shared/types/package-file.type';

export abstract class RepoProviderService {
  protected username: string;
  protected repository: string;
  protected readonly searchPackageFiles: PackageFile[] = [
    {
      type: PackageFileType.JSON,
      registry: PackageFileRegistry.NPM,
      filename: PackageFileName.PACKAGE_JSON,
    },
    {
      type: PackageFileType.JSON,
      registry: PackageFileRegistry.PACKAGIST,
      filename: PackageFileName.COMPOSER_JSON,
    },
  ];

  constructor(params: ProviderParams) {
    this.username = params.username;
    this.repository = params.repository;
  }

  protected abstract getPackageFile(
    filename: PackageFileName,
  ): Promise<ProviderPackageFileData>;

  async findPackageFile(): Promise<ProviderPackageFileResult> {
    for (const packageFile of this.searchPackageFiles) {
      const { content } = await this.getPackageFile(packageFile.filename);

      if (content) return { content, packageFile };
    }

    return { error: ERR_DEP_FILE_NOT_FOUND };
  }
}
