import type { SharedL2NativeSuperchainERC20Options} from '../shared/option-l2-native-superchain-ERC20';
import type { SharedERC20VotesOptions} from '../shared/option-erc20-votes';


export interface KindedOptions {
    L2NativeSuperchainERC20: { kind: 'L2NativeSuperchainERC20' } & SharedL2NativeSuperchainERC20Options;
    ERC20Votes: { kind: 'ERC20Votes' } & SharedERC20VotesOptions;
}
  
export type GenericOptions = KindedOptions[keyof KindedOptions];


export interface KindedERC7802Options {
    L2NativeSuperchainERC20: { kind: 'L2NativeSuperchainERC20' } & SharedL2NativeSuperchainERC20Options;
    ERC20Votes: { kind: 'ERC20Votes' } & SharedERC20VotesOptions;
}
export type GenericERC7802Options = KindedERC7802Options[keyof KindedERC7802Options];