import type { SharedL2NativeSuperchainERC20Options} from '../shared/option-l2-native-superchain-ERC20';
import { buildDeployL2NativeSuperchainERC20 } from './l2-native-superchain-ERC20';

import type { SharedERC20VotesOptions} from '../shared/option-erc20-votes';
import { buildDeployERC20Votes } from './erc20-votes';


export interface DeployKindedOptions {
    L2NativeSuperchainERC20: { kind: 'L2NativeSuperchainERC20' } & SharedL2NativeSuperchainERC20Options;
    ERC20Votes: { kind: 'ERC20Votes' } & SharedERC20VotesOptions;
}
  
export type DeployGenericOptions = DeployKindedOptions[keyof DeployKindedOptions];

export function buildDeployGeneric(opts: DeployGenericOptions) {
    switch (opts.kind) {
  
      case 'L2NativeSuperchainERC20':
        return buildDeployL2NativeSuperchainERC20(opts);
  
      case 'ERC20Votes':
        return  buildDeployERC20Votes(opts);
  
      default:
        const _: never = opts;
        throw new Error('Unknown Contract');
    }
  }
  