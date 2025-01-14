import type { CommonOptions } from '../shared/common-options';

import type { SharedL2NativeSuperchainERC20Options} from '../shared/option-l2-native-superchain-ERC20';
import { defaults as L2NativeSuperchainERC20Defaults } from '../shared/option-l2-native-superchain-ERC20';
import { printDeployL2NativeSuperchainERC20} from './l2-native-superchain-ERC20';

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

export type DeployL2NativeSuperchainERC20 = WizardContractAPI<SharedL2NativeSuperchainERC20Options>;
export const deployL2NativeSuperchainERC20: DeployL2NativeSuperchainERC20 = {
    print: printDeployL2NativeSuperchainERC20,
    defaults: L2NativeSuperchainERC20Defaults,
}

export type DeployERC20Votes = WizardContractAPI<SharedERC20VotesOptions>;
export const deployERC20Votes: DeployERC20Votes = {
    print: printDeployERC20Votes,
    defaults: ERC20VotesDefaults,
}