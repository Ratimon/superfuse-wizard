
import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

export type Action =
                    'copy-contract-L2NativeSuperchainERC20'| 'copy-script-L2NativeSuperchainERC20' | 'download-contract-L2NativeSuperchainERC20' | 'download-script-L2NativeSuperchainERC20' |
                    'copy-contract-ERC20Votes'| 'copy-script-ERC20Votes' | 'download-contract-ERC20Votes' | 'download-script-ERC20Votes'

                    
export type GaEvent = {
    id: string;
    data: any;
    event: Action;
    type: string;
};

let initialAnalytics: GaEvent[] = [];

export const analyticsStore : Writable<GaEvent[]>  = writable(initialAnalytics);