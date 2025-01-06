import type { CommonOptions} from './common-options';
import { defaults as infoDefaults } from "./set-info";

export const chainOptions = [false, 'optimism', 'base'] as const;
export type Chain = typeof chainOptions[number];

export const opSecOptions = [false, 'address', 'key', 'mnemonic'] as const;
export type OpSec = typeof opSecOptions[number];

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

export const defaults: Required<SharedL2NativeSuperchainERC20Options> = {
  //contract
  contractName: 'L2NativeSuperchainERC20',
  
  access: commonDefaults.access,
  upgradeable: commonDefaults.upgradeable,
  contractInfo: commonDefaults.contractInfo,

  //deploy
  deployName: 'DeployL2NativeSuperchainERC20Script',
  chain: 'optimism',
  opSec: 'mnemonic',

  deployInfo: commonDefaults.deployInfo
} as const;


export interface SharedL2NativeSuperchainERC20Options extends CommonOptions {
  contractName: string;

  deployName: string;
  chain: Chain;
  opSec: OpSec;
}