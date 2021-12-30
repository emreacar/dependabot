import { ERR_UNKNOWN_REGISTRY } from '../Constants';
import { RegistryProviderService } from './registry-provider.service';
import { NpmRegistry } from './provider/npm-registry';
import { PackagistRegistry } from './provider/packagist-registry';
import { PackageFileRegistry } from '../../Shared/types/package-file.type';

export class RegistryProviderFactory {
  static getProvider(
    packageFileRegistry: PackageFileRegistry,
  ): RegistryProviderService {
    switch (packageFileRegistry) {
      case PackageFileRegistry.NPM:
        return new NpmRegistry();

      case PackageFileRegistry.PACKAGIST:
        return new PackagistRegistry();

      default:
        throw new Error(ERR_UNKNOWN_REGISTRY);
    }
  }
}
