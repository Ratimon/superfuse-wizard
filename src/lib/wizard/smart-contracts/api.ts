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


export type ERC20Votes = WizardContractAPI<SharedERC20VotesOptions>;
export const erc20Votes: ERC20Votes = {
  print: printERC20Votes,
  defaults: erc20VotesDefaults,
  isAccessControlRequired: erc20VotesIsAccessControlRequired
}