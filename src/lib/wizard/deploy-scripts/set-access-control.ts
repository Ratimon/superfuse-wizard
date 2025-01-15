import type { DeployBuilder, BaseFunction } from './contract';

export const accessOptions = [false, 'ownable', 'roles'] as const;

export type Access = typeof accessOptions[number];

export function setAccessControl(c: DeployBuilder, fn: BaseFunction, access: Access, contractName: string, argCode: string| undefined, ownerAddress: string) {

    if (argCode !== undefined) {
        argCode = argCode.concat(`, name, symbol, decimals`);
    } else {
        argCode = `bytes memory args = abi.encode(`;

        switch (access) {
            case false: {
                argCode = argCode.concat(`name, symbol, decimals`);
                break;
            }
            case 'ownable': {
                c.addVariable(`address admin = ${ownerAddress};`);
                argCode = argCode.concat(`admin, name, symbol, decimals`);
                break;
            }
            case 'roles': {
                c.addVariable(`address defaultAdmin = ${ownerAddress};`);
                argCode = argCode.concat(`defaultAdmin, name, symbol, decimals`);
                break;
            }
        }
    } 

    argCode = argCode.concat(`);`);
    c.addFunctionCode(argCode, fn);
    c.addFunctionCode(`return ${contractName}(DefaultDeployerFunction.deploy(deployer, "${contractName}", Artifact_${contractName}, args, options));`, fn);
}

// function concatAccessArgCode(c: DeployBuilder, fn: BaseFunction, access: Access, ownerAddress: string) : string {
function concatAccessArgCode(c: DeployBuilder, access: Access, ownerAddress: string) : string {

    let argCode = `bytes memory args = abi.encode(`;

    switch (access) {
        case false: {
            break;
        }
        case 'ownable': {
            c.addVariable(`address admin = ${ownerAddress};`);
            argCode = argCode.concat(`admin`);
            break;
        }
        case 'roles': {
            c.addVariable(`address defaultAdmin = ${ownerAddress};`);
            argCode = argCode.concat(`defaultAdmin`);
            break;
        }
    }
    return argCode;
}

export function requireAccessControl(c: DeployBuilder, access: Access, ownerAddress: string, roleOwner: string | undefined, roleAddress: string, ) : string {

    if (access === false) {
        access = 'ownable';
    }

   let argCode = concatAccessArgCode(c, access, ownerAddress);

    switch (access) {
        case 'ownable': {
            break;
        }
        case 'roles': {
            c.addVariable(`address ${roleOwner} = ${roleAddress};`);
            argCode = argCode.concat(`, ${roleOwner}`);
            break;
        }
    }
    return argCode;
}