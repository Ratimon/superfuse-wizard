import { toIdentifier } from '../utils/to-identifier';

export interface DeployContract {
  kind: 'deploy';

  name: string;
  license: string;
  parents: Parent[];
  natspecTags: NatspecTag[];

  usings: Using[];
  modules: ImportContract[];
  imports: ImportContract[];

  functions: ContractFunction[];
  constructorCode: string[];
  constructorArgs: FunctionArgument[];
  variables: string[];
  outsideCode: string[];
  
}

export type Value = string | number | { lit: string } | { note: string, value: Value };

export interface Parent {
  contract: ImportContract;
  params: Value[];
  importOnly?: boolean;
}

export interface ImportContract extends ReferencedContract {
  path: string;
}

export interface ReferencedContract {
  name: string;
  transpiled?: boolean;
}

export interface Using {
  library: ImportContract;
  usingFor: string;
}

export interface BaseFunction {
  name: string;
  args: FunctionArgument[];
  returns?: string[];
  kind: FunctionKind;
  mutability?: FunctionMutability;
}

export interface ContractFunction extends BaseFunction {
  override: Set<ReferencedContract>;
  modifiers: string[];
  code: string[];
  mutability: FunctionMutability;
  final: boolean;
  comments: string[];
}

export type FunctionKind = 'internal' | 'public' | 'external' | 'external payable';
export type FunctionMutability = typeof mutabilityRank[number];

// Order is important
const mutabilityRank = ['pure', 'view', 'nonpayable', 'payable'] as const;

function maxMutability(a: FunctionMutability, b: FunctionMutability): FunctionMutability {
  return mutabilityRank[
    Math.max(mutabilityRank.indexOf(a), mutabilityRank.indexOf(b))
  ]!;
}

export interface FunctionArgument {
  type: string | ReferencedContract;
  name: string;
}

export interface NatspecTag {
  key: string;
  value: string;
}

export class DeployBuilder implements DeployContract {
  kind: 'deploy' = 'deploy';

  readonly name: string;
  license: string = 'MIT';

  readonly using: Using[] = [];
  readonly modules: ImportContract[] = [];
  readonly natspecTags: NatspecTag[] = [];

  readonly constructorArgs: FunctionArgument[] = [];
  readonly constructorCode: string[] = [];
  readonly variableSet: Set<string> = new Set();
  readonly outsidecodeSet: Set<string> = new Set();

  private parentMap: Map<string, Parent> = new Map<string, Parent>();
  private functionMap: Map<string, ContractFunction> = new Map();

  constructor(name: string) {
    this.name = toIdentifier(name, true);
  }

  get parents(): Parent[] {
    return [...this.parentMap.values()].filter(p => !p.importOnly);
  }

  get imports(): ImportContract[] {

    const pathMap: Map<string, Set<string>> = new Map();
    const allContracts = [
      ...[...this.parentMap.values()].map(p => p.contract),
      ...this.using.map(u => u.library),
      ...this.modules,
    ];

    allContracts.forEach(contract => {
      if (!pathMap.has(contract.path)) {
        pathMap.set(contract.path, new Set());
      }
      pathMap.get(contract.path)!.add(contract.name);
    });

    return Array.from(pathMap.entries()).map(([path, names]) => ({
      path,
      name: Array.from(names).join(', '),
    } as ImportContract));
    
  }

  get usings(): Using[] {
    return [...this.using];
  }

  get functions(): ContractFunction[] {
    return [...this.functionMap.values()];
  }

  get variables(): string[] {
    return [...this.variableSet];
  }
  
  get outsideCode(): string[] {
    return [...this.outsidecodeSet];
  }

  addLibrary(contract: ImportContract, useFor: string ) {
    const using : Using = {library : contract, usingFor: useFor  } ;
    this.using.push(using);
  }

  // addModule(contract: ImportContract ) {
  //   this.modules.push(contract);
  // }

  // addImportOnly(contract: ImportContract): boolean {
  //   const present = this.parentMap.has(contract.name);
  //   this.parentMap.set(contract.name, { contract, params: [], importOnly: true });
  //   return !present;
  // }

  addImportOnly(contract: ImportContract) {
    this.modules.push(contract);
  }


  addParent(contract: ImportContract, params: Value[] = []): boolean {
    const present = this.parentMap.has(contract.name);
    this.parentMap.set(contract.name, { contract, params });
    return !present;
  }

  addOverride(parent: ReferencedContract, baseFn: BaseFunction, mutability?: FunctionMutability) {
    const fn = this.addFunction(baseFn);
    fn.override.add(parent);
    if (mutability) {
      fn.mutability = maxMutability(fn.mutability, mutability);
    }
  }

  addModifier(modifier: string, baseFn: BaseFunction) {
    const fn = this.addFunction(baseFn);
    fn.modifiers.push(modifier);
  }

  addNatspecTag(key: string, value: string) {
    if (!/^(@custom:)?[a-z][a-z\-]*$/.exec(key)) throw new Error(`Invalid natspec key: ${key}`);
    this.natspecTags.push({ key, value });
  }

  private addFunction(baseFn: BaseFunction): ContractFunction {
    const signature = [baseFn.name, '(', ...baseFn.args.map(a => a.name), ')'].join('');
    const got = this.functionMap.get(signature);
    if (got !== undefined) {
      return got;
    } else {
      const fn: ContractFunction = {
        override: new Set<ReferencedContract>(),
        modifiers: [],
        code: [],
        mutability: 'nonpayable',
        final: false,
        comments: [],
        ...baseFn,
      };
      this.functionMap.set(signature, fn);
      return fn;
    }
  }

  addConstructorArgument(arg: FunctionArgument) {
    this.constructorArgs.push(arg);
  }

  addConstructorCode(code: string) {
    this.constructorCode.push(code);
  }

  addFunctionCode(code: string, baseFn: BaseFunction, mutability?: FunctionMutability) {
    const fn = this.addFunction(baseFn);
    if (fn.final) {
      throw new Error(`Function ${baseFn.name} is already finalized`);
    }
    fn.code.push(code);
    if (mutability) {
      fn.mutability = maxMutability(fn.mutability, mutability);
    }
  }

  setFunctionBody(code: string[], baseFn: BaseFunction, mutability?: FunctionMutability) {
    const fn = this.addFunction(baseFn);
    if (fn.code.length > 0) {
      throw new Error(`Function ${baseFn.name} has additional code`);
    }
    fn.code.push(...code);
    fn.final = true;
    if (mutability) {
      fn.mutability = mutability;
    }
  }

  setFunctionComments(comments: string[], baseFn: BaseFunction) {
    const fn = this.addFunction(baseFn);
    if (fn.comments.length > 0) {
      throw new Error(`Function ${baseFn.name} already has comments`);
    }
    fn.comments = comments;
  }

  /**
   * Note: The type in the variable is not currently transpiled, even if it refers to a contract
   */
  addVariable(code: string): boolean {
    const present = this.variableSet.has(code);
    this.variableSet.add(code);
    return !present;
  }

  /**
 * Note: The type in the variable is not currently transpiled, even if it refers to a contract
 */
  addOutsidecode(code: string): boolean {
    const present = this.variableSet.has(code);
    this.outsidecodeSet.add(code);
    return !present;
  }
}
