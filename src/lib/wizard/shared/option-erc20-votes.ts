import type { CommonOptions} from './common-options';
import { defaults as infoDefaults } from "./set-info";

import type { ClockMode} from '../smart-contracts/set-clock-mode';

import { clockModeDefault, setClockMode } from '../smart-contracts/set-clock-mode';


export const chainOptions = [false, 'optimism', 'base'] as const;
export type Chain = typeof chainOptions[number];

// export const opSecOptions = [false, 'address', 'key', 'mnemonic'] as const;
// export type OpSec = typeof opSecOptions[number];

export const commonDefaults: Required<CommonOptions> = {
  //contract
  access: false,
  upgradeable: false,
  contractInfo: infoDefaults,

  //deploy
  deployInfo: infoDefaults,
} as const;


export function withCommonDefaults(opts: CommonOptions): Required<CommonOptions> {
  return {
    access: opts.access ?? false,
    upgradeable: opts.upgradeable ?? false,
    contractInfo: opts.contractInfo ?? {},
    
    deployInfo: opts.deployInfo ?? {},
  };
}

export const defaults: Required<SharedERC20VotesOptions> = {
  //contract
  contractName: 'MyERC20Votes',
  contractFile: 'ERC20Votes.sol',
  tokenName: 'TestToken',
  tokenSymbol: 'TT',
  burnable: false,
  pausable: false,
  premint: '0',
  mintable: false,
  permit: true,
  votes: false,
  flashmint: false,
  access: commonDefaults.access,
  upgradeable: commonDefaults.upgradeable,
  contractInfo: commonDefaults.contractInfo,

  //deploy
  deployName: 'DeployERC20VotesScript',
  chain: 'optimism',
  // opSec: 'mnemonic',

  deployInfo: commonDefaults.deployInfo
} as const;


export interface SharedERC20VotesOptions extends CommonOptions {
  contractName: string;
  contractFile: string;
  tokenName: string;
  tokenSymbol: string;

  burnable?: boolean;
  pausable?: boolean;
  premint?: string;
  mintable?: boolean;
  permit?: boolean;
  /**
   * Whether to keep track of historical balances for voting in on-chain governance, and optionally specify the clock mode.
   * Setting `true` is equivalent to 'blocknumber'. Setting a clock mode implies voting is enabled.
   */
  votes?: boolean | ClockMode;
  flashmint?: boolean;

  deployName: string;
  chain: Chain;
  // opSec: OpSec;
}