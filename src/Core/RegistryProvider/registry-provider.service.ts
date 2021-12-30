import { ParserResult } from '../../Shared/types/file-parser.type';
import { PackageItem } from '../../Shared/types/registry-provider.type';

export abstract class RegistryProviderService {
  abstract getDependencyList(dependencyContent: ParserResult): PackageItem[];
  abstract getLatestVersion(packageName: string): Promise<string>;

  getPackageVersions(dependencyList: PackageItem[]): Promise<PackageItem[]> {
    return Promise.all(
      dependencyList.map((packageItem) =>
        this.getLatestVersion(packageItem.name).then((version) => {
          packageItem.currentVersion = version;
          return packageItem;
        }),
      ),
    );
  }

  protected stripVersion(version: string) {
    const strippedVersion = version.match(/([0-9]+.+)/g);

    return (strippedVersion && strippedVersion.pop()) || version;
  }

  outdatedPackages(dependencyList: PackageItem[]): PackageItem[] {
    return dependencyList.filter(
      (packageItem) => packageItem.currentVersion !== packageItem.usedVersion,
    );
  }
}
