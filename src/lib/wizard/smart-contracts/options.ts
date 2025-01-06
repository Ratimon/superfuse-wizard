import * as path from 'path-browserify';

import type { Contract, ReferencedContract, ImportContract } from './contract';
import { inferTranspiled } from './infer-transpiled';

const upgradeableName = (n: string) => {
  if (n === 'Initializable') {
    return n;
  } else {
    return n.replace(/(Upgradeable)?(?=\.|$)/, 'Upgradeable');
  }
}

const upgradeableImport = (p: ImportContract): ImportContract => {
  const { dir, ext, name } = path.parse(p.path);
  // Use path.posix to get forward slashes
  return {
    ...p,
    path: path.posix.format({
      ext,
      dir: dir.replace(/^@openzeppelin\/contracts/, '@openzeppelin/contracts-upgradeable'),
      name: upgradeableName(name),
    }),
  }
};

export interface Options {
  transformImport?: (parent: ImportContract) => ImportContract;
}

export interface Helpers extends Required<Options> {
  upgradeable: boolean;
  transformName: (name: ReferencedContract) => string;
  transformNames: (names: ReferencedContract[]) => string[];
}

export function withHelpers(contract: Contract, opts: Options = {}): Helpers {
  const contractUpgradeable = contract.upgradeable;

  const transformName = (n: ReferencedContract) => contractUpgradeable && inferTranspiled(n) ? upgradeableName(n.name) : n.name;

  const transformNames = (names: ReferencedContract[]) => 
    names.map(n => contractUpgradeable && inferTranspiled(n) ? upgradeableName(n.name) : n.name);
  
  return {
    upgradeable: contractUpgradeable,
    transformName,
    transformNames,
    transformImport: p1 => {
      const p2 = contractUpgradeable && inferTranspiled(p1) ? upgradeableImport(p1) : p1;
      return opts.transformImport?.(p2) ?? p2;
    },
  };
}
