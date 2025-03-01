import type { GenericOptions } from './build-generic';

export type Kind = GenericOptions['kind'];

export function sanitizeKind(kind: unknown): Kind {
  if (typeof kind === 'string') {
    if (isKind(kind)) {
      return kind;
    }
  }
  return 'L2NativeSuperchainERC20';
}

function isKind<T>(value: Kind | T): value is Kind {
  switch (value) {
    case 'L2NativeSuperchainERC20':
      return true;
    case 'ERC20Votes':
      return true;

    default: {
      // Static assert that we've checked all kinds.
      const _: T = value;
      return false;
    }
  }
}