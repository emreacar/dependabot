import { ERR_REPO_UNKNOWN } from '../Constants';
import { RepoProviderService } from './repo-provider.service';
import { GithubProvider } from './providers/github-provider';
import { ProviderParams, RepoProvider } from '../../Shared/types/provider.type';

export class RepoProviderFactory {
  static getProvider(params: ProviderParams): RepoProviderService {
    switch (params.provider) {
      case RepoProvider.GITHUB: {
        return new GithubProvider(params);
      }
      default: {
        throw new Error(ERR_REPO_UNKNOWN);
      }
    }
  }
}
