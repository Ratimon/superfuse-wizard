// place files you want to import through the `$lib` alias in this folder.
export type { GenericOptions, KindedOptions } from './build-generic';
export { buildContractGeneric } from './build-generic';

export type { Contract } from './contract';
export { ContractBuilder } from './contract';

export { printContract } from './print';

export type { Access } from './set-access-control';
export type { Upgradeable } from './set-upgradeable';
export type { Info } from './set-info';

// export { premintPattern } from './erc20-votes';

export { defaults as contractInfoDefaults } from './set-info';

export {
    erc20Votes,
    l2NativeSuperchainERC20,
} from './api';

export { buildERC20Votes } from './erc20-votes';
export { buildL2NativeSuperchainERC20 } from './l2-native-superchain-ERC20';