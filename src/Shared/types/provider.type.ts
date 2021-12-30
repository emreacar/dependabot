import { PackageFile } from './package-file.type';

export enum RepoProvider {
  GITHUB = 'GITHUB',
}

export type ProviderParams = {
  provider: RepoProvider;
  username: string;
  repository: string;
};

export type GithubProviderResponse = {
  content: string;
  encoding: BufferEncoding;
};

export type ProviderPackageFileData = {
  content?: string;
  error?: string;
};

export type ProviderPackageFileResult = ProviderPackageFileData & {
  packageFile?: PackageFile;
};
