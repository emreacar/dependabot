import { Job, DoneCallback } from 'bull';
import { ERR_DEP_FILE_NOT_FOUND } from 'src/Core/Constants';
import { FileParserFactory } from 'src/Core/FileParser/file-parser.factory';
import { RepoProviderFactory } from 'src/Core/RepoProvider/repo-provider.factory';
import { RegistryProviderFactory } from 'src/Core/RegistryProvider/registry-provider.factory';
import { Tracker } from '../entities/tracker.entity';
import { TrackerResult } from 'src/Shared/types/tracker-result.type';

export default async function (
  job: Job<Tracker>,
  cb: DoneCallback,
): Promise<void> {
  try {
    const tracker = job.data;
    /**
     * Get DependencyFile from repository
     */
    const repoProvider = RepoProviderFactory.getProvider(tracker);
    const { error, content, packageFile } =
      await repoProvider.findPackageFile();

    if (error) throw new Error(ERR_DEP_FILE_NOT_FOUND);

    /**
     * Parse Dependency File
     */
    const fileParser = FileParserFactory.getParser(packageFile.type);
    const packageFileContent = fileParser.parse(content);

    /**
     * Find Registry and extract dependencyList from packageFileContent
     */
    const registryProvider = RegistryProviderFactory.getProvider(
      packageFile.registry,
    );

    const dependencyList =
      registryProvider.getDependencyList(packageFileContent);

    /**
     * Fetch Latest Versions of packages
     */
    const latestVersions = await registryProvider.getPackageVersions(
      dependencyList,
    );

    /** Filter outdated packages */
    const outDatedPackages = registryProvider.outdatedPackages(latestVersions);

    const dependencyCheckResult: TrackerResult = {
      packageFile,
      outDatedPackages,
    };

    cb(null, dependencyCheckResult);
  } catch (e) {
    cb(e);
  }
}
