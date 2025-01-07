import type { DeployContract, BaseFunction} from './contract';
import { DeployBuilder } from "./contract";

import type { SharedERC20VotesOptions} from '../shared/option-erc20-votes';
import { withCommonDefaults, defaults as commonDefaults } from '../shared/option-erc20-votes';

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
    addBase(c, allOpts);

    const fn : BaseFunction = getDeployFunction();
    // addVotes(c, fn);
    addDeployLogic(c, fn, allOpts);
    setInfo(c, allOpts.deployInfo);
  
    return c;
}

function addBase(c: DeployBuilder, allOpts: Required<SharedERC20VotesOptions>) {

  const Vm = {
    name: 'Vm',
    path: '@redprint-forge-std/Vm.sol',
  };
  c.addImportOnly(Vm);

  const DeployScript = {
    name: 'DeployScript',
    path: '@redprint-deploy/deployer/DeployScript.sol',
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
    name: 'MyERC20Votes',
    path: '@main/ERC20Votes.sol',
  };
  c.addImportOnly(MyERC20Votes);
  
  c.addOutsidecode(`string constant Artifact_MyERC20Token = "ERC20Votes.sol:${allOpts.contractName}";`)

  c.addVariable('MyERC20Votes token;');
  c.addVariable(`string name = "${allOpts.tokenName}";`);
  c.addVariable(`string symbol = "${allOpts.tokenSymbol}";`);
}

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

function getDeployFunction() {
  const fn = {
    name: 'run',
    args: [],
    returns: ['MyERC20Votes' ], 
    kind: 'external' as const,
  };

  return fn;
}