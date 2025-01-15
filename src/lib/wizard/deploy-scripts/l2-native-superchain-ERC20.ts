import type { DeployContract, BaseFunction} from './contract';
import { DeployBuilder } from "./contract";

import type { Access } from './set-access-control';
import {setAccessControl, setAccessControl2, requireAccessControl2 } from './set-access-control';

import type { SharedL2NativeSuperchainERC20Options, OpSec} from '../shared/option-l2-native-superchain-ERC20';
import { withCommonDefaults, defaults as commonDefaults } from '../shared/option-l2-native-superchain-ERC20';

import { OptionsError } from "../shared/error";

import { printDeployContract } from "./print";
import { setInfo } from "./set-info";


function withDeloyDefaults(opts: SharedL2NativeSuperchainERC20Options): Required<SharedL2NativeSuperchainERC20Options> {
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

export function printDeployL2NativeSuperchainERC20(opts: SharedL2NativeSuperchainERC20Options = commonDefaults): string {
  return printDeployContract(buildDeployL2NativeSuperchainERC20(opts));
}
  
export function buildDeployL2NativeSuperchainERC20(opts: SharedL2NativeSuperchainERC20Options): DeployContract {
    const allOpts = withDeloyDefaults(opts);
  
    const c = new DeployBuilder(allOpts.deployName);

    validateAddress(allOpts.deployerAddress);
    setOpsec(c, allOpts.opSec);
    addBase(c, allOpts);


    const fn : BaseFunction = getDeployFunction(allOpts);
    // addDeployLogic(c, fn, allOpts);

    // new implementation
    addDeployOptions(c, fn);

    let argCode : string | undefined = undefined;
    if (allOpts.mintable) {
      argCode = addMintable(c, allOpts.access, allOpts);
    }
    // addVotes(c, fn);


    setAccessControl2(c, fn, allOpts.access, allOpts.contractName, argCode, allOpts.ownerAddress);
    // setUpgradeable(c, allOpts.upgradeable, allOpts.access);

    setInfo(c, allOpts.deployInfo);
  
    return c;
}

function validateAddress(address: string) {
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    throw new OptionsError({
      address: 'Not a valid address',
    });
  }
}

function setOpsec(c: DeployBuilder, opsec: OpSec) {
  switch (opsec) {
    case 'address': {
      c.addVariable(`address owner = vm.envAddress("DEPLOYER_ADDRESS");`);

      break;
    }
    case 'key': {
      c.addVariable(`uint256 ownerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");`);
      c.addVariable(`address owner = vm.envOr("DEPLOYER_ADDRESS", vm.addr(ownerPrivateKey));`);

      break;
    }
    case 'mnemonic': {
      c.addVariable(`string mnemonic = vm.envString("MNEMONIC");`);
      c.addVariable(`uint256 ownerPrivateKey = vm.deriveKey(mnemonic, "m/44'/60'/0'/0/", 1);`);
      c.addVariable(`address owner = vm.envOr("DEPLOYER_ADDRESS", vm.addr(ownerPrivateKey));`);
      
      break;
    }
  }
}

function addBase(c: DeployBuilder, allOpts: Required<SharedL2NativeSuperchainERC20Options>) {

  const Vm = {
    name: 'Vm',
    path: '@forge-std-v1.9.1/Vm.sol',
  };
  c.addImportOnly(Vm);

  const DeployScript = {
    name: 'DeployScript',
    path: '@superfuse-deploy/deployer/DeployScript.sol',
  };
  c.addParent(DeployScript, []);

  const DefaultDeployerFunction = {
    name: 'DefaultDeployerFunction',
    path: '@superfuse-deploy/deployer/DefaultDeployerFunction.sol',
  };
  c.addImportOnly(DefaultDeployerFunction);

  const DeployOptions = {
    name: 'DeployOptions',
    path: '@superfuse-deploy/deployer/DefaultDeployerFunction.sol',
  };
  c.addImportOnly(DeployOptions);

  const L2NativeSuperchainERC20 = {
    name: `${allOpts.contractName}`,
    path: `@main/${allOpts.contractName}.sol`,
  };
  c.addImportOnly(L2NativeSuperchainERC20);
  
  c.addOutsidecode(`string constant Artifact_${allOpts.contractName} = "${allOpts.contractName}.sol:${allOpts.contractName}";`)

  c.addVariable(`${allOpts.contractName} token;`);
  c.addVariable(`string name = "${allOpts.tokenName}";`);
  c.addVariable(`string symbol = "${allOpts.tokenSymbol}";`);
  c.addVariable(`uint8 decimals = ${allOpts.decimals};`);
}

function addDeployOptions(c: DeployBuilder, fn: BaseFunction) {

  c.addFunctionCode(`bytes32 _salt = DeployScript.implSalt();

        DeployOptions memory options = DeployOptions({salt:_salt});`, fn);

}


// function addVotes(c: DeployBuilder, fn : BaseFunction) {

//   c.addVariable('address token;');
//   c.addFunctionCode(`IVotes _token = IVotes(token);`, fn);

// }

function addMintable(c: DeployBuilder, access: Access, allOpts : Required<SharedL2NativeSuperchainERC20Options>) : string {
  // let argCode : string = requireAccessControl2(c, access, allOpts.ownerAddress, 'minter', allOpts.minterAddress);
  return requireAccessControl2(c, access, allOpts.ownerAddress, 'minter', allOpts.minterAddress);
}



function addDeployLogic(c: DeployBuilder, fn: BaseFunction,  allOpts : Required<SharedL2NativeSuperchainERC20Options>) {

  if (allOpts.upgradeable) {
    const Upgrades = {
      name: 'Upgrades',
      path: '@openzeppelin-foundry-upgrades/Upgrades.sol',
    };
    c.addImportOnly(Upgrades);
  }
  // to do fix hardcoded upgradable

  if (allOpts.upgradeable == 'transparent' ) {
    c.addFunctionCode(`vm.startBroadcast();
      address tokenAddress = Upgrades.deployTransparentProxy("${allOpts.contractFile}", abi.encodeCall(${allOpts.contractName}.initialize, ( name, symbol)));
     
      vm.stopBroadcast();
      // DONT forget to save the address of the token
      deployerProcedue.save("${allOpts.contractName}", tokenAddress);
      return ${allOpts.contractName}(tokenAddress);`, fn);

  } else if (allOpts.upgradeable == 'uups') {
    c.addFunctionCode(`vm.startBroadcast();
      address tokenAddress = Upgrades.deployUUPSProxy("${allOpts.contractFile}", abi.encodeCall(${allOpts.contractName}.initialize, ( name, symbol)));
      
      vm.stopBroadcast();
      // DONT forget to save the address of the token
      deployerProcedue.save("${allOpts.contractName}", tokenAddress);
      return ${allOpts.contractName}(tokenAddress);`, fn);

  } else {
    // c.addFunctionCode(`bytes32 _salt = DeployScript.implSalt();

    //     DeployOptions memory options = DeployOptions({salt:_salt});

    //     bytes memory args = abi.encode(name, symbol);
    //     return ${allOpts.contractName}(DefaultDeployerFunction.deploy(deployer, "${allOpts.contractName}", Artifact_${allOpts.contractName}, args, options));`, fn);

    setAccessControl(c, fn, allOpts.access, allOpts.mintable, allOpts.contractName, allOpts.ownerAddress, allOpts.minterAddress);
    

  }

}

function getDeployFunction(allOpts: Required<SharedL2NativeSuperchainERC20Options>) {
  const fn = {
    name: 'deploy',
    args: [],
    returns: [`${allOpts.contractName}` ], 
    kind: 'external' as const,
  };

  return fn;
}
