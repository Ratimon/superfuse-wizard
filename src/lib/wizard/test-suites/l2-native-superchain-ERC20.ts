import type { TestContract, BaseFunction} from './contract';
import { TestBuilder } from "./contract";

import type { Access } from './set-access-control';
import {setAccessControl } from './set-access-control';

import type { SharedL2NativeSuperchainERC20Options, OpSec} from '../shared/option-l2-native-superchain-ERC20';
import { withCommonDefaults, defaults as commonDefaults } from '../shared/option-l2-native-superchain-ERC20';

import { printTestContract } from "./print";
import { setInfo } from "./set-info";

import { transformToLowerCamelCase } from '../utils/transform-camel';

import { defineFunctions } from '../utils/define-functions';


function withTestDefaults(opts: SharedL2NativeSuperchainERC20Options): Required<SharedL2NativeSuperchainERC20Options> {
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

export function printTestL2NativeSuperchainERC20(opts: SharedL2NativeSuperchainERC20Options = commonDefaults): string {
  return printTestContract(buildTestL2NativeSuperchainERC20(opts));
}
  
export function buildTestL2NativeSuperchainERC20(opts: SharedL2NativeSuperchainERC20Options): TestContract {
    const allOpts = withTestDefaults(opts);
  
    const c = new TestBuilder(allOpts.testName);

    const { access, upgradeable, contractInfo } = allOpts;

    addBase(c, allOpts);
    setOpsec(c, allOpts.opSec);

    setConstructorTestLogic(c, allOpts);
    setERC7802TestLogic(c, allOpts);

    const camelCaseContractName = transformToLowerCamelCase(allOpts.contractName);

    if (allOpts.mintable) {
       addMintable(c, access, camelCaseContractName);
    }

    setInfo(c, allOpts.testInfo);
  
    return c;
}

// const transformToLowerCamelCase = (input: string): string => 
//   input.charAt(0).toLowerCase() + input.slice(1);

function addBase(c: TestBuilder, allOpts: Required<SharedL2NativeSuperchainERC20Options>) {

  const camelCaseContractName = transformToLowerCamelCase(allOpts.contractName);

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

  const L2NativeSuperchainERC20 = {
    name: `${allOpts.contractName}`,
    path: `@main/${allOpts.contractName}.sol`,
  };
  c.addImportOnly(L2NativeSuperchainERC20);

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

  const DeployL2NativeSuperchainERC20Script = {
    name: `${allOpts.deployName}`,
    path: `@script/${allOpts.conventionNumber}_${allOpts.deployName}.s.sol`,
  };
  c.addImportOnly(DeployL2NativeSuperchainERC20Script);

//   const IOwnable = {
//     name: 'IOwnable',
//     path: '@contracts-bedrock/universal/interfaces/IOwnable.sol',
//   };
//   c.addImportOnly(IOwnable);

//   const Ownable = {
//     name: 'Ownable',
//     path: '@solady-v0.0.245/auth/Ownable.sol',
//   };
//   c.addImportOnly(Ownable);

//   const ERC20 = {
//     name: 'ERC20',
//     path: '@solady-v0.0.245/tokens/ERC20.sol',
//   };
//   c.addImportOnly(ERC20);


  c.addVariable(`address alice;`);
  c.addVariable(`address bob;`);

  c.addVariable(`IDeployer deployerProcedue;`);

  c.addVariable(`address internal constant ZERO_ADDRESS = address(0);`);
  c.addVariable(`address internal constant SUPERCHAIN_TOKEN_BRIDGE = Predeploys.SUPERCHAIN_TOKEN_BRIDGE;`);
  c.addVariable(`address internal constant MESSENGER = Predeploys.L2_TO_L2_CROSS_DOMAIN_MESSENGER;`);

  c.addVariable(`${allOpts.contractName} public ${camelCaseContractName};`);

  c.addFunctionCode(`alice = makeAddr("alice");
        bob = makeAddr("bob");

        deployerProcedue = getDeployer();
        deployerProcedue.setAutoBroadcast(false);

        console.log("Setup ${allOpts.contractName} ... ");

        ${allOpts.deployName} ${camelCaseContractName}Deployments = new ${allOpts.deployName}();
        ${camelCaseContractName} = ${camelCaseContractName}Deployments.deploy();

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

function setConstructorTestLogic(c: TestBuilder, allOpts: Required<SharedL2NativeSuperchainERC20Options>) {

  const camelCaseContractName = transformToLowerCamelCase(allOpts.contractName);
  c.addFunctionCode(`assertEq(${camelCaseContractName}.name(), "${allOpts.tokenName}");
        assertEq(${camelCaseContractName}.symbol(), "${allOpts.tokenSymbol}");
        assertEq(${camelCaseContractName}.decimals(), ${allOpts.decimals});
        assertEq(${camelCaseContractName}.owner(), owner);`, functions.test_constructor);
}
  

function setERC7802TestLogic(c: TestBuilder, allOpts: Required<SharedL2NativeSuperchainERC20Options>) {

  const camelCaseContractName = transformToLowerCamelCase(allOpts.contractName);
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
        ${camelCaseContractName}.crosschainMint(_to, _amount);`, functions.testFuzz_crosschainMint_callerNotBridge_reverts);

  // testFuzz_crosschainMint_succeeds(address _to, uint256 _amount)
  c.addFunctionCode(`// Ensure '_to' is not the zero address
        vm.assume(_to != ZERO_ADDRESS);

        _amount = bound(_amount, 0, type(uint208).max);

        // Get the total supply and balance of '_to' before the mint to compare later on the assertions
        uint256 _totalSupplyBefore = ${camelCaseContractName}.totalSupply();
        uint256 _toBalanceBefore = ${camelCaseContractName}.balanceOf(_to);

        // Look for the emit of the 'Transfer' event
        vm.expectEmit(address(${camelCaseContractName}));
        emit IERC20.Transfer(ZERO_ADDRESS, _to, _amount);

        // Look for the emit of the 'CrosschainMint' event
        vm.expectEmit(address(${camelCaseContractName}));
        emit IERC7802.CrosschainMint(_to, _amount, SUPERCHAIN_TOKEN_BRIDGE);

        // Call the 'mint' function with the bridge caller
        vm.prank(SUPERCHAIN_TOKEN_BRIDGE);
        ${camelCaseContractName}.crosschainMint(_to, _amount);

        // Check the total supply and balance of '_to' after the mint were updated correctly
        assertEq(${camelCaseContractName}.totalSupply(), _totalSupplyBefore + _amount);
        assertEq(${camelCaseContractName}.balanceOf(_to), _toBalanceBefore + _amount);`, functions.testFuzz_crosschainMint_succeeds);

  // testFuzz_crosschainBurn_callerNotBridge_reverts(address _caller, address _from, uint256 _amount)
  c.addFunctionCode(`/// Ensure the caller is not the bridge
        vm.assume(_caller != SUPERCHAIN_TOKEN_BRIDGE);

        // Expect the revert with 'Unauthorized' selector
        vm.expectRevert(ISuperchainERC20.Unauthorized.selector);

        // Call the 'burn' function with the non-bridge caller
        vm.prank(_caller);
        ${camelCaseContractName}.crosschainBurn(_from, _amount);`, functions.testFuzz_crosschainBurn_callerNotBridge_reverts);

  // testFuzz_crosschainBurn_succeeds(address _from, uint256 _amount)
  c.addFunctionCode(`// Ensure '_from' is not the zero address
        vm.assume(_from != ZERO_ADDRESS);

        _amount = bound(_amount, 0, type(uint208).max);

        // Mint some tokens to '_from' so then they can be burned
        vm.prank(SUPERCHAIN_TOKEN_BRIDGE);
        ${camelCaseContractName}.crosschainMint(_from, _amount);

        // Get the total supply and balance of '_from' before the burn to compare later on the assertions
        uint256 _totalSupplyBefore = ${camelCaseContractName}.totalSupply();
        uint256 _fromBalanceBefore = ${camelCaseContractName}.balanceOf(_from);

        // Look for the emit of the 'Transfer' event
        vm.expectEmit(address(${camelCaseContractName}));
        emit IERC20.Transfer(_from, ZERO_ADDRESS, _amount);

        // Look for the emit of the 'CrosschainBurn' event
        vm.expectEmit(address(${camelCaseContractName}));
        emit IERC7802.CrosschainBurn(_from, _amount, SUPERCHAIN_TOKEN_BRIDGE);

        // Call the 'burn' function with the bridge caller
        vm.prank(SUPERCHAIN_TOKEN_BRIDGE);
        ${camelCaseContractName}.crosschainBurn(_from, _amount);

        // Check the total supply and balance of '_from' after the burn were updated correctly
        assertEq(${camelCaseContractName}.totalSupply(), _totalSupplyBefore - _amount);
        assertEq(${camelCaseContractName}.balanceOf(_from), _fromBalanceBefore - _amount);`, functions.testFuzz_crosschainBurn_succeeds);
}


function addMintable(c: TestBuilder, access: Access, targetContractName: string) {

  

    const Ownable = {
        name: 'Ownable',
        path: '@solady-v0.0.245/auth/Ownable.sol',
    };
    c.addImportOnly(Ownable);

    const IERC20 = {
        name: 'IERC20',
        path: '@openzeppelin-v0.5.0.2/token/ERC20/IERC20.sol',
    };
    c.addImportOnly(IERC20);

    const ERC20 = {
        name: 'ERC20',
        path: '@solady-v0.0.245/tokens/ERC20.sol',
    };
    c.addImportOnly(ERC20);

    setAccessControl(c, access, targetContractName);

    // testFuzz_mintTo_succeeds(address _to, uint256 _amount)
    c.addFunctionCode(`vm.expectEmit(true, true, true, true);
        emit IERC20.Transfer(address(0), _to, _amount);

        vm.prank(owner);
        ${targetContractName}.mintTo(_to, _amount);

        assertEq(${targetContractName}.totalSupply(), _amount);
        assertEq(${targetContractName}.balanceOf(_to), _amount);`, get_2args_testFuzz_mintTo_succeeds());

    // testFuzz_mintTo_succeeds(address _minter, address _to, uint256 _amount)
    c.addFunctionCode(`vm.assume(_minter != owner);

        // Expect the revert with 'Unauthorized' selector
        vm.expectRevert(Ownable.Unauthorized.selector);

        vm.prank(_minter);
        ${targetContractName}.mintTo(_to, _amount);`, get_3args_testFuzz_mintTo_succeeds());

    // testFuzz_transfer_succeeds(address _sender, uint256 _amount)
    c.addFunctionCode(`vm.assume(_sender != ZERO_ADDRESS);
        vm.assume(_sender != bob);

        vm.prank(owner);
        ${targetContractName}.mintTo(_sender, _amount);

        vm.expectEmit(true, true, true, true);
        emit IERC20.Transfer(_sender, bob, _amount);

        vm.prank(_sender);
        assertTrue(${targetContractName}.transfer(bob, _amount));
        assertEq(${targetContractName}.totalSupply(), _amount);

        assertEq(${targetContractName}.balanceOf(_sender), 0);
        assertEq(${targetContractName}.balanceOf(bob), _amount);`, functions.testFuzz_transfer_succeeds);

    // testFuzz_transferFrom_succeeds(address _spender, uint256 _amount)
    c.addFunctionCode(`vm.assume(_spender != ZERO_ADDRESS);
        vm.assume(_spender != bob);
        vm.assume(_spender != alice);

        vm.prank(owner);
        ${targetContractName}.mintTo(bob, _amount);

        vm.prank(bob);
        ${targetContractName}.approve(_spender, _amount);

        vm.prank(_spender);
        vm.expectEmit(true, true, true, true);
        emit IERC20.Transfer(bob, alice, _amount);
        assertTrue(${targetContractName}.transferFrom(bob, alice, _amount));

        assertEq(${targetContractName}.balanceOf(bob), 0);
        assertEq(${targetContractName}.balanceOf(alice), _amount);`, functions.testFuzz_transferFrom_succeeds);

    // testFuzz_transferInsufficientBalance_reverts(address _to, uint256 _mintAmount, uint256 _sendAmount)
    c.addFunctionCode(`vm.assume(_mintAmount < type(uint256).max);
        _sendAmount = bound(_sendAmount, _mintAmount + 1, type(uint256).max);

        vm.prank(owner);
        ${targetContractName}.mintTo(address(this), _mintAmount);

        vm.expectRevert(ERC20.InsufficientBalance.selector);
        ${targetContractName}.transfer(_to, _sendAmount);`, functions.testFuzz_transferInsufficientBalance_reverts);

    // testFuzz_transferFromInsufficientAllowance_reverts(address _to, address _from, uint256 _approval, uint256 _amount
    c.addFunctionCode(`vm.assume(_from != ZERO_ADDRESS);
        vm.assume(_approval < type(uint256).max);
        _amount = _bound(_amount, _approval + 1, type(uint256).max);

        vm.prank(owner);
        ${targetContractName}.mintTo(_from, _amount);

        vm.prank(_from);
        ${targetContractName}.approve(address(this), _approval);

        vm.expectRevert(ERC20.InsufficientAllowance.selector);
        ${targetContractName}.transferFrom(_from, _to, _amount);`, functions.testFuzz_transferFromInsufficientAllowance_reverts);
}



function get_2args_testFuzz_mintTo_succeeds() : BaseFunction {
    const fn = {
      name: 'testFuzz_mintTo_succeeds',
      args: [
        { name: '_to', type: 'address' },
        { name: '_amount', type: 'uint256' },
      ],
      returns: [], 
      kind: 'public' as const,
    };
  
    return fn;
}

function get_3args_testFuzz_mintTo_succeeds() : BaseFunction {
    const fn = {
      name: 'testFuzz_mintTo_succeeds',
      args: [
        { name: '_minter', type: 'address' },
        { name: '_to', type: 'address' },
        { name: '_amount', type: 'uint256' },
      ],
      returns: [], 
      kind: 'public' as const,
    };
  
    return fn;
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
  },

//   testFuzz_mintTo_succeeds: {
//     kind: 'public' as const,
//     args: [
//       { name: '_to', type: 'address' },
//       { name: '_amount', type: 'uint256' },
//     ],
//   },

  testFuzz_transfer_succeeds: {
    kind: 'public' as const,
    args: [
      { name: '_sender', type: 'address' },
      { name: '_amount', type: 'uint256' },
    ],
  },

  testFuzz_transferFrom_succeeds: {
    kind: 'public' as const,
    args: [
      { name: '_spender', type: 'address' },
      { name: '_amount', type: 'uint256' },
    ],
  },

  testFuzz_transferInsufficientBalance_reverts: {
    kind: 'public' as const,
    args: [
      { name: '_to', type: 'address' },
      { name: '_mintAmount', type: 'uint256' },
      { name: '_sendAmount', type: 'uint256' },
    ],
  },

  testFuzz_transferFromInsufficientAllowance_reverts: {
    kind: 'public' as const,
    args: [
      { name: '_to', type: 'address' },
      { name: '_from', type: 'address' },
      { name: '_approval', type: 'uint256' },
      { name: '_amount', type: 'uint256' },
    ],
  },

});
