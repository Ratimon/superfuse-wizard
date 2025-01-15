import type { ContractBuilder, BaseFunction } from './contract';
import { supportsInterface } from './common-functions';

export const accessOptions = [false, 'ownable', 'roles'] as const;
// export const accessOptions = [false, 'ownable', 'roles', 'managed'] as const;

export type Access = typeof accessOptions[number];


function get_authorizeSetRoleFunction() {
  const fn = {
    name: '_authorizeSetRole',
    args: [
      { name: '', type: 'address' },
      { name: '', type: 'uint256' },
      { name: '', type: 'bool' },
    ],
    returns: [ ] , 
    kind: 'internal' as const,
  };

  return fn;
}

/**
 * Sets access control for the contract by adding inheritance.
 */
export function setAccessControl(c: ContractBuilder, access: Access) {
  switch (access) {
    case 'ownable': {

      if (c.addParent(parents.Ownable, [])) {
        c.addConstructorArgument({
          type: 'address',
          name: 'owner_'
        });

        c.addConstructorCode(`_initializeOwner(owner_);`);
      }

      break;
    }
    case 'roles': {

      if (c.addParent(parents.EnumerableRoles)) {
        c.addVariable(`uint256 public constant ADMIN_ROLE = 0;`);
        c.addConstructorArgument({
          type: 'address',
          name: 'defaultAdmin_'
        });
        c.addConstructorCode(`if (defaultAdmin_ != address(0)) {
            _setRole(defaultAdmin_, ADMIN_ROLE, true);
        }`);

        c.addModifier('override(EnumerableRoles)', get_authorizeSetRoleFunction());
        c.addFunctionCode('_checkRole(ADMIN_ROLE);', get_authorizeSetRoleFunction());

      }
      // c.addOverride(parents.EnumerableRoles, supportsInterface);

      break;
    }
    // case 'managed': {
    //   if (c.addParent(parents.AccessManaged, [ {lit: 'initialAuthority'} ])) {
    //     c.addConstructorArgument({
    //       type: 'address',
    //       name: 'initialAuthority'
    //     });
    //   }
    //   break;
    // }
  }
}

/**
 * Enables access control for the contract and restricts the given function with access control.
 */
export function requireAccessControl(c: ContractBuilder, fn: BaseFunction, access: Access, roleIdPrefix: string, roleIdValue: string, roleOwner: string | undefined) {

  if (access === false) {
    access = 'ownable';
  }
  
  setAccessControl(c, access);

  switch (access) {
    case 'ownable': {
      c.addModifier('onlyOwner', fn);
      break;
    }
    case 'roles': {
      // const roleId = roleIdPrefix + '_ROLE';
      // const addedConstant = c.addVariable(`bytes32 public constant ${roleId} = keccak256("${roleId}");`);
      // if (roleOwner && addedConstant) {
      //   c.addConstructorArgument({type: 'address', name: roleOwner});
      //   c.addConstructorCode(`_grantRole(${roleId}, ${roleOwner});`);
      // }
      // c.addModifier(`onlyRole(${roleId})`, fn);
      // break;

      const roleId = roleIdPrefix + '_ROLE';
      const addedConstant = c.addVariable(`uint256 public constant ${roleId} = ${roleIdValue};`);
      if (roleOwner && addedConstant) {
        c.addConstructorArgument({
          type: 'address',
          name: roleOwner
        });
        // c.addConstructorCode(`_grantRole(${roleId}, ${roleOwner});`);

        c.addConstructorCode(`if (${roleOwner} != address(0)) {
          _setRole(${roleOwner}, ${roleId}, true);
        }`);
      }
      c.addModifier(`onlyRole(${roleId})`, fn);
      break;
    }
    // case 'managed': {
    //   c.addModifier('restricted', fn);
    //   break;
    // }
  }
}

const parents = {
  Ownable: {
    name: 'Ownable',
    path: '@solady-v0.0.292/auth/Ownable.sol',
  },
  EnumerableRoles: {
    name: 'EnumerableRoles',
    path: '@solady-v0.0.292/auth/EnumerableRoles.sol',
  },
  // AccessManaged: {
  //   name: 'AccessManaged',
  //   path: '@openzeppelin/contracts/access/manager/AccessManaged.sol',
  // },
};
