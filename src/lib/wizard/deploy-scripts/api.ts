import type { CommonOptions } from '../shared/common-options';

import type { SharedERC20VotesOptions} from '../shared/option-erc20-votes';
import { defaults as ERC20VotesDefaults } from '../shared/option-erc20-votes';
import { printDeployERC20Votes} from './erc20-votes';

export interface WizardContractAPI<Options extends CommonOptions> {
    /**
     * Returns a string representation of a contract generated using the provided options. If opts is not provided, uses `defaults`.
     */
    print: (opts?: Options) => string,
    /**
     * The default options that are used for `print`.
     */
    defaults: Required<Options>;
  
}
  
export interface WizardAllAPI<Options> {
    print: (opts?: Options) => string,
    defaults: Required<Options>;
}

export type DeployERC20Votes = WizardContractAPI<SharedERC20VotesOptions>;
export const deployERC20Votes: DeployERC20Votes = {
    print: printDeployERC20Votes,
    defaults: ERC20VotesDefaults,
}