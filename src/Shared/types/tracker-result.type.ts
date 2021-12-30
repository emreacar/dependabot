import { PackageFile } from './package-file.type';
import { PackageItem } from './registry-provider.type';

export type TrackerResult = {
  packageFile?: PackageFile;
  outDatedPackages?: PackageItem[];
  error?: string;
};
