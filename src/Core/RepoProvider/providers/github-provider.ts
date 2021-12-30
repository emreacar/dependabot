import { HttpService } from '@nestjs/axios';
import { RepoProviderService } from '../repo-provider.service';
import { PackageFileName } from '../../../Shared/types/package-file.type';
import {
  ProviderParams,
  GithubProviderResponse,
  ProviderPackageFileData,
} from '../../../Shared/types/provider.type';

const httpService = new HttpService().axiosRef;

export class GithubProvider extends RepoProviderService {
  constructor(params: ProviderParams) {
    super(params);
  }

  private getFileUrl(filename) {
    return `https://api.github.com/repos/${this.username}/${this.repository}/contents/${filename}`;
  }

  /**
   * https://docs.github.com/en/rest/reference/repos#contents
   */
  async getPackageFile(
    filename: PackageFileName,
  ): Promise<ProviderPackageFileData> {
    const fileUrl = this.getFileUrl(filename);

    try {
      const { data } = await httpService.get<GithubProviderResponse>(fileUrl);

      return {
        content: Buffer.from(data.content, data.encoding).toString(),
      };
    } catch (e) {
      return { error: e.message };
    }
  }
}
