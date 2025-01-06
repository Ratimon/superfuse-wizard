import type { SharedERC20VotesOptions} from '../shared/option-erc20-votes';
import { buildERC20Votes } from './erc20-votes';

export interface KindedOptions {
    // L2NativeSuperchainERC20: { kind: 'L2NativeSuperchainERC20' } & SharedL2NativeSuperchainERC20Options;
    L2NativeSuperchainERC20: { kind: 'L2NativeSuperchainERC20' } & SharedERC20VotesOptions;
    ERC20Votes: { kind: 'ERC20Votes' } & SharedERC20VotesOptions;
}

export type GenericOptions = KindedOptions[keyof KindedOptions];

export function buildContractGeneric(opts: GenericOptions) {
    switch (opts.kind) {

        case 'L2NativeSuperchainERC20':
            return buildERC20Votes(opts);
  
        case 'ERC20Votes':
            return buildERC20Votes(opts);

        default:
            const _: never = opts;
            throw new Error('Unknown Contract');
    }
  }
  