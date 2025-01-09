import type { SharedL2NativeSuperchainERC20Options} from '../shared/option-l2-native-superchain-ERC20';

import type { SharedERC20VotesOptions} from '../shared/option-erc20-votes';
import { buildTestERC20Votes } from './erc20-votes';


export interface TestKindedOptions {
    // L2NativeSuperchainERC20: { kind: 'L2NativeSuperchainERC20' } & SharedL2NativeSuperchainERC20Options;
    L2NativeSuperchainERC20: { kind: 'L2NativeSuperchainERC20' } & SharedERC20VotesOptions;
    ERC20Votes: { kind: 'ERC20Votes' } & SharedERC20VotesOptions;
}
  
export type TestGenericOptions = TestKindedOptions[keyof TestKindedOptions];

export function buildTestGeneric(opts: TestGenericOptions) {
    switch (opts.kind) {
  
        //  to do fix
      case 'L2NativeSuperchainERC20':
        return buildTestERC20Votes(opts);
  
  
      case 'ERC20Votes':
        return  buildTestERC20Votes(opts);
  
      default:
        const _: never = opts;
        throw new Error('Unknown Contract');
    }
  }
  