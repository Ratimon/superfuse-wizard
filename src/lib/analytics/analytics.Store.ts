
import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

export type Action =
                    'copy-contract-L2NativeSuperchainERC20'| 'copy-deploy-L2NativeSuperchainERC20' | 'download-contract-L2NativeSuperchainERC20' | 'download-deploy-L2NativeSuperchainERC20' |
                    'copy-contract-ERC20Votes'| 'copy-deploy-ERC20Votes' | 'download-contract-ERC20Votes' | 'download-deploy-ERC20Votes'

                    
export type GaEvent = {
    id: string;
    data: any;
    event: Action;
    type: string;
};

let initialAnalytics: GaEvent[] = [];

export const analyticsStore : Writable<GaEvent[]>  = writable(initialAnalytics);