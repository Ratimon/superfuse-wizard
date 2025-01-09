import type { DeployContract, BaseFunction} from './contract';
import { DeployBuilder } from "./contract";

import type { SharedERC20VotesOptions, OpSec} from '../shared/option-erc20-votes';
import { withCommonDefaults, defaults as commonDefaults } from '../shared/option-erc20-votes';

import { OptionsError } from "../shared/error";

import { printDeployContract } from "./print";
import { setInfo } from "./set-info";


function withDeloyDefaults(opts: SharedERC20VotesOptions): Required<SharedERC20VotesOptions> {
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

export function printDeployERC20Votes(opts: SharedERC20VotesOptions = commonDefaults): string {
  return printDeployContract(buildDeployERC20Votes(opts));
}
  
export function buildDeployERC20Votes(opts: SharedERC20VotesOptions): DeployContract {
    const allOpts = withDeloyDefaults(opts);
  
    const c = new DeployBuilder(allOpts.deployName);

    validateAddress(allOpts.deployerAddress);
    addBase(c, allOpts);
    // setOpsec(c, allOpts.opSec);

    const fn : BaseFunction = getDeployFunction(allOpts);
    // addVotes(c, fn);
    addDeployLogic(c, fn, allOpts);
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

function addBase(c: DeployBuilder, allOpts: Required<SharedERC20VotesOptions>) {

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

  const MyERC20Votes = {
    name: `${allOpts.contractName}`,
    path: `@main/${allOpts.contractName}.sol`,
  };
  c.addImportOnly(MyERC20Votes);
  
  c.addOutsidecode(`string constant Artifact_MyERC20Token = "${allOpts.contractName}.sol:${allOpts.contractName}";`)

  c.addVariable(`${allOpts.contractName} token;`);
  c.addVariable(`string name = "${allOpts.tokenName}";`);
  c.addVariable(`string symbol = "${allOpts.tokenSymbol}";`);
}

// function setOpsec(c: DeployBuilder, opsec: OpSec) {
//   switch (opsec) {
//     case 'address': {
//       c.addVariable(`address owner = vm.envAddress("DEPLOYER_ADDRESS");`);

//       break;
//     }
//     case 'key': {
//       c.addVariable(`uint256 ownerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");`);
//       c.addVariable(`address owner = vm.envOr("DEPLOYER_ADDRESS", vm.addr(ownerPrivateKey));`);

//       break;
//     }
//     case 'mnemonic': {
//       c.addVariable(`string mnemonic = vm.envString("MNEMONIC");`);
//       c.addVariable(`uint256 ownerPrivateKey = vm.deriveKey(mnemonic, "m/44'/60'/0'/0/", 1);`);
//       c.addVariable(`address owner = vm.envOr("DEPLOYER_ADDRESS", vm.addr(ownerPrivateKey));`);
      
//       break;
//     }
//   }
// }

// function addVotes(c: DeployBuilder, fn : BaseFunction) {

//   c.addVariable('address token;');
//   c.addFunctionCode(`IVotes _token = IVotes(token);`, fn);

// }
  

function addDeployLogic(c: DeployBuilder, fn: BaseFunction,  allOpts : Required<SharedERC20VotesOptions>) {

  if (allOpts.upgradeable) {
    const Upgrades = {
      name: 'Upgrades',
      path: '@openzeppelin-foundry-upgrades/Upgrades.sol',
    };
    c.addImportOnly(Upgrades);
  }

  if (allOpts.upgradeable == 'transparent' ) {
    c.addFunctionCode(`vm.startBroadcast();
      address tokenAddress = Upgrades.deployTransparentProxy("${allOpts.contractFile}", abi.encodeCall(${allOpts.contractName}.initialize, ( name, symbol)));
     
      vm.stopBroadcast();
      // DONT forget to save the address of the token
      deployerProcedue.save("${allOpts.contractName}", tokenAddress);
      return MyERC20Votes(tokenAddress);`, fn);
  } else if (allOpts.upgradeable == 'uups') {
    c.addFunctionCode(`vm.startBroadcast();
      address tokenAddress = Upgrades.deployUUPSProxy("${allOpts.contractFile}", abi.encodeCall(${allOpts.contractName}.initialize, ( name, symbol)));
      
      vm.stopBroadcast();
      // DONT forget to save the address of the token
      deployerProcedue.save("${allOpts.contractName}", tokenAddress);
      return MyERC20Votes(tokenAddress);`, fn);
  } else {
    c.addFunctionCode(`bytes32 _salt = DeployScript.implSalt();

        DeployOptions memory options = DeployOptions({salt:_salt});

        bytes memory args = abi.encode(name, symbol);
        return MyERC20Votes(DefaultDeployerFunction.deploy(deployer, "MyERC20Votes", Artifact_MyERC20Token, args, options));`, fn);
  }

}

function getDeployFunction(allOpts: Required<SharedERC20VotesOptions>) {
  const fn = {
    name: 'deploy',
    args: [],
    returns: [`${allOpts.contractName}` ], 
    kind: 'external' as const,
  };

  return fn;
}
