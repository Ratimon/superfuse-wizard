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

export function setAccessControl2(c: DeployBuilder, fn: BaseFunction, access: Access, contractName: string, argCode: string| undefined, ownerAddress: string) {

    // let argCode = `bytes memory args = abi.encode(name, symbol, decimals`;
    // argCode = `bytes memory args = abi.encode(name, symbol, decimals);`;
    // if (argCode) {
    //     argCode = argCode.concat(`, name, symbol, decimals`);
    // }

    if (argCode !== undefined) {
        argCode = argCode.concat(`, name, symbol, decimals`);
    } else {
        // argCode = `bytes memory args = abi.encode(name, symbol, decimals);`;
        argCode = `bytes memory args = abi.encode(`;

        switch (access) {

            case false: {
                // argCode = `bytes memory args = abi.encode(name, symbol, decimals);`;
                // c.addFunctionCode(argCode, fn);

                argCode = argCode.concat(`name, symbol, decimals`);

                // argCode.concat(`);`);
                // c.addFunctionCode(argCode, fn);
                // return argCode;
                break;
            }
            case 'ownable': {
                c.addVariable(`address admin = ${ownerAddress};`);
                argCode = argCode.concat(`admin, name, symbol, decimals`);
            //   argCode.concat(`);`);
                // return argCode;
                break;
            }
            case 'roles': {
                c.addVariable(`address defaultAdmin = ${ownerAddress};`);
                argCode = argCode.concat(`defaultAdmin, name, symbol, decimals`);
                // return argCode;
                break;
            }
        }
    } 

    argCode = argCode.concat(`);`);

    c.addFunctionCode(argCode, fn);

    c.addFunctionCode(`return ${contractName}(DefaultDeployerFunction.deploy(deployer, "${contractName}", Artifact_${contractName}, args, options));`, fn);

    // return argCode;
    // return argCode.concat(`);`);

}

// function concatAccessArgCode(c: DeployBuilder, fn: BaseFunction, access: Access, ownerAddress: string) : string {
function concatAccessArgCode(c: DeployBuilder, access: Access, ownerAddress: string) : string {

    // let argCode = `bytes memory args = abi.encode(name, symbol, decimals`;
    let argCode = `bytes memory args = abi.encode(`;

    console.log('argCode: before concatAccessArgCode', argCode);

    switch (access) {
        case false: {
            // argCode = `bytes memory args = abi.encode(name, symbol, decimals);`;
            // c.addFunctionCode(argCode, fn);

            // argCode.concat(`);`);
            // c.addFunctionCode(argCode, fn);
            // return argCode;
            break;
        }
        case 'ownable': {
            c.addVariable(`address admin = ${ownerAddress};`);
            // argCode.concat(`, admin`);
            argCode = argCode.concat(`admin`);
        //   argCode.concat(`);`);
            // return argCode;
            break;
        }
        case 'roles': {
            c.addVariable(`address defaultAdmin = ${ownerAddress};`);
            argCode = argCode.concat(`defaultAdmin`);
            // return argCode;
            break;
        }
    }

    // argCode = argCode.concat(`);`);

    console.log('argCode 2222: after concatAccessArgCode', argCode);

    return argCode;
    // return argCode.concat(`);`);

}

export function requireAccessControl2(c: DeployBuilder, access: Access, ownerAddress: string, roleOwner: string | undefined, roleAddress: string, ) : string {

    // eg. roleOwner = 'minter'

    // let argCode : string = `bytes memory args = abi.encode(name, symbol, decimals`;

    if (access === false) {
        // argCode.concat(`);`);
        access = 'ownable';
    }

//    let argCode = concatAccessArgCode(c, fn, access, ownerAddress);
   let argCode = concatAccessArgCode(c, access, ownerAddress);

   console.log('argCode: after concatAccessArgCode', argCode);


    switch (access) {
        case 'ownable': {
            // c.addVariable(`address ${roleOwner} = ${roleAddress};`);
            // argCode = argCode.concat(`, ${roleOwner}`);
            break;
        }
        case 'roles': {
            c.addVariable(`address ${roleOwner} = ${roleAddress};`);
            argCode = argCode.concat(`, ${roleOwner}`);
            break;
        }
    }

    // argCode = argCode.concat(`);`);
    // argCode = argCode.concat(`);`);

    return argCode;
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