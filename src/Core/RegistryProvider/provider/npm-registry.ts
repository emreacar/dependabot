import { HttpService } from '@nestjs/axios';
import { ParserResult } from 'src/Shared/types/file-parser.type';
import { RegistryProviderService } from '../registry-provider.service';
import { PackageItem } from '../../../Shared/types/registry-provider.type';
import { ERR_EMPTY_DEPENDENCY } from 'src/Core/Constants';

const httpService = new HttpService().axiosRef;

export class NpmRegistry extends RegistryProviderService {
  // https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md
  async getLatestVersion(packageName: string): Promise<string> {
    const url = `https://registry.npmjs.org/${packageName}/latest`;

    try {
      const { data } = await httpService.get<{ version: string }>(url);

      return data.version || null;
    } catch {}

    return null;
  }

  getDependencyList(packageFileContent: ParserResult): PackageItem[] {
    const dependencyList = packageFileContent.dependencies || false;

    if (!dependencyList) throw Error(ERR_EMPTY_DEPENDENCY);

    return Object.entries(dependencyList).map(([name, version]) => ({
      name,
      currentVersion: null,
      usedVersion: this.stripVersion(version as string),
    }));
  }
}
