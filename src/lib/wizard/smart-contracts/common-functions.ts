import type { BaseFunction } from './contract';

export const supportsInterface: BaseFunction = {
  name: 'supportsInterface',
  kind: 'public',
  args: [
    { name: '_interfaceId', type: 'bytes4' },
  ],
  returns: ['bool'],
  mutability: 'view',
};
