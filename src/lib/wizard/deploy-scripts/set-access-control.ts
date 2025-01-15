import type { DeployBuilder, BaseFunction } from './contract';

export const accessOptions = [false, 'ownable', 'roles'] as const;

export type Access = typeof accessOptions[number];

import { transformToLowerCamelCase } from '../utils/transform-camel';

import { defineFunctions } from '../utils/define-functions';

/**
 * Sets access control for the contract by adding inheritance.
 */
export function setAccessControl(c: DeployBuilder, fn: BaseFunction, access: Access, mintable: boolean, contractName: string, ownerAddress: string, minterAddress: string) {


  switch (access) {

    case false: {

        c.addFunctionCode(`bytes32 _salt = DeployScript.implSalt();

        DeployOptions memory options = DeployOptions({salt:_salt});
        bytes memory args = abi.encode(name, symbol, decimals);
        return ${contractName}(DefaultDeployerFunction.deploy(deployer, "${contractName}", Artifact_${contractName}, args, options));`, fn);

      break;
    }

    case 'ownable': {

        c.addVariable(`address admin = ${ownerAddress};`);

        c.addFunctionCode(`bytes32 _salt = DeployScript.implSalt();

        DeployOptions memory options = DeployOptions({salt:_salt});
        bytes memory args = abi.encode(name, symbol, decimals, admin);
        return ${contractName}(DefaultDeployerFunction.deploy(deployer, "${contractName}", Artifact_${contractName}, args, options));`, fn);

      break;
    }
    case 'roles': {

        c.addVariable(`address admin = ${ownerAddress};`);
        if (mintable) {
            c.addVariable(`address minter = ${minterAddress};`);
        }
        c.addFunctionCode(`bytes32 _salt = DeployScript.implSalt();

        DeployOptions memory options = DeployOptions({salt:_salt});
        bytes memory args = abi.encode(name, symbol, decimals, admin${mintable ? `, minter` : ''});
        return ${contractName}(DefaultDeployerFunction.deploy(deployer, "${contractName}", Artifact_${contractName}, args, options));`, fn);

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

// const functions = defineFunctions({

//   testRenounceOwnership: {
//     kind: 'public' as const,
//     args: [
//     ],
//   },

//   testFuzz_testTransferOwnership: {
//     kind: 'public' as const,
//     args: [
//       { name: '_newOwner', type: 'address' },
//     ],
//   },

// });
