import type { SharedL2NativeSuperchainERC20Options} from '../shared/option-l2-native-superchain-ERC20';
import {  defaults as l2NativeSuperchainERC20Defaults } from '../shared/option-l2-native-superchain-ERC20';
import { printL2NativeSuperchainERC20, isAccessControlRequired as l2NativeSuperchainERC20IsAccessControlRequired } from './l2-native-superchain-ERC20';

import type { SharedERC20VotesOptions} from '../shared/option-erc20-votes';
import {  defaults as erc20VotesDefaults } from '../shared/option-erc20-votes';
import { printERC20Votes, isAccessControlRequired as erc20VotesIsAccessControlRequired } from './erc20-votes';

import type { CommonOptions } from '../shared/common-options';

export interface WizardContractAPI<Options extends CommonOptions> {
    /**
     * Returns a string representation of a contract generated using the provided options. If opts is not provided, uses `defaults`.
     */
    print: (opts?: Options) => string,
    /**
     * The default options that are used for `print`.
     */
    defaults: Required<Options>;
    /**
     * Whether any of the provided options require access control to be enabled. If this returns `true`, then calling `print` with the 
     * same options would cause the `access` option to default to `'ownable'` if it was `undefined` or `false`. 
     */
    isAccessControlRequired?: (opts: Partial<Options>) => boolean,
}

export type L2NativeSuperchainERC20 = WizardContractAPI<SharedL2NativeSuperchainERC20Options>;
export const l2NativeSuperchainERC20: L2NativeSuperchainERC20 = {
  print: printL2NativeSuperchainERC20,
  defaults: l2NativeSuperchainERC20Defaults,
  isAccessControlRequired: l2NativeSuperchainERC20IsAccessControlRequired
}

export type ERC20Votes = WizardContractAPI<SharedERC20VotesOptions>;
export const erc20Votes: ERC20Votes = {
  print: printERC20Votes,
  defaults: erc20VotesDefaults,
  isAccessControlRequired: erc20VotesIsAccessControlRequired
}