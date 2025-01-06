import type { Contract, BaseFunction} from './contract';
import {  ContractBuilder } from './contract';

import { withCommonDefaults, defaults as commonDefaults } from "../shared/option-erc20-votes";
import type { SharedERC20VotesOptions } from "../shared/option-erc20-votes";

import { printContract } from "./print";
import { setInfo  } from "./set-info";

import type { ClockMode} from './set-clock-mode';
import { clockModeDefault, setClockMode } from './set-clock-mode';

import { supportsInterface } from './common-functions';
import { defineFunctions } from '../utils/define-functions';

export function isAccessControlRequired(opts: Partial<SharedERC20VotesOptions>): boolean {
  return opts.upgradeable === 'uups';
}

function withDefaults(opts: SharedERC20VotesOptions): Required<SharedERC20VotesOptions> {
  return {
    ...opts,
    ...withCommonDefaults(opts),
    burnable: opts.burnable ?? commonDefaults.burnable,
    pausable: opts.pausable ?? commonDefaults.pausable,
    premint: opts.premint || commonDefaults.premint,
    mintable: opts.mintable ?? commonDefaults.mintable,
    permit: opts.permit ?? commonDefaults.permit,
    votes: opts.votes ?? commonDefaults.votes,
    flashmint: opts.flashmint ?? commonDefaults.flashmint,
  };
}

export function printERC20Votes(opts: SharedERC20VotesOptions = commonDefaults): string {
  return printContract(buildERC20Votes(opts));
}

export function buildERC20Votes(opts: SharedERC20VotesOptions): Contract {
    const allOpts = withDefaults(opts);

    // to do add interface
    const c = new ContractBuilder(allOpts.contractName);

    // const Ownable = {
    //     name: 'Ownable',
    //     path: '@redprint-openzeppelin/access/Ownable.sol',
    // };
    // c.addParent(Ownable, []);
    

    const { access, upgradeable } = allOpts;

    addBase(c, allOpts.contractName,  allOpts.tokenSymbol);
    addCrosschain(c);


    // if (allOpts.burnable) {
    //   addBurnable(c);
    // }

    // if (allOpts.pausable) {
    //   addPausableExtension(c, access);
    // }

    // if (allOpts.premint) {
    //   addPremint(c, allOpts.premint);
    // }

    // if (allOpts.mintable) {
    //   addMintable(c, access);
    // }

    // Note: Votes requires Permit
    if (allOpts.permit || allOpts.votes) {
      addPermit(c, allOpts.contractName);
    }

    if (allOpts.votes) {
      const clockMode = allOpts.votes === true ? clockModeDefault : allOpts.votes;
      addVotes(c, clockMode);
    }

    // if (allOpts.flashmint) {
    //   addFlashMint(c);
    // }

    // setAccessControl(c, access);
    // setUpgradeable(c, upgradeable, access);


    setInfo(c, allOpts.contractInfo);
    return c;
}

function addBase(c: ContractBuilder, name: string, symbol: string) {

  const IERC20 = {
    name: 'IERC20',
    path: '@openzeppelin-v0.5.0.2/token/ERC20/IERC20.sol',
  };
  c.addImportOnly(IERC20);

  const ERC20 = {
    name: 'ERC20',
    path: '@openzeppelin-v0.5.0.2/token/ERC20/ERC20.sol',
  };
  c.addParent(
    ERC20,
    [name, symbol],
  );

  c.addOverride(ERC20, functions._update);

}

function addCrosschain(c: ContractBuilder) {

  const Predeploys = {
    name: 'Predeploys',
    path: '@superfuse-core/libraries/Predeploys.sol',
  };
  c.addImportOnly(Predeploys);

  const Unauthorized = {
    name: 'Unauthorized',
    path: '@superfuse-core//libraries/errors/CommonErrors.sol',
  };
  c.addImportOnly(Unauthorized);

  const IERC7802 = {
    name: 'IERC7802',
    path: '@superfuse-core/interfaces/L2/IERC7802.sol',
  };
  c.addParent(IERC7802);

  const IERC165 = {
    name: 'IERC165',
    path: '"@superfuse-core/interfaces/L2/IERC7802.sol',
  };
  c.addImportOnly(IERC165);

  // crosschainMint
  c.addFunctionCode(`// Only the "SuperchainTokenBridge" has permissions to mint tokens during crosschain transfers.
        if (msg.sender != Predeploys.SUPERCHAIN_TOKEN_BRIDGE) revert Unauthorized();
        
        // Mint tokens to the "_to" account's balance.
        _mint(_to, _amount);

        // Emit the CrosschainMint event included on IERC7802 for tracking token mints associated with cross chain transfers.
        emit CrosschainMint(_to, _amount, msg.sender);`, functions.crosschainMint);

    // crosschainBurn
    c.addFunctionCode(`// Only the "SuperchainTokenBridge" has permissions to burn tokens during crosschain transfers.
        if (msg.sender != Predeploys.SUPERCHAIN_TOKEN_BRIDGE) revert Unauthorized();

        // Burn the tokens from the "_from" account's balance.
        _burn(_from, _amount);

        // Emit the CrosschainBurn event included on IERC7802 for tracking token burns associated with cross chain transfers.
        emit CrosschainBurn(_from, _amount, msg.sender);`, functions.crosschainBurn);

    // supportsInterface
    c.addFunctionCode(`return _interfaceId == type(IERC7802).interfaceId || _interfaceId == type(IERC20).interfaceId
            || _interfaceId == type(IERC165).interfaceId;`, supportsInterface);

}

export const premintPattern = /^(\d*)(?:\.(\d+))?(?:e(\d+))?$/;


function addPermit(c: ContractBuilder, name: string) {
  const ERC20Permit = {
    name: 'ERC20Permit',
    path: '@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol',
  };
  c.addParent(ERC20Permit, [name]);
  c.addOverride(ERC20Permit, functions.nonces);

}

function addVotes(c: ContractBuilder, clockMode: ClockMode) {
  if (!c.parents.some(p => p.contract.name === 'ERC20Permit')) {
    throw new Error('Missing ERC20Permit requirement for ERC20Votes');
  }

  const ERC20Votes = {
    name: 'ERC20Votes',
    path: '@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol',
  };
  c.addParent(ERC20Votes);
  c.addOverride(ERC20Votes, functions._update);

  c.addImportOnly({
    name: 'Nonces',
    path: '@openzeppelin/contracts/utils/Nonces.sol',
  });
  c.addOverride({
    name: 'Nonces',
  }, functions.nonces);

  setClockMode(c, ERC20Votes, clockMode);
}

const functions = defineFunctions({

  _update: {
    kind: 'internal' as const,
    args: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint256' },
    ],
  },

  crosschainMint: {
    kind: 'external' as const,
    args: [
      { name: '_to', type: 'address' },
      { name: '_amount', type: 'uint256' },
    ],
  },

  crosschainBurn: {
    kind: 'external' as const,
    args: [
      { name: '_to', type: 'address' },
      { name: '_amount', type: 'uint256' },
    ],
  },

  nonces: {
    kind: 'public' as const,
    args: [
      { name: 'owner', type: 'address' },
    ],
    returns: ['uint256'],
    mutability: 'view' as const,
  }
});