import type { TestContract, BaseFunction} from './contract';
import { TestBuilder } from "./contract";

import type { SharedERC20VotesOptions, OpSec} from '../shared/option-erc20-votes';
import { withCommonDefaults, defaults as commonDefaults } from '../shared/option-erc20-votes';

import { printTestContract } from "./print";
import { setInfo } from "./set-info";

import { defineFunctions } from '../utils/define-functions';


function withTestDefaults(opts: SharedERC20VotesOptions): Required<SharedERC20VotesOptions> {
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

export function printTestERC20Votes(opts: SharedERC20VotesOptions = commonDefaults): string {
  return printTestContract(buildTestERC20Votes(opts));
}
  
export function buildTestERC20Votes(opts: SharedERC20VotesOptions): TestContract {
    const allOpts = withTestDefaults(opts);
  
    const c = new TestBuilder(allOpts.testName);
    addBase(c, allOpts);
    setOpsec(c, allOpts.opSec);

    setConstructorTestLogic(c, allOpts);
    setERC7802TestLogic(c);
    setInfo(c, allOpts.testInfo);
  
    return c;
}

function addBase(c: TestBuilder, allOpts: Required<SharedERC20VotesOptions>) {

  const console = {
    name: 'console',
    path: '@forge-std-v1.9.1/console.sol',
  };
  c.addImportOnly(console);

  const Test = {
    name: 'Test',
    path: '@forge-std-v1.9.1/Test.sol',
  };
  c.addParent(Test, []);

  const Predeploys = {
    name: 'Predeploys',
    path: '@superfuse-core/libraries/Predeploys.sol',
  };
  c.addImportOnly(Predeploys);

  const IERC20 = {
    name: 'IERC20',
    path: '@openzeppelin-v0.5.0.2/token/ERC20/IERC20.sol',
  };
  c.addImportOnly(IERC20);


  const SuperchainERC20 = {
    name: 'SuperchainERC20',
    path: '@superfuse-core/L2/SuperchainERC20.sol',
  };
  c.addImportOnly(SuperchainERC20);

  const IERC7802 = {
    name: 'IERC7802',
    path: '@superfuse-core/interfaces/L2/IERC7802.sol',
  };
  c.addImportOnly(IERC7802);

  const ISuperchainERC20 = {
    name: 'ISuperchainERC20',
    path: '@superfuse-core/interfaces/L2/ISuperchainERC20.sol',
  };
  c.addImportOnly(ISuperchainERC20);

  const MyERC20Votes = {
    name: `${allOpts.contractName}`,
    path: `@main/${allOpts.contractName}.sol`,
  };
  c.addImportOnly(MyERC20Votes);

  const IDeployer = {
    name: 'IDeployer',
    path: '@superfuse-deploy/deployer/DeployScript.sol',
  };
  c.addImportOnly(IDeployer);
  
  const getDeployer = {
    name: 'getDeployer',
    path: '@superfuse-deploy/deployer/DeployScript.sol',
  };
  c.addImportOnly(getDeployer);

  const DeployMyERC20VotesScript = {
    name: `${allOpts.deployName}`,
    path: `@script/${allOpts.conventionNumber}_${allOpts.deployName}.s.sol`,
  };
  c.addImportOnly(DeployMyERC20VotesScript);
  

  c.addVariable(`address alice;`);
  c.addVariable(`address bob;`);

  c.addVariable(`IDeployer deployerProcedue;`);

  c.addVariable(`address internal constant ZERO_ADDRESS = address(0);`);
  c.addVariable(`address internal constant SUPERCHAIN_TOKEN_BRIDGE = Predeploys.SUPERCHAIN_TOKEN_BRIDGE;`);
  c.addVariable(`address internal constant MESSENGER = Predeploys.L2_TO_L2_CROSS_DOMAIN_MESSENGER;`);

  c.addVariable(`MyERC20Votes public superchainERC20;`);

  c.addFunctionCode(`alice = makeAddr("alice");
        bob = makeAddr("bob");

        deployerProcedue = getDeployer();
        deployerProcedue.setAutoBroadcast(false);

        console.log("Setup ${allOpts.contractName} ... ");

        ${allOpts.deployName} superchainERC20Deployments = new ${allOpts.deployName}();
        superchainERC20 = superchainERC20Deployments.deploy();

        deployerProcedue.deactivatePrank();`, functions.setUp);
}


function setOpsec(c: TestBuilder, opsec: OpSec) {
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

function setConstructorTestLogic(c: TestBuilder, allOpts: Required<SharedERC20VotesOptions>) {
  c.addFunctionCode(`assertEq(superchainERC20.name(), "${allOpts.tokenName}");
        assertEq(superchainERC20.symbol(), "${allOpts.tokenSymbol}");`, functions.test_constructor);
}
  

function setERC7802TestLogic(c: TestBuilder) {
  // _mockAndExpect(address _receiver, bytes memory _calldata, bytes memory _returned)
  c.addFunctionCode(`vm.mockCall(_receiver, _calldata, _returned);
        vm.expectCall(_receiver, _calldata);`, functions._mockAndExpect);

  //  testFuzz_crosschainMint_callerNotBridge_reverts(address _caller, address _to, uint256 _amount)
  c.addFunctionCode(`// Ensure the caller is not the bridge
        vm.assume(_caller != SUPERCHAIN_TOKEN_BRIDGE);

        // Expect the revert with 'Unauthorized' selector
        vm.expectRevert(ISuperchainERC20.Unauthorized.selector);

        // Call the 'mint' function with the non-bridge caller
        vm.prank(_caller);
        superchainERC20.crosschainMint(_to, _amount);`, functions.testFuzz_crosschainMint_callerNotBridge_reverts);

  // testFuzz_crosschainMint_succeeds(address _to, uint256 _amount)
  c.addFunctionCode(`// Ensure '_to' is not the zero address
        vm.assume(_to != ZERO_ADDRESS);

        _amount = bound(_amount, 0, type(uint208).max);

        // Get the total supply and balance of '_to' before the mint to compare later on the assertions
        uint256 _totalSupplyBefore = superchainERC20.totalSupply();
        uint256 _toBalanceBefore = superchainERC20.balanceOf(_to);

        // Look for the emit of the 'Transfer' event
        vm.expectEmit(address(superchainERC20));
        emit IERC20.Transfer(ZERO_ADDRESS, _to, _amount);

        // Look for the emit of the 'CrosschainMint' event
        vm.expectEmit(address(superchainERC20));
        emit IERC7802.CrosschainMint(_to, _amount, SUPERCHAIN_TOKEN_BRIDGE);

        // Call the 'mint' function with the bridge caller
        vm.prank(SUPERCHAIN_TOKEN_BRIDGE);
        superchainERC20.crosschainMint(_to, _amount);

        // Check the total supply and balance of '_to' after the mint were updated correctly
        assertEq(superchainERC20.totalSupply(), _totalSupplyBefore + _amount);
        assertEq(superchainERC20.balanceOf(_to), _toBalanceBefore + _amount);`, functions.testFuzz_crosschainMint_succeeds);

  // testFuzz_crosschainBurn_callerNotBridge_reverts(address _caller, address _from, uint256 _amount)
  c.addFunctionCode(`/// Ensure the caller is not the bridge
        vm.assume(_caller != SUPERCHAIN_TOKEN_BRIDGE);

        // Expect the revert with 'Unauthorized' selector
        vm.expectRevert(ISuperchainERC20.Unauthorized.selector);

        // Call the 'burn' function with the non-bridge caller
        vm.prank(_caller);
        superchainERC20.crosschainBurn(_from, _amount);`, functions.testFuzz_crosschainBurn_callerNotBridge_reverts);

  // testFuzz_crosschainBurn_succeeds(address _from, uint256 _amount)
  c.addFunctionCode(`// Ensure '_from' is not the zero address
        vm.assume(_from != ZERO_ADDRESS);

        _amount = bound(_amount, 0, type(uint208).max);

        // Mint some tokens to '_from' so then they can be burned
        vm.prank(SUPERCHAIN_TOKEN_BRIDGE);
        superchainERC20.crosschainMint(_from, _amount);

        // Get the total supply and balance of '_from' before the burn to compare later on the assertions
        uint256 _totalSupplyBefore = superchainERC20.totalSupply();
        uint256 _fromBalanceBefore = superchainERC20.balanceOf(_from);

        // Look for the emit of the 'Transfer' event
        vm.expectEmit(address(superchainERC20));
        emit IERC20.Transfer(_from, ZERO_ADDRESS, _amount);

        // Look for the emit of the 'CrosschainBurn' event
        vm.expectEmit(address(superchainERC20));
        emit IERC7802.CrosschainBurn(_from, _amount, SUPERCHAIN_TOKEN_BRIDGE);

        // Call the 'burn' function with the bridge caller
        vm.prank(SUPERCHAIN_TOKEN_BRIDGE);
        superchainERC20.crosschainBurn(_from, _amount);

        // Check the total supply and balance of '_from' after the burn were updated correctly
        assertEq(superchainERC20.totalSupply(), _totalSupplyBefore - _amount);
        assertEq(superchainERC20.balanceOf(_from), _fromBalanceBefore - _amount);`, functions.testFuzz_crosschainBurn_succeeds);
}

const functions = defineFunctions({

  setUp: {
    kind: 'public' as const,
    args: [
    ],
  },

  test_constructor: {
    kind: 'public' as const,
    args: [
    ],
    mutability: 'view' as const,
  },

  _mockAndExpect: {
    kind: 'internal' as const,
    args: [
      { name: '_receiver', type: 'address' },
      { name: '_calldata', type: 'bytes memory' },
      { name: '_returned', type: 'bytes memory' },
    ],
  },

  testFuzz_crosschainMint_callerNotBridge_reverts: {
    kind: 'public' as const,
    args: [
      { name: '_caller', type: 'address' },
      { name: '_to', type: 'address' },
      { name: '_amount', type: 'uint256' },
    ],
  },

  testFuzz_crosschainMint_succeeds: {
    kind: 'public' as const,
    args: [
      { name: '_to', type: 'address' },
      { name: '_amount', type: 'uint256' },
    ],
  },

  testFuzz_crosschainBurn_callerNotBridge_reverts: {
    kind: 'public' as const,
    args: [
      { name: '_caller', type: 'address' },
      { name: '_from', type: 'address' },
      { name: '_amount', type: 'uint256' },
    ],
  },

  testFuzz_crosschainBurn_succeeds: {
    kind: 'public' as const,
    args: [
      { name: '_from', type: 'address' },
      { name: '_amount', type: 'uint256' },
    ],
  }
});
