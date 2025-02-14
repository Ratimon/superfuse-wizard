import type { TestBuilder, BaseFunction } from './contract';

export const accessOptions = [false, 'ownable', 'roles'] as const;

export type Access = typeof accessOptions[number];

import { transformToLowerCamelCase } from '../utils/transform-camel';

import { defineFunctions } from '../utils/define-functions';

/**
 * Sets access control for the contract by adding inheritance.
 */
export function setAccessControl(c: TestBuilder, access: Access, contractName: string) {

  const targetContractName = transformToLowerCamelCase(contractName);

  switch (access) {
    case 'ownable': {

      c.addImportOnly(parents.Ownable);

      c.addFunctionCode(`vm.expectEmit(true, true, true, true);
        emit Ownable.OwnershipTransferred(owner, address(0));

        vm.prank(owner);
        ${targetContractName}.renounceOwnership();
        assertEq(${targetContractName}.owner(), address(0));`, functions.testRenounceOwnership);

      c.addFunctionCode(`vm.assume(_newOwner != owner);
        vm.assume(_newOwner != ZERO_ADDRESS);

        vm.expectEmit(true, true, true, true);
        emit Ownable.OwnershipTransferred(owner, _newOwner);

        vm.prank(owner);
        ${targetContractName}.transferOwnership(_newOwner);

        assertEq(${targetContractName}.owner(), _newOwner);`, functions.testFuzz_testTransferOwnership);

      break;
    }
    case 'roles': {

      break;
    }
  }
}

// /**
//  * Enables access control for the contract and restricts the given function with access control.
//  */
// export function requireAccessControl(c: TestBuilder, fn: BaseFunction, access: Access, roleIdPrefix: string, roleIdValue: string, roleOwner: string | undefined) {
//   if (access === false) {
//     access = 'ownable';
//   }
  
//   setAccessControl(c, access);

//   switch (access) {
//     case 'ownable': {
//       c.addModifier('onlyOwner', fn);
//       break;
//     }
//     case 'roles': {
//       // const roleId = roleIdPrefix + '_ROLE';
//       // const addedConstant = c.addVariable(`bytes32 public constant ${roleId} = keccak256("${roleId}");`);
//       // if (roleOwner && addedConstant) {
//       //   c.addConstructorArgument({type: 'address', name: roleOwner});
//       //   c.addConstructorCode(`_grantRole(${roleId}, ${roleOwner});`);
//       // }
//       // c.addModifier(`onlyRole(${roleId})`, fn);
//       // break;

//       const roleId = roleIdPrefix + '_ROLE';
//       const addedConstant = c.addVariable(`bytes32 public constant ${roleId} = ${roleIdValue};`);
//       if (roleOwner && addedConstant) {
//         c.addConstructorArgument({
//           type: 'address',
//           name: roleOwner
//         });
//         // c.addConstructorCode(`_grantRole(${roleId}, ${roleOwner});`);

//         c.addConstructorCode(`if (${roleOwner} != address(0)) {
//           _setRole(${roleOwner}, ${roleId}, true);
//         }`);
//       }
//       c.addModifier(`onlyRole(${roleId})`, fn);
//       break;
//     }
//   }
// }

const functions = defineFunctions({

  testRenounceOwnership: {
    kind: 'public' as const,
    args: [
    ],
  },

  testFuzz_testTransferOwnership: {
    kind: 'public' as const,
    args: [
      { name: '_newOwner', type: 'address' },
    ],
  },

});

const parents = {
  Ownable: {
    name: 'Ownable',
    path: '@solady-v0.1.8/auth/Ownable.sol',
  },
  // Ownable: {
  //   name: 'Ownable',
  //   path: '@solady-v0.0.245/auth/Ownable.sol',
  // },
};