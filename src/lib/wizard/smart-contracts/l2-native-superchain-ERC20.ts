import type { Contract, BaseFunction} from './contract';
import {  ContractBuilder } from './contract';

import type { Access } from './set-access-control';
import {setAccessControl, requireAccessControl } from './set-access-control';

import { withCommonDefaults, defaults as commonDefaults } from "../shared/option-l2-native-superchain-ERC20";
import type { SharedL2NativeSuperchainERC20Options } from "../shared/option-l2-native-superchain-ERC20";

import { printContract } from "./print";
import { setInfo  } from "./set-info";

import type { ClockMode} from './set-clock-mode';
import { clockModeDefault, setClockMode } from './set-clock-mode';

import { supportsInterface } from './common-functions';
import { defineFunctions } from '../utils/define-functions';

export function isAccessControlRequired(opts: Partial<SharedL2NativeSuperchainERC20Options>): boolean {
  return opts.mintable == true
}

function withDefaults(opts: SharedL2NativeSuperchainERC20Options): Required<SharedL2NativeSuperchainERC20Options> {
  return {
    ...opts,
    ...withCommonDefaults(opts),
    ownerAddress: opts.ownerAddress || commonDefaults.ownerAddress,
    burnable: opts.burnable ?? commonDefaults.burnable,
    pausable: opts.pausable ?? commonDefaults.pausable,
    premint: opts.premint || commonDefaults.premint,
    mintable: opts.mintable ?? commonDefaults.mintable,
    minterAddress: opts.minterAddress || commonDefaults.minterAddress,
    permit: opts.permit ?? commonDefaults.permit,
    votes: opts.votes ?? commonDefaults.votes,
    flashmint: opts.flashmint ?? commonDefaults.flashmint,
  };
}

export function printL2NativeSuperchainERC20(opts: SharedL2NativeSuperchainERC20Options = commonDefaults): string {
  return printContract(buildL2NativeSuperchainERC20(opts));
}

export function buildL2NativeSuperchainERC20(opts: SharedL2NativeSuperchainERC20Options): Contract {
    const allOpts = withDefaults(opts);

    const c = new ContractBuilder(allOpts.contractName);

    const { access, upgradeable, contractInfo } = allOpts;

    addBase(c);
    setERC7802Logic(c);


    // if (allOpts.burnable) {
    //   addBurnable(c);
    // }

    // if (allOpts.pausable) {
    //   addPausableExtension(c, access);
    // }

    // if (allOpts.premint) {
    //   addPremint(c, allOpts.premint);
    // }

    if (allOpts.mintable) {
      addMintable(c, access);
    }

    // // Note: Votes requires Permit
    // if (allOpts.permit || allOpts.votes) {
    //   addPermit(c);
    // }

    // if (allOpts.votes) {
    //   const clockMode = allOpts.votes === true ? clockModeDefault : allOpts.votes;
    //   addVotes(c, clockMode);
    // }

    // if (allOpts.flashmint) {
    //   addFlashMint(c);
    // }

    setAccessControl(c, access);
    // setUpgradeable(c, upgradeable, access);


    setInfo(c, contractInfo);
    return c;
}

function addBase(c: ContractBuilder) {

  c.addConstructorArgument({
    type: {
      name: 'string memory',
      transpiled: false,
    },
    name: 'name_',
  });

  c.addConstructorArgument({
    type: {
      name: 'string memory',
      transpiled: false,
    },
    name: 'symbol_',
  });

  c.addConstructorArgument({
    type: {
      name: 'uint8',
      transpiled: false,
    },
    name: 'decimals_',
  });

  c.addVariable(`string private _name;`);
  c.addVariable(`string private _symbol;`);
  c.addVariable(`uint8 private immutable _decimals;`);

//   c.addConstructorCode(`_name = name_;
//         _symbol = symbol_;
//         _decimals = decimals_;

//         _initializeOwner(owner_);`);

  c.addConstructorCode(`_name = name_;
        _symbol = symbol_;
        _decimals = decimals_;`);

  //name
  c.addModifier('virtual override', functions.name);
  c.addFunctionCode(`return _name;`, functions.name);

  //symbol
  c.addModifier('virtual override', functions.symbol);
  c.addFunctionCode(`return _symbol;`, functions.symbol);

  //decimals
  c.addModifier('override', functions.decimals);
  c.addFunctionCode(`return _decimals;`, functions.decimals);


}

function setERC7802Logic(c: ContractBuilder) {
  const SuperchainERC20 = {
    name: 'SuperchainERC20',
    path: '@superfuse-core/L2/SuperchainERC20.sol',
  };
  c.addParent(
    SuperchainERC20,
    [],
  );

}

// export const premintPattern = /^(\d*)(?:\.(\d+))?(?:e(\d+))?$/;

// function addAuthorizable(c: ContractBuilder, access: Access) {

//     requireAccessControl(c, functions.mintTo, access, 'ADMIN','0', 'initialAdmin');

//     c.addFunctionCode('_checkRole(ADMIN_ROLE);', functions._authorizeSetRole);
// }



function addMintable(c: ContractBuilder, access: Access) {
    requireAccessControl(c, functions.mintTo, access, 'MINTER','1', 'minter_');
    c.addFunctionCode('_mint(to_, amount_);', functions.mintTo);
}


// function addPermit(c: ContractBuilder) {
// // function addPermit(c: ContractBuilder, name: string) {
//   const ERC20Permit = {
//     name: 'ERC20Permit',
//     path: '@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol',
//   };
//   c.addParent(ERC20Permit, [{ lit: '_name' }]);
//   c.addOverride(ERC20Permit, functions.nonces);

// }

// function addVotes(c: ContractBuilder, clockMode: ClockMode) {
//   if (!c.parents.some(p => p.contract.name === 'ERC20Permit')) {
//     throw new Error('Missing ERC20Permit requirement for ERC20Votes');
//   }

//   const ERC20Votes = {
//     name: 'ERC20Votes',
//     path: '@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol',
//   };
//   c.addParent(ERC20Votes);
//   c.addOverride(ERC20Votes, functions._update);

//   c.addImportOnly({
//     name: 'Nonces',
//     path: '@openzeppelin/contracts/utils/Nonces.sol',
//   });
//   c.addOverride({
//     name: 'Nonces',
//   }, functions.nonces);

//   setClockMode(c, ERC20Votes, clockMode);
// }

const functions = defineFunctions({

  name: {
    kind: 'public' as const,
    args: [
    ],
    returns: ['string memory'],
    mutability: 'view' as const,
  },

  symbol: {
    kind: 'public' as const,
    args: [
    ],
    returns: ['string memory'],
    mutability: 'view' as const,
  },

  decimals: {
    kind: 'public' as const,
    args: [
    ],
    returns: ['uint8'],
    mutability: 'view' as const,
  },

//   _authorizeSetRole: {
//     kind: 'internal' as const,
//     args: [
//       { name: '', type: 'address' },
//       { name: '', type: 'uint256' },
//       { name: '', type: 'bool' },
//     ],
//   },

  mintTo: {
    kind: 'external' as const,
    args: [
      { name: 'to_', type: 'address' },
      { name: 'amount_', type: 'uint256' },
    ],
  },

  nonces: {
    kind: 'public' as const,
    args: [
      { name: 'owner', type: 'address' },
    ],
    returns: ['uint256'],
    mutability: 'view' as const,
  },

  _update: {
    kind: 'internal' as const,
    args: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint256' },
    ],
  },


});